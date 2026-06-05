import os
from twilio.rest import Client

def send_whatsapp_notification(to_number, incidence_title, new_status):
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

    try:
        client = Client(account_sid, auth_token)
        
        if new_status == 'En progreso':
            message_body = f"¡Hola! Buenas noticias, nuestro equipo técnico ya se ha puesto manos a la obra con tu reporte sobre '{incidence_title}'. Te avisaremos en cuanto esté solucionado. ¡Gracias por tu paciencia!"
        elif new_status == 'Resuelto':
            message_body = f" ✅ ¡Hola! Nos alegra comunicarte que tu avería '{incidence_title}' ya ha sido solucionada con éxito. Recuerda que puedes descargar el reporte completo en tu panel de FixFlow. ¡Que tengas un gran día!"
        else:
            message_body = f"¡Hola! Te escribimos de FixFlow para avisarte que tu reporte '{incidence_title}' ahora está en estado: *{new_status}*. ¡Te mantendremos informado!"
        
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