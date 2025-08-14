import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { fetchAppointments, cancelAppointment, updateAppointment } from '../store/slices/appointmentSlice'
import { Calendar, Clock, User, MapPin, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

const MyAppointments = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { appointments, loading, error } = useSelector((state: RootState) => ({
    appointments: state.appointments.appointments,
    loading: state.appointments.loading.appointments,
    error: state.appointments.error.appointments
  }))
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    notes: '',
  })

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])

  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await dispatch(cancelAppointment(id)).unwrap()
      } catch (error) {
        console.error('Failed to cancel appointment:', error)
      }
    }
  }

  const handleEditAppointment = async (id: string) => {
    try {
      await dispatch(updateAppointment({ id, appointmentData: editForm })).unwrap()
      setEditingAppointment(null)
      setEditForm({ date: '', time: '', notes: '' })
    } catch (error) {
      console.error('Failed to update appointment:', error)
    }
  }

  const startEditing = (appointment: any) => {
    setEditingAppointment(appointment.id)
    setEditForm({
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes || '',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status !== 'available'
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading appointments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't booked any appointments yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="card">
              {editingAppointment === appointment.id ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Appointment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={editForm.time}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      rows={3}
                      className="input"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingAppointment(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditAppointment(appointment.id)}
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        Dr. {appointment.doctor?.name || 'Unknown Doctor'}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1">{appointment.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.patient?.name || 'Unknown Patient'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.doctor?.specialization || 'General'}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {appointment.status === 'booked' && (
                      <>
                        <button
                          onClick={() => startEditing(appointment)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit appointment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Cancel appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments
