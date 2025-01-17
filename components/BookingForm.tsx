'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { format, parse, isWeekend } from 'date-fns'

interface Advisor {
  username: string;
  advisor_id: string;
}

interface BookingFormProps {
  onBookingSuccess: () => void
}

export default function BookingForm({ onBookingSuccess }: BookingFormProps) {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [advisors, setAdvisors] = useState<Advisor[]>([])
    const [selectedAdvisor, setSelectedAdvisor] = useState<null | string>(null)
    const [dateError, setDateError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
  
    const timeOptions = [
      '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ]

  useEffect(() => {
    const fetchAdvisors = async () => {
      if (date && time && !dateError) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/advisors?date=${date}&time=${time}`)
          const data = await response.json()

          let newAdvisors: Advisor[] = [];
          if (data && Array.isArray(data.advisors)) {
            newAdvisors = data.advisors.filter((advisor: Advisor) => advisor.advisor_id !== undefined && String(advisor.advisor_id).trim() !== '');
          } else if (Array.isArray(data)) {
            newAdvisors = data.filter((advisor: Advisor) => advisor.advisor_id !== undefined && String(advisor.advisor_id).trim() !== '');
          }

          console.log("Fetched Advisors:", data);
          console.log("New Advisors after filtering:", newAdvisors);
          setAdvisors(newAdvisors)
        
          // Reset selectedAdvisor if it's not in the new list of advisors
          if (!newAdvisors.some((advisor) => advisor.advisor_id === selectedAdvisor) || selectedAdvisor === null) {
            setSelectedAdvisor(null)
          }
        } catch (error) {
          console.error('Error fetching advisors:', error)
          setAdvisors([])
          setSelectedAdvisor(null)
        } finally {
          setIsLoading(false)
        }
      } else {
        setAdvisors([])
        setSelectedAdvisor(null)
      }
    }

    fetchAdvisors()
  }, [date, time, dateError])

  const validateDate = (selectedDate: string) => {
    const parsedDate = parse(selectedDate, 'yyyy-MM-dd', new Date())
    if (isWeekend(parsedDate)) {
      setDateError('Please select a working day (Monday to Friday)')
      return false
    }
    setDateError('')
    return true
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    setDate(selectedDate)
    validateDate(selectedDate)
  }

  const handleTimeChange = (value: string) => {
    setTime(value)
    setSelectedAdvisor(null)  // Reset selected advisor when time changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateDate(date) && selectedAdvisor) {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, time, advisor: selectedAdvisor }),
      })
      if (response.ok) {
        alert('Appointment booked successfully!')
        setDate('')
        setTime('')
        setSelectedAdvisor(null)
        setAdvisors([])
        onBookingSuccess()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block mb-1">
          Date (Monday to Friday)
        </label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          min={format(new Date(), 'yyyy-MM-dd')}
          required
        />
        {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
      </div>
      <div>
        <label htmlFor="time" className="block mb-1">
          Time
        </label>
        <Select
          value={time}
          onValueChange={handleTimeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="advisor" className="block mb-1">
          Academic Advisor
        </label>
        <Select
          value={selectedAdvisor === null ? '' : selectedAdvisor}
          onValueChange={(value) => {
            console.log('Selected advisor:', value)
            setSelectedAdvisor(value)
          }}
          disabled={!date || !time || dateError !== '' || advisors.length === 0 || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              isLoading ? "Loading advisors..." : 
              advisors.length === 0 ? "No advisors available" : 
              "Select an advisor"
            } />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div key="loading" className="p-2 text-sm text-gray-500">Loading advisors...</div>
            ) : advisors.length === 0 ? (
              <div key="no-advisors" className="p-2 text-sm text-gray-500">No advisors available</div>
            ) : (
              advisors.map((advisor) => (
                <SelectItem key={advisor.advisor_id} value={String(advisor.advisor_id)}>
                  {advisor.username}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <Button 
        type="submit" 
        disabled={
            selectedAdvisor === null || 
            dateError !== '' || 
            isLoading || 
            advisors.length === 0
        }
      >
        Book Appointment
      </Button>
    </form>
  )
}
