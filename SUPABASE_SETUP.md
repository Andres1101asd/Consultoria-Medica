# Configuración de Supabase - Desactivar Verificación de Email

El mensaje "Por favor, verifica tu email antes de iniciar sesión" aparece porque Supabase está configurado para requerir verificación de email.

## Solución: Desactivar Verificación de Email (Recomendado para Desarrollo)

### Pasos:

1. **Ve a tu proyecto en Supabase**
   - Abre [https://supabase.com](https://supabase.com)
   - Selecciona tu proyecto

2. **Ve a Authentication > Settings**
   - En el menú lateral, haz clic en "Authentication"
   - Luego haz clic en "Settings" (Configuración)

3. **Desactiva "Enable email confirmations"**
   - Busca la sección "Email Auth"
   - Encuentra la opción "Enable email confirmations"
   - **Desactívala** (toggle OFF)
   - Haz clic en "Save" (Guardar)

4. **Reinicia tu aplicación**
   - Detén el servidor (Ctrl+C)
   - Vuelve a ejecutar: `npm run dev`

### Después de desactivar:

- Los usuarios podrán iniciar sesión inmediatamente después de registrarse
- No necesitarán verificar su email
- El login funcionará normalmente

## Alternativa: Configurar Email SMTP (Para Producción)

Si quieres mantener la verificación de email pero que funcione correctamente:

1. **Ve a Authentication > Settings > SMTP Settings**
2. **Configura un servidor SMTP** (Gmail, SendGrid, etc.)
3. **Activa "Enable email confirmations"**
4. Los usuarios recibirán emails de verificación

### Configuración rápida con Gmail:

1. Genera una "App Password" en tu cuenta de Google
2. En Supabase, configura:
   - **Host**: smtp.gmail.com
   - **Port**: 587
   - **Username**: tu-email@gmail.com
   - **Password**: tu-app-password
   - **Sender email**: tu-email@gmail.com
   - **Sender name**: Tu Nombre

## Verificar que funciona:

1. Crea un nuevo usuario en `/signup`
2. Intenta iniciar sesión inmediatamente
3. Debería funcionar sin necesidad de verificar email

## Nota Importante:

- **Para desarrollo**: Desactiva la verificación de email
- **Para producción**: Activa la verificación y configura SMTP correctamente

