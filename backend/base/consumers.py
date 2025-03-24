import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import CustomUser, ChatRoom, Message
from channels.db import database_sync_to_async
from django.utils import timezone

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']  # <- Change this line
        self.room_group_name = f"chat_{self.room_id}"

        print(f"Connecting to room: {self.room_id}")

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender_id']
        
        # 🔥 Get sender to fetch the username
        sender = await self.get_sender(sender_id)

        # ✅ Save to DB
        await self.save_message(sender_id, message)
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
                'sender_username': sender.username if sender else "Unknown",
                'timestamp': timezone.now().isoformat(),
            }
        )
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],  # ✅ Include this
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def save_message(self, sender_id, message):
        try:
            sender = CustomUser.objects.get(id=sender_id)

            # 🔥 Extract IDs from the room_id (example: "8_9")
            id1, id2 = map(int, self.room_id.split('_'))

            # 🔥 Fetch both users
            user1 = CustomUser.objects.get(id=id1)
            user2 = CustomUser.objects.get(id=id2)

            # 🔥 Determine which is buyer and which is seller based on roles
            if user1.role == 'Buyer' and user2.role == 'Seller':
                buyer, seller = user1, user2
            elif user2.role == 'Buyer' and user1.role == 'Seller':
                buyer, seller = user2, user1
            else:
                raise ValueError("Invalid chat participants: No Buyer/Seller role match")

            # 🔥 Get or create the ChatRoom
            chat_room, created = ChatRoom.objects.get_or_create(
                buyer=buyer,
                seller=seller,
                defaults={'created_at': timezone.now()}
            )
            print(f"✅ ChatRoom ID: {chat_room.id} | Created: {created}")

            # 🔥 Create the message
            Message.objects.create(room=chat_room, sender=sender, content=message)
            print(f"✅ Message saved to room {chat_room.id}")

        except CustomUser.DoesNotExist as e:
            print(f"❌ User not found: {e}")
        except Exception as e:
            print(f"❌ Error saving message: {e}")

    @database_sync_to_async
    def get_sender(self, sender_id):
        try:
            return CustomUser.objects.get(id=sender_id)
        except CustomUser.DoesNotExist:
            return None