'use client'

export default function DebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Debug - Variables de Entorno</h1>
      <div style={{ marginTop: '2rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
        <h2>Estado de las Variables:</h2>
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
          {supabaseUrl ? (
            <span style={{ color: 'green' }}>
              ✅ Configurada ({supabaseUrl.substring(0, 30)}...)
            </span>
          ) : (
            <span style={{ color: 'red' }}>❌ No configurada</span>
          )}
        </p>
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
          {supabaseKey ? (
            <span style={{ color: 'green' }}>
              ✅ Configurada ({supabaseKey.substring(0, 20)}...)
            </span>
          ) : (
            <span style={{ color: 'red' }}>❌ No configurada</span>
          )}
        </p>
      </div>

      <div style={{ marginTop: '2rem', background: '#fff3cd', padding: '1rem', borderRadius: '8px' }}>
        <h2>Instrucciones:</h2>
        <ol>
          <li>Verifica que el archivo <code>.env.local</code> existe en la raíz del proyecto</li>
          <li>Verifica que las variables tienen el prefijo <code>NEXT_PUBLIC_</code></li>
          <li>Verifica que no hay espacios alrededor del <code>=</code></li>
          <li>Reinicia el servidor después de crear/modificar <code>.env.local</code></li>
        </ol>
      </div>

      <div style={{ marginTop: '2rem', background: '#d1ecf1', padding: '1rem', borderRadius: '8px' }}>
        <h2>Formato correcto del .env.local:</h2>
        <pre style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
{`NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
        </pre>
      </div>
    </div>
  )
}

