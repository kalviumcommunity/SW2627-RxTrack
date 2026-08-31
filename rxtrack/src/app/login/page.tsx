'use client'

import { useState } from 'react'
import { Button, Input, Card } from '../../components'
import apiClient from '../../lib/api'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      })
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', response.data.role)
      
      if (response.data.role === 'DOCTOR') {
        router.push('/doctor')
      } else {
        router.push('/pharmacy')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">RxTrack Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            type="email"
            placeholder="doctor@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            label={loading ? 'Logging in...' : 'Login'}
            type="submit"
            variant="primary"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  )
}