import os
from twilio.rest import Client
def send_whatsapp_notification(to_number, incidence_title, new_status):
    account_sid = os.environ.get('AC7d98415d6d659220a1fc9b2fd976116d')
    auth_token = os.environ.get('41b402efcb1e07a4bfd04bf5ad9bfb05')
    from_whatsapp_number = os.environ.get('+13156362641')

    try:
        client = Client(account_sid, auth_token)
        
        message_body = f" *FixFlow Informa:*\nHola, te notificamos que tu incidencia '{incidence_title}' ha cambiado al estado: *{new_status}*."
        
        to_whatsapp_number = f"whatsapp:{to_number}"
        
        message = client.messages.create(
            body=message_body,
            from_=from_whatsapp_number,
            to=to_whatsapp_number
        )
        print(f"WhatsApp enviado con éxito. SID: {message.sid}")
        return True
    except Exception as e:
        print(f"Error enviando mensaje de WhatsApp: {e}")
        return False