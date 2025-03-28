import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import CustomUser, ChatRoom, Message
from channels.db import database_sync_to_async
from django.utils import timezone

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Try to establish the WebSocket connection and handle potential errors
        try:
            self.room_id = self.scope['url_route']['kwargs']['room_id']
            buyer_id, seller_id = map(int, self.room_id.split('_'))
            self.room_group_name = f"chat_{self.room_id}"

            # Log connection details for debugging
            print(f"Connecting to room: {self.room_id}, Room Group: {self.room_group_name}")

            # Attempt to add the current channel to the room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        except ValueError as e:
            # Handle invalid room_id format
            print(f"❌ Error parsing room_id: {e}")
            await self.close()
        except Exception as e:
            # Handle any other unexpected errors
            print(f"❌ Unexpected error during connect: {e}")
            await self.close()

    async def disconnect(self, close_code):
        # Ensure that the room_group_name is set before attempting to remove the channel
        if hasattr(self, 'room_group_name'):
            try:
                print(f"Disconnecting from room: {self.room_group_name}")
                await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            except Exception as e:
                print(f"❌ Error during disconnect: {e}")
        else:
            print("❌ No room_group_name found. Skipping group discard.")

    async def receive(self, text_data):
        # Handle incoming messages and ensure proper error handling
        try:
            data = json.loads(text_data)
            message = data.get('message')
            sender_id = data.get('sender_id')

            # Validate message structure
            if not message or not sender_id:
                print(f"❌ Invalid message format received: {data}")
                return  # Ignore invalid messages

            # Fetch sender details and save message
            sender = await self.get_sender(sender_id)
            if not sender:
                print(f"❌ Sender with ID {sender_id} does not exist.")
                return  # Ignore if sender doesn't exist

            await self.save_message(sender_id, message)

            # Broadcast the message to the room group
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
        except json.JSONDecodeError:
            print("❌ Error decoding JSON message.")
        except Exception as e:
            print(f"❌ Error processing message: {e}")

    async def chat_message(self, event):
        # Send the chat message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def save_message(self, sender_id, message):
        # Save the message to the database with associated buyer and seller
        try:
            buyer_id, seller_id = map(int, self.room_id.split('_'))
            buyer = CustomUser.objects.get(id=buyer_id)
            seller = CustomUser.objects.get(id=seller_id)

            # Ensure correct roles for buyer and seller
            if buyer.role.lower() != 'buyer' or seller.role.lower() != 'seller':
                print("❌ Invalid chat participants: Incorrect roles")
                return

            # Get or create the chat room
            chat_room, created = ChatRoom.objects.get_or_create(
                buyer=buyer,
                seller=seller,
                defaults={'created_at': timezone.now()}
            )
            print(f"✅ ChatRoom ID: {chat_room.id} | Created: {created}")

            # Save the message
            sender = CustomUser.objects.get(id=sender_id)
            msg = Message.objects.create(room=chat_room, sender=sender, content=message)
            print(f"✅ Message saved: {msg.content} to ChatRoom ID: {chat_room.id}")

        except CustomUser.DoesNotExist as e:
            print(f"❌ Error: User does not exist - {e}")
        except Exception as e:
            print(f"❌ Error saving message: {e}")

    @database_sync_to_async
    def get_sender(self, sender_id):
        # Retrieve sender user by ID
        try:
            return CustomUser.objects.get(id=sender_id)
        except CustomUser.DoesNotExist:
            return None