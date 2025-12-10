'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient, isSupabaseConfigured } from '@/lib/supabase-client'
import '../login/login.css'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validación básica
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, completa todos los campos')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    setLoading(true)

    try {
      // Verificar si Supabase está configurado correctamente
      if (!isSupabaseConfigured()) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                           process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
        
        let errorMsg = 'Supabase no está configurado correctamente.\n\n'
        
        if (!supabaseUrl && !supabaseKey) {
          errorMsg += '❌ No se encontraron las variables de entorno.\n\n'
          errorMsg += 'Pasos a seguir:\n'
          errorMsg += '1. Crea un archivo .env.local en la raíz del proyecto\n'
          errorMsg += '2. Agrega las siguientes líneas:\n'
          errorMsg += '   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co\n'
          errorMsg += '   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui\n'
          errorMsg += '3. Reinicia el servidor (detén y vuelve a ejecutar npm run dev)'
        } else if (!supabaseUrl) {
          errorMsg += '❌ Falta NEXT_PUBLIC_SUPABASE_URL'
        } else if (!supabaseKey) {
          errorMsg += '❌ Falta NEXT_PUBLIC_SUPABASE_ANON_KEY'
        } else if (supabaseUrl.includes('placeholder')) {
          errorMsg += '❌ Las credenciales parecen ser placeholders. Usa tus credenciales reales de Supabase.'
        }
        
        setError(errorMsg)
        setLoading(false)
        return
      }

      const supabase = createSupabaseClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        // Mensajes de error más amigables
        let errorMessage = signUpError.message || 'Error al crear la cuenta'
        
        if (errorMessage.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica que las credenciales de Supabase sean correctas.'
        } else if (errorMessage.includes('already registered')) {
          errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.'
        } else if (errorMessage.includes('Invalid email')) {
          errorMessage = 'El email no es válido.'
        } else if (errorMessage.includes('Password')) {
          errorMessage = 'La contraseña no cumple con los requisitos mínimos.'
        }
        
        setError(errorMessage)
        setLoading(false)
        return
      }

      if (data.user) {
        // Verificar si el email necesita confirmación
        const needsEmailConfirmation = !data.user.email_confirmed_at
        
        if (needsEmailConfirmation) {
          setSuccess(true)
          setTimeout(() => {
            router.push('/login?message=Cuenta creada exitosamente. Por favor, verifica tu email antes de iniciar sesión.')
          }, 2000)
        } else {
          // Si el email ya está confirmado (verificación desactivada), redirigir directamente al dashboard
          setSuccess(true)
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        }
      }
    } catch (err: any) {
      let errorMessage = 'Error inesperado al crear la cuenta'
      
      if (err.message) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet y las credenciales de Supabase.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Side - Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title">¡Únete a nosotros!</h1>
          <p className="welcome-text">
            Estamos emocionados de tenerte con nosotros. Crea tu cuenta hoy y comienza a disfrutar de todas nuestras funcionalidades y servicios exclusivos.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="login-section">
          <div className="login-card">
            <h2 className="login-title">Registrarse</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  required
                  minLength={6}
                />
              </div>

              <div className="remember-me">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="acceptTerms">
                  Acepto los Términos de Servicio y la Política de Privacidad
                </label>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && (
                <div className="success-message">
                  ¡Cuenta creada exitosamente! Redirigiendo...
                </div>
              )}

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Registrarse ahora'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="forgot-password">
                  Iniciar sesión
                </Link>
              </p>
            </div>

            <div className="terms">
              <p>
                Al hacer clic en 'Registrarse ahora' aceptas nuestros{' '}
                <a href="#" className="terms-link">Términos de Servicio</a> |{' '}
                <a href="#" className="terms-link">Política de Privacidad</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

