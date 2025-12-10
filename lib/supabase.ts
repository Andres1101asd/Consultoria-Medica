import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// Aceptar ambas variantes de la clave
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''

// Solo lanzar error en producción si faltan las variables
if ((!supabaseUrl || !supabaseAnonKey) && process.env.NODE_ENV === 'production') {
  throw new Error('Missing Supabase environment variables')
}

// En desarrollo, crear un cliente con valores placeholder si no están configurados
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

