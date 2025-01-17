'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FiInfo } from 'react-icons/fi' // Info icon

interface Appointment {
  appointmentID: number
  date: string
  formattedTime: string
  advisorID: string
  advisorName: string
  advisorUserID: string
  studentID: string
  studentName: string
  studentUserID: string
  status: string
}

interface StudentProfile {
  username?: string
  email?: string
  dob?: string
  preferredField?: string
  educationBg?: string
}

export default function AdvisorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      const data = await response.json()
      setAppointments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, appointmentId: id }),
      })

      if (!response.ok) {
        throw new Error('Failed to update appointment status')
      }

      const updatedAppointments = await response.json()
      setAppointments(
        appointments.map((app) =>
          app.appointmentID === id ? { ...app, status: newStatus } : app
        )
      )
    } catch (error) {
      console.error('Error updating appointment status:', error)
      alert('Failed to update appointment status')
    }
  }

  const fetchStudentProfile = async (userID: string) => {
    setProfileLoading(true)
    try {
      const response = await fetch(`/api/profile/${userID}`)
      if (!response.ok) {
        throw new Error('Failed to fetch student profile')
      }
      const studentProfile = await response.json()
      setSelectedStudent(studentProfile)
      console.log('Fetched student profile:', studentProfile)
    } catch (error) {
      console.error('Error fetching student profile:', error)
      alert('Failed to fetch student profile')
    } finally {
      setProfileLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Advisor Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advisor Dashboard</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentID}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{appointment.studentName}</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="p-1"
                            onClick={() => fetchStudentProfile(appointment.studentUserID)}
                          >
                            <FiInfo className="text-gray-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Student Profile</DialogTitle>
                          </DialogHeader>
                          {profileLoading ? (
                            <p>Loading profile...</p>
                          ) : selectedStudent ? (
                            <Table>
                            <TableBody>
                                <TableRow>
                                <TableCell className='text-right w-[40%]'><strong>Name:</strong></TableCell>
                                <TableCell>{selectedStudent?.username || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell className='text-right w-[40%]'><strong>Email:</strong></TableCell>
                                <TableCell>{selectedStudent?.email || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell className='text-right w-[40%]'><strong>Date of Birth:</strong></TableCell>
                                <TableCell>{selectedStudent?.dob || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell className='text-right w-[40%]'><strong>Education Background:</strong></TableCell>
                                <TableCell>{selectedStudent?.educationBg || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell className='text-right w-[40%]'><strong>Preferred Field of Study:</strong></TableCell>
                                <TableCell>{selectedStudent?.preferredField || 'N/A'}</TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                          ) : (
                            <p>No profile data available.</p>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(appointment.date).toLocaleDateString('en-CA')}</TableCell>
                  <TableCell>{appointment.formattedTime}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        appointment.status === 'Pending'
                          ? 'bg-yellow-500'
                          : appointment.status === 'Confirmed'
                          ? 'bg-green-500'
                          : appointment.status === 'Cancelled'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleStatusChange(appointment.appointmentID, 'Confirmed')}
                      className="mr-2"
                      variant="outline"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(appointment.appointmentID, 'Cancelled')}
                      variant="destructive"
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
