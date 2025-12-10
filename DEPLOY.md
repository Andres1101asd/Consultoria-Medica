# Guía de Despliegue a Producción

Esta guía te ayudará a poner tu aplicación en producción.

## Opción 1: Desplegar en Vercel (Recomendado)

Vercel es la plataforma oficial de Next.js y es la forma más fácil de desplegar.

### Pasos:

1. **Instala Vercel CLI** (opcional, también puedes usar la interfaz web):
   ```bash
   npm i -g vercel
   ```

2. **Haz login en Vercel**:
   ```bash
   vercel login
   ```

3. **Despliega tu aplicación**:
   ```bash
   vercel
   ```
   
   O simplemente conecta tu repositorio de GitHub en [vercel.com](https://vercel.com)

4. **Configura las variables de entorno en Vercel**:
   - Ve a tu proyecto en Vercel
   - Settings > Environment Variables
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` o `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

5. **Redeploy** después de agregar las variables de entorno

### Configuración de Dominio:

1. Ve a Settings > Domains en tu proyecto de Vercel
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

## Opción 2: Desplegar en Otro Servidor

### Requisitos:
- Node.js 18+ instalado
- npm o yarn

### Pasos:

1. **Construye la aplicación**:
   ```bash
   npm run build
   ```

2. **Inicia el servidor de producción**:
   ```bash
   npm start
   ```

3. **Configura variables de entorno**:
   Crea un archivo `.env.production` o configura las variables en tu servidor:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
   ```

4. **Usa un proceso manager** (recomendado):
   ```bash
   # Instala PM2
   npm install -g pm2
   
   # Inicia la aplicación
   pm2 start npm --name "consultorio-medico" -- start
   
   # Guarda la configuración
   pm2 save
   pm2 startup
   ```

### Usando Nginx como Proxy Reverso:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Opción 3: Docker

Crea un `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Construir y ejecutar:
```bash
docker build -t consultorio-medico .
docker run -p 3000:3000 --env-file .env.production consultorio-medico
```

## Verificación Pre-Despliegue

Antes de desplegar, verifica:

- [ ] Las variables de entorno están configuradas
- [ ] El build se completa sin errores: `npm run build`
- [ ] La aplicación funciona en local: `npm start`
- [ ] Las rutas protegidas funcionan correctamente
- [ ] Supabase está configurado y accesible

## Post-Despliegue

1. Verifica que la aplicación carga correctamente
2. Prueba el login y registro
3. Verifica que el dashboard funciona
4. Revisa los logs en caso de errores

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que las variables estén configuradas en tu plataforma de hosting
- Asegúrate de que tengan el prefijo `NEXT_PUBLIC_`
- Reinicia la aplicación después de agregar variables

### Error: "Failed to fetch"
- Verifica que las credenciales de Supabase sean correctas
- Verifica que Supabase permita conexiones desde tu dominio
- Revisa la configuración de CORS en Supabase

### La aplicación no carga
- Verifica los logs del servidor
- Asegúrate de que el puerto esté correctamente configurado
- Verifica que todas las dependencias estén instaladas

