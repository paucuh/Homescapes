import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import CustomUser, ChatRoom, Message, House
from channels.db import database_sync_to_async
from django.utils import timezone

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.room_id = self.scope['url_route']['kwargs']['room_id']
            buyer_id, seller_id = map(int, self.room_id.split('_'))
            self.room_group_name = f"chat_{self.room_id}"

            print(f"Connecting to room: {self.room_id}")
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        except ValueError as e:
            print(f"❌ Error parsing room_id: {e}")
            await self.close()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if 'message' not in data or 'sender_id' not in data:
                print("❌ Invalid message format received:", data)
                return  # Ignore invalid data

            message = data['message']
            sender_id = data['sender_id']

            sender = await self.get_sender(sender_id)
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
        except Exception as e:
            print(f"❌ Error processing message: {e}")

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
            buyer_id, seller_id = map(int, self.room_id.split('_'))

            buyer = CustomUser.objects.get(id=buyer_id)
            seller = CustomUser.objects.get(id=seller_id)

            # Ensure correct roles
            if buyer.role.lower() != 'buyer' or seller.role.lower() != 'seller':
                print("❌ Invalid chat participants: Incorrect roles")
                return

            chat_room, created = ChatRoom.objects.get_or_create(
                buyer=buyer,
                seller=seller,
                defaults={'created_at': timezone.now()}
            )
            print(f"✅ ChatRoom ID: {chat_room.id} | Created: {created}")

            sender = CustomUser.objects.get(id=sender_id)
            msg = Message.objects.create(room=chat_room, sender=sender, content=message)
            print(f"✅ Message saved: {msg.content} to ChatRoom ID: {chat_room.id}")

        except Exception as e:
            print(f"❌ Error saving message: {e}")

    @database_sync_to_async
    def get_sender(self, sender_id):
        try:
            return CustomUser.objects.get(id=sender_id)
        except CustomUser.DoesNotExist:
            return None