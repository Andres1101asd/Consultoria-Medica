'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'
import './dashboard.css'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pacientes' | 'citas' | 'perfil'>('pacientes')
  const [pacientes, setPacientes] = useState<any[]>([])
  const [citas, setCitas] = useState<any[]>([])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createSupabaseClient()
      
      // Primero verificar la sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      console.log('🔍 Verificando sesión en dashboard:', {
        hasSession: !!session,
        sessionError: sessionError?.message,
        userId: session?.user?.id
      })

      if (sessionError) {
        console.error('❌ Error al obtener sesión:', sessionError)
        router.push('/login?error=session_expired')
        return
      }

      if (!session) {
        console.warn('⚠️ No hay sesión activa')
        router.push('/login?error=no_session')
        return
      }

      // Verificar el usuario
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error('❌ Error al obtener usuario:', userError)
        router.push('/login?error=user_error')
        return
      }

      if (!user) {
        console.warn('⚠️ No se encontró usuario')
        router.push('/login?error=no_user')
        return
      }

      console.log('✅ Usuario autenticado:', user.email)
      setUser(user)
      loadDashboardData()
    } catch (err: any) {
      console.error('❌ Error al verificar usuario:', err)
      router.push('/login?error=unknown')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    // Aquí cargarías los datos reales desde Supabase
    // Por ahora, datos de ejemplo
    setPacientes([
      { id: 1, nombre: 'Juan Pérez', edad: 35, telefono: '555-1234', ultimaVisita: '2024-01-15' },
      { id: 2, nombre: 'María García', edad: 28, telefono: '555-5678', ultimaVisita: '2024-01-20' },
      { id: 3, nombre: 'Carlos López', edad: 42, telefono: '555-9012', ultimaVisita: '2024-01-18' },
    ])

    setCitas([
      { id: 1, paciente: 'Juan Pérez', fecha: '2024-01-25', hora: '10:00', motivo: 'Consulta general' },
      { id: 2, paciente: 'María García', fecha: '2024-01-25', hora: '11:00', motivo: 'Control' },
      { id: 3, paciente: 'Carlos López', fecha: '2024-01-26', hora: '09:00', motivo: 'Revisión' },
    ])
  }

  const handleLogout = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Consultorio Médico</h1>
            <p className="welcome-text">Bienvenido, {user.email}</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'pacientes' ? 'active' : ''}`}
              onClick={() => setActiveTab('pacientes')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Pacientes</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'citas' ? 'active' : ''}`}
              onClick={() => setActiveTab('citas')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Citas</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Mi Perfil</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon patients">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{pacientes.length}</h3>
                <p>Pacientes</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon appointments">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{citas.length}</h3>
                <p>Citas Hoy</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <h3>5</h3>
                <p>Pendientes</p>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'pacientes' && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Lista de Pacientes</h2>
                  <button className="btn-primary">+ Nuevo Paciente</button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Teléfono</th>
                        <th>Última Visita</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pacientes.map((paciente) => (
                        <tr key={paciente.id}>
                          <td>{paciente.nombre}</td>
                          <td>{paciente.edad} años</td>
                          <td>{paciente.telefono}</td>
                          <td>{paciente.ultimaVisita}</td>
                          <td>
                            <button className="btn-action">Ver</button>
                            <button className="btn-action">Editar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'citas' && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Próximas Citas</h2>
                  <button className="btn-primary">+ Nueva Cita</button>
                </div>
                <div className="appointments-grid">
                  {citas.map((cita) => (
                    <div key={cita.id} className="appointment-card">
                      <div className="appointment-date">
                        <span className="date-day">{new Date(cita.fecha).getDate()}</span>
                        <span className="date-month">
                          {new Date(cita.fecha).toLocaleDateString('es-ES', { month: 'short' })}
                        </span>
                      </div>
                      <div className="appointment-info">
                        <h3>{cita.paciente}</h3>
                        <p className="appointment-time">🕐 {cita.hora}</p>
                        <p className="appointment-reason">{cita.motivo}</p>
                        <div className="appointment-actions">
                          <button className="btn-small">Confirmar</button>
                          <button className="btn-small btn-outline">Cancelar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'perfil' && (
              <div className="tab-panel">
                <div className="profile-section">
                  <h2>Mi Perfil</h2>
                  <div className="profile-card">
                    <div className="profile-avatar">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="profile-info">
                      <h3>Información del Usuario</h3>
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">ID de Usuario:</span>
                        <span className="info-value">{user.id}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Fecha de Registro:</span>
                        <span className="info-value">
                          {new Date(user.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Última Sesión:</span>
                        <span className="info-value">
                          {new Date().toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

