'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import BookingForm from './BookingForm'

interface Appointment {
  appointmentID: number
  date: string
  formattedTime: string
  advisor: string
  advisorName: string
  status: string
}

interface Advisor {
  advisorID: string
  username: string
  email: string
  dob: string
  office: string
  experience: string
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [allAdvisors, setAllAdvisors] = useState<Advisor[]>([])
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isAdvisorListDialogOpen, setIsAdvisorListDialogOpen] = useState(false)
  const [isAdvisorInfoDialogOpen, setIsAdvisorInfoDialogOpen] = useState(false)
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null)

  useEffect(() => {
    fetchAppointments()
    fetchAdvisors()
    fetchAllAdvisors()
  }, [])

  const fetchAppointments = async () => {
    const response = await fetch('/api/appointments')
    const data = await response.json()
    setAppointments(data)
  }

  const fetchAdvisors = async () => {
    const response = await fetch('/api/advisors') // Assuming this endpoint fetches the list of advisors
    const data = await response.json()
    setAdvisors(data)
  }
  const fetchAllAdvisors = async () => {
    const response= await fetch('/api/allAdvisors')
    const data = await response.json()
    setAllAdvisors(data)
    console.log(allAdvisors)
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

  const canCancel = (date: string) => {
    const appointmentDate = new Date(date)
    const today = new Date()
    const diffTime = appointmentDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 3
  }

  const handleBookingSuccess = () => {
    setIsBookingDialogOpen(false)
    fetchAppointments()
  }

  const handleAdvisorClick = (advisor: Advisor) => {
    setSelectedAdvisor(advisor)
    setIsAdvisorInfoDialogOpen(true) // Open Advisor Info dialog separately
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Appointments</h2>

        <div className="flex space-x-2">
          {/* Book Appointment Dialog */}
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button>Book Appointment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <BookingForm onBookingSuccess={handleBookingSuccess} />
            </DialogContent>
          </Dialog>

          {/* View Advisors Dialog */}
          <Dialog open={isAdvisorListDialogOpen} onOpenChange={setIsAdvisorListDialogOpen}>
            <DialogTrigger asChild>
              <Button>View Advisors</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Advisors List</DialogTitle>
              </DialogHeader>
              <div>
                {allAdvisors.length > 0 ? (
                  allAdvisors.map((advisor,index) => (
                    <div key={`${advisor.advisorID}=${index}`} className="flex justify-between items-center mb-2">
                      <span>{advisor.username}</span>
                      <Button variant="outline" onClick={() => handleAdvisorClick(advisor)}>
                        Info
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>No advisors available.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Display Appointments */}
      {appointments.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {appointments.map((appointment) => (
            <div key={appointment.appointmentID} className="border p-4 rounded-md">
              <p><span className='font-bold'>Date: </span>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(appointment.date))}</p>
              <p className='mt-2'><span className='font-bold'>Time:</span> {appointment.formattedTime}</p>
              <p className='mt-2'><span className='font-bold'>Advisor: </span>{appointment.advisorName}</p>
              <p className='mt-2'><span className='font-bold'>Status:</span> <span
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
              </span></p>
              {canCancel(appointment.date) ? (
                <Button
                  onClick={() => handleStatusChange(appointment.appointmentID, 'Cancelled')}
                  variant="destructive"
                  className="mt-2 float-end"
                  disabled={appointment.status === 'Cancelled'}
                >
                  Cancel Appointment
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="destructive"
                          className="mt-2"
                          disabled
                        >
                          Cancel Appointment
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You can only cancel an appointment 3 days before the scheduled date</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No appointments available. Click 'Book Appointment' to schedule one.</p>
      )}

      {/* Advisor Info Dialog */}
      <Dialog open={isAdvisorInfoDialogOpen} onOpenChange={setIsAdvisorInfoDialogOpen}>
        <DialogContent>
          {selectedAdvisor && (
            <>
              <DialogHeader>
                <DialogTitle className='text-2xl'>{selectedAdvisor.username}'s Profile</DialogTitle>
              </DialogHeader>
              <p><strong>Email:</strong> {selectedAdvisor.email}</p>
              <p><strong>Office Location:</strong> {selectedAdvisor.office}</p>
              <p><strong>Experience:</strong> {selectedAdvisor.experience}</p>
              <p><strong>Date of Birth:</strong>{new Date(selectedAdvisor.dob).toLocaleDateString('en-CA')}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
