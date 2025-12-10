import Link from 'next/link'

export default function Home() {
  return (
    <main className="container">
      <h1>Consultorio Médico</h1>
      <p>Sistema de gestión para consultorios médicos</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Link href="/login" className="login-link">
          Iniciar Sesión
        </Link>
        <Link href="/signup" className="login-link" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          Registrarse
        </Link>
      </div>
    </main>
  )
}

