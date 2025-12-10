import { createClient } from '@supabase/supabase-js'

// Cliente para uso en componentes del cliente
export function createSupabaseClient() {
  // En Next.js, las variables NEXT_PUBLIC_ están disponibles en el cliente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Aceptar ambas variantes de la clave
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  // Debug: mostrar qué variables están disponibles (solo en desarrollo)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔍 Debug Supabase Config:')
    console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada')
    console.log('ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada')
    console.log('PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? '✅ Configurada' : '❌ No configurada')
    console.log('Key usada:', supabaseAnonKey ? '✅ Configurada' : '❌ No configurada')
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ Asegúrate de:')
      console.warn('1. El archivo .env.local existe en la raíz del proyecto')
      console.warn('2. Las variables tienen el prefijo NEXT_PUBLIC_')
      console.warn('3. Has reiniciado el servidor después de crear/modificar .env.local')
      console.warn('4. No hay espacios alrededor del = en .env.local')
    }
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    // Retornar un cliente con valores placeholder para desarrollo
    return createClient('https://placeholder.supabase.co', 'placeholder-key')
  }

  // Validar que la URL parece correcta
  if (!supabaseUrl.startsWith('http')) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL debe comenzar con http:// o https://')
    return createClient('https://placeholder.supabase.co', 'placeholder-key')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Función helper para verificar la configuración
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Aceptar ambas variantes de la clave
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('placeholder')
  )
}

