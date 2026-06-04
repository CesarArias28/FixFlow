import os
from dotenv import load_dotenv

load_dotenv()

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
from_whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

print(f"SID: {account_sid}")
print(f"From: {from_whatsapp_number}")

from twilio.rest import Client

try:
    client = Client(account_sid, auth_token)
    message_body = "🛠️ *Test Directo FixFlow*"
    to_whatsapp_number = "whatsapp:+34697338607"
    
    print(f"Sending to: {to_whatsapp_number}")
    message = client.messages.create(
        body=message_body,
        from_=f"whatsapp:{from_whatsapp_number}",
        to=to_whatsapp_number
    )
    print(f"SUCCESS! SID: {message.sid}")
except Exception as e:
    print(f"ERROR: {e}")
