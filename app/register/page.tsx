'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const{toast}=useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    dateOfBirth: '',
    fieldOfStudy: '',
    qualification: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const response = await fetch('/api/auth/register/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await response.json()
    
    if (response.ok) {
      router.push('/login')
      toast({
        title: 'Success',
        description: 'Account created successfully. Please login to continue',
        variant: 'success'
      })
      
    } else {
      setError(data.error || 'An error occurred during registration')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-center bg-[url('/Foambg.svg')]">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className='text-3xl text-center'>University</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="">
            <div className='grid grid-rows-4 grid-flow-col gap-4 mb-6'>
            <div className=" order-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="order-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username"
                type="text" 
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="order-3">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="order-4">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="order-5">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input 
                id="dateOfBirth" 
                name="dateOfBirth"
                type="date"
                className=''
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="order-6">
              <Label htmlFor="fieldOfStudy">Preferred Field of Study</Label>
              <Select onValueChange={(value) => handleSelectChange('fieldOfStudy', value)} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select field of study" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Accounting-Business-Finance-Marketing-science">Accounting, Business, Finance, Marketing</SelectItem>
                    <SelectItem value="Actuarial-Statistics">Actuarial, Statistics</SelectItem>
                    <SelectItem value="Biology-Medicine-Psychology">Biology, Medicine and Psychology</SelectItem>
                    <SelectItem value="Communication-Creative Arts">Communication, Creative Arts</SelectItem>
                    <SelectItem value="Computing">Computing</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Hospitality-Culinary-Events Management">Hospitality, Culinary, Events Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="order-7">
              <Label htmlFor="qualification">Qualification</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('qualification', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stpm">STPM</SelectItem>
                  <SelectItem value="spm">SPM</SelectItem>
                  <SelectItem value="igcse">IGCSE</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button className="flex place-self-center bg-green-500 hover:bg-green-500 px-8 hover:scale-105" type="submit">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}

