# Proyecto Next.js con Supabase

Este es un proyecto creado con [Next.js](https://nextjs.org/) y [Supabase](https://supabase.com/) para autenticación.

## Configuración de Supabase

**⚠️ IMPORTANTE: Sin configurar Supabase, verás el error "Failed to fetch" al intentar registrarte o iniciar sesión.**

### Pasos para configurar:

1. Crea una cuenta en [Supabase](https://supabase.com/)
2. Crea un nuevo proyecto
3. Ve a **Settings > API** en tu proyecto
4. Copia los siguientes valores:
   - **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
   - **anon public key** (una clave larga que comienza con `eyJ...`)
5. Crea un archivo `.env.local` en la raíz del proyecto (junto a `package.json`)
6. Agrega las siguientes líneas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

7. **Reinicia el servidor de desarrollo** después de crear el archivo `.env.local`:
   ```bash
   # Detén el servidor (Ctrl+C) y vuelve a ejecutar:
   npm run dev
   ```

### Solución de problemas

**Error "Failed to fetch":**
- Verifica que el archivo `.env.local` existe en la raíz del proyecto
- Verifica que las variables tienen el prefijo `NEXT_PUBLIC_`
- Verifica que no hay espacios alrededor del `=` en el archivo `.env.local`
- Reinicia el servidor de desarrollo después de crear/modificar `.env.local`
- Verifica que las credenciales de Supabase son correctas

## Comenzar

Primero, instala las dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
```

Luego, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Páginas Disponibles

- `/` - Página principal
- `/login` - Página de inicio de sesión
- `/signup` - Página de registro

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
├── app/              # Directorio de la aplicación (App Router)
│   ├── login/       # Página de login
│   ├── signup/      # Página de registro
│   ├── layout.tsx   # Layout principal
│   ├── page.tsx     # Página principal
│   └── globals.css  # Estilos globales
├── lib/             # Utilidades y configuraciones
│   ├── supabase.ts         # Cliente de Supabase (servidor)
│   └── supabase-client.ts  # Cliente de Supabase (cliente)
├── public/          # Archivos estáticos
├── next.config.js   # Configuración de Next.js
└── tsconfig.json    # Configuración de TypeScript
```

## Funcionalidades

- ✅ Autenticación con Supabase
- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Validación de formularios
- ✅ Diseño responsive
- ✅ Manejo de errores
