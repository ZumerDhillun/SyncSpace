import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logoutStore = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  async function register(name: string, email: string, password: string) {
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password })
      setAuth(data.user, data.token)
      toast.success('Welcome to SyncSpace!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      setAuth(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    logoutStore()
    navigate('/')
  }

  return { register, login, logout, loading }
}
