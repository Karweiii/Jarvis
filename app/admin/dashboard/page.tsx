'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from '@/hooks/use-toast'
import { Search, Plus, Trash2  } from 'lucide-react'
import{useToast} from '@/hooks/use-toast'

interface User{
    user_id:number
    username:string
    email:string
    role:string
}


export default function AdminDashboard() {
  const{toast}=useToast()
  const [users, setUsers] = useState<User[]>([])
  const [newAdvisor, setNewAdvisor] = useState({ username: '', email: '', password: '',dateOfBirth:'' })
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [courseSearch, setCourseSearch] = useState('')

  useEffect(()=>{
    fetchUsers();
  },[])

  useEffect(()=>{
    setFilteredUsers(
        users.filter(user => 
          user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.role.toLowerCase().includes(userSearch.toLowerCase())
        )
      )
    }, [users, userSearch])


  const fetchUsers = async () => {
    try{
        const response=await fetch('/api/users')
        if(!response.ok){
            throw new Error('Failed to fetch users')
        }

        const data= await response.json()
        setUsers(data)
    }catch(error){
        console.error('Failed to fetch users:',error)
        toast({
            title:"Error",
            description:"Failed to fetch users",
            variant:"failure"
        })
    }
  }
  
  const handleCreateAdvisor = async(e: React.FormEvent) => {
    e.preventDefault()
    try{
      const response=await fetch('/api/auth/register/advisor',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(newAdvisor)
      })
      const data=await response.json()
      if(!response.ok){
        console.error('Failed to create advisor:',data)
        toast({
          title:"Error",
          description:"Failed to create advisor",
          variant:"failure"
        })
        return
      }
      await fetchUsers()
      toast({
        title:"Success",
        description:"Advisor created successfully",
        variant:"success"
      })
      setNewAdvisor({ username: '', email: '', password: '',dateOfBirth:'' })
    }catch(error){
      console.error('Failed to create advisor:',error)
      toast({
        title:"Error",
        description:"Failed to create advisor",
        variant:"failure"
      })
    }
  }

  const handleDeleteUser = async(id: number) => {
    try{
        const response= await fetch(`/api/users/${id}`,{method:'DELETE'})
        if(!response.ok){
            throw new Error('Failed to delete user')
        }
        await fetchUsers()
        toast({
            title:"Success",
            description:"User deleted successfully",
            variant:"success"
        })
    }catch(error){
        console.error('Failed to delete user:',error)
        toast({
            title:"Error",
            description:"Failed to delete user",
            variant:"failure"
        })
    }
  }
  


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <Tabs defaultValue="users" className="mb-8">
        <TabsList>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="advisors">Create Advisor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manage User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex items-center space-x-2 mb-4">
                <Search className="w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><span className={`px-2 py-1 rounded text-white ${user.role==='student'?'bg-blue-500':'bg-green-500'}`}>{user.role}</span></TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleDeleteUser(user.user_id)}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advisors">
          <Card>
            <CardHeader>
              <CardTitle>Create Academic Advisor Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdvisor}>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="advisorName">Name</Label>
                    <Input 
                      id="advisorName"
                      value={newAdvisor.username}
                      onChange={(e) => setNewAdvisor({...newAdvisor, username: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="advisorEmail">Email</Label>
                    <Input 
                      id="advisorEmail"
                      type="email"
                      value={newAdvisor.email}
                      onChange={(e) => setNewAdvisor({...newAdvisor, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="advisorPassword">Password</Label>
                    <Input 
                      id="advisorPassword"
                      type="password"
                      value={newAdvisor.password}
                      onChange={(e) => setNewAdvisor({...newAdvisor, password: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth"
                      name='dateOfBirth'
                      type="date"
                      value={newAdvisor.dateOfBirth}
                      onChange={(e) => setNewAdvisor({...newAdvisor, dateOfBirth: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit">Create Advisor Account</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

