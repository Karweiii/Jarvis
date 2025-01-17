import AppointmentList from '@/components/AppointmentList'

export default function AppointmentPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Consultation Appointments</h1>
      <AppointmentList />
    </div>
  )
}

