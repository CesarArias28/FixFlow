import os
from twilio.rest import Client

def send_whatsapp_notification(to_number, incidence_title, new_status):
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

    try:
        client = Client(account_sid, auth_token)
        
        message_body = f"🛠️ *FixFlow Informa:*\nHola, te notificamos que tu incidencia '{incidence_title}' ha cambiado al estado: *{new_status}*."
        
        to_whatsapp_number = f"whatsapp:{to_number}"
        
        message = client.messages.create(
            body=message_body,
            from_=f"whatsapp:{from_whatsapp_number}",
            to=to_whatsapp_number
        )
        print(f"WhatsApp enviado con éxito. SID: {message.sid}")
        return True
    except Exception as e:
        print(f"Error enviando mensaje de WhatsApp: {e}")
        return False