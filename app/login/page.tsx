'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import Foambg from '/public/Foambg.svg'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {

        localStorage.setItem('userRole',data.role)
        localStorage.setItem('token',data.token)
        switch (data.role) {
          case 'student':
            router.push('/')
            break
          case 'advisor':
            router.push('/advisor-dashboard')
            break
          case 'admin':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/')
        }
      } else {
        setError(data.error || 'An error occurred during login')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-center bg-cover bg-no-repeat" style={{ 
      backgroundImage: `url('/Foambg.svg')` 
    }}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center">University</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            <Button 
              className="w-full rounded-full bg-green-500 hover:bg-green-600 mt-4" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center space-y-2">
          <p className="text-sm">Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link></p>
          <p className="text-sm">Or continue as <Link href="/" className="text-blue-500 hover:underline">Guest</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}

