'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const supabase = createSupabaseClient()
      
      console.log('🔍 Configuración de Supabase:')
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Key configurada:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setResult({
        success: !error && !!data.user,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null,
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed: data.user.email_confirmed_at ? 'Sí' : 'No',
          created_at: data.user.created_at
        } : null,
        session: data?.session ? {
          access_token: data.session.access_token ? 'Presente' : 'Ausente',
          expires_at: new Date(data.session.expires_at * 1000).toLocaleString()
        } : null
      })

      if (!error && data.user) {
        // Cerrar sesión después del test
        await supabase.auth.signOut()
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: {
          message: err.message || 'Error desconocido',
          stack: err.stack
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test de Login - Diagnóstico</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Esta página te ayuda a diagnosticar problemas con el login
      </p>

      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Configuración de Supabase:</h3>
        <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ No configurada'}</p>
        <p><strong>Key:</strong> {(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) ? '✅ Configurada' : '❌ No configurada'}</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="tu@email.com"
          />
        </label>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Tu contraseña"
          />
        </label>
      </div>

      <button
        onClick={testLogin}
        disabled={loading || !email || !password}
        style={{
          background: '#667eea',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading || !email || !password ? 0.6 : 1
        }}
      >
        {loading ? 'Probando...' : 'Probar Login'}
      </button>

      {result && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          borderRadius: '8px',
          background: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <h3>{result.success ? '✅ Login Exitoso' : '❌ Error en Login'}</h3>
          
          {result.error && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Error:</h4>
              <pre style={{ background: '#fff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify(result.error, null, 2)}
              </pre>
            </div>
          )}

          {result.user && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Usuario:</h4>
              <pre style={{ background: '#fff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify(result.user, null, 2)}
              </pre>
              {result.user.email_confirmed === 'No' && (
                <p style={{ color: '#856404', marginTop: '0.5rem' }}>
                  ⚠️ El email no está confirmado. Esto puede impedir el login.
                </p>
              )}
            </div>
          )}

          {result.session && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Sesión:</h4>
              <pre style={{ background: '#fff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                {JSON.stringify(result.session, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
        <h4>💡 Consejos:</h4>
        <ul>
          <li>Abre la consola del navegador (F12) para ver más detalles</li>
          <li>Si el email no está confirmado, verifica tu bandeja de entrada</li>
          <li>Verifica que las credenciales sean correctas</li>
          <li>Si ves "Failed to fetch", verifica tu conexión y las credenciales de Supabase</li>
        </ul>
      </div>
    </div>
  )
}

