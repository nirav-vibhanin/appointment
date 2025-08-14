import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { fetchAppointments, fetchPatientAppointments, cancelAppointment } from '../store/slices/appointmentSlice'
import { Calendar, Clock, User, MapPin, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { AppointmentStatus } from '../types/appointment'
import { format } from 'date-fns'
import { fetchDoctors } from '../store/slices/doctorSlice'
import { fetchPatients as fetchPatientsList } from '../store/slices/patientSlice'

const MyAppointments = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { appointments, patientAppointments, loadingAppointments, loadingPatientAppointments, error, selectedPatient, patients, doctors } = useSelector((state: RootState) => ({
    appointments: state.appointments.appointments,
    patientAppointments: state.appointments.patientAppointments,
    loadingAppointments: state.appointments.loading.appointments,
    loadingPatientAppointments: state.appointments.loading.patientAppointments,
    error: state.appointments.error.appointments,
    selectedPatient: state.patients.selectedPatient,
    patients: state.patients.patients,
    doctors: state.doctors.doctors,
  }))

  useEffect(() => {
    if (selectedPatient?.id) {
      dispatch(fetchPatientAppointments({ patientId: selectedPatient.id, page: 1, limit: 50 }))
    } else {
      dispatch(fetchAppointments({ page: 1, limit: 50 }))
    }
    if (!doctors || doctors.length === 0) {
      dispatch(fetchDoctors({ page: 1, limit: 200 }))
    }
    if (!patients || patients.length === 0) {
      dispatch(fetchPatientsList({ page: 1, limit: 200 }))
    }
  }, [dispatch, selectedPatient?.id])

  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await dispatch(cancelAppointment({ id })).unwrap()
        if (selectedPatient?.id) {
          dispatch(fetchPatientAppointments({ patientId: selectedPatient.id, page: 1, limit: 50 }))
        } else {
          dispatch(fetchAppointments({ page: 1, limit: 50 }))
        }
      } catch (error) {
        console.error('Failed to cancel appointment:', error)
      }
    }
  }


  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
      case AppointmentStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800'
      case AppointmentStatus.IN_PROGRESS:
        return 'bg-indigo-100 text-indigo-800'
      case AppointmentStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      case AppointmentStatus.RESCHEDULED:
        return 'bg-yellow-100 text-yellow-800'
      case AppointmentStatus.NO_SHOW:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
      case AppointmentStatus.CONFIRMED:
      case AppointmentStatus.IN_PROGRESS:
      case AppointmentStatus.RESCHEDULED:
        return <Clock className="w-4 h-4" />
      case AppointmentStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4" />
      case AppointmentStatus.CANCELLED:
      case AppointmentStatus.NO_SHOW:
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const allowedStatuses: string[] = Object.values(AppointmentStatus)
  const baseList = selectedPatient?.id ? patientAppointments : appointments
  const filteredAppointments = baseList
    .filter((a: any) => allowedStatuses.includes(a.status) || a.status === 'booked')
    .map((a: any) => {
      const findById = <T extends { id: any }>(list: T[] = [], id: any) => list.find((x) => String(x.id) === String(id))
      let doc: any = a.doctor || findById(doctors as any, a.doctorId)
      let pat: any = a.patient || findById(patients as any, a.patientId)

      const pickNameParts = (obj: any, alt?: string) => {
        if (!obj && !alt) return { firstName: 'Unknown', lastName: '' }
        const first = obj?.firstName ?? obj?.firstname
        const last = obj?.lastName ?? obj?.lastname
        let name = obj?.name ?? obj?.fullName ?? obj?.displayName ?? alt ?? ''
        if (!first && !last && name) {
          const parts = String(name).trim().split(' ').filter(Boolean)
          return { firstName: parts[0] || name, lastName: parts.slice(1).join(' ') }
        }
        return { firstName: first || (name ? String(name) : 'Unknown'), lastName: last || '' }
      }

      if (!doc) {
        const parts = pickNameParts(undefined, (a as any).doctorName)
        doc = { id: a.doctorId, ...parts }
      } else {
        const parts = pickNameParts(doc)
        doc = { ...doc, ...parts }
      }

      if (!pat) {
        const parts = pickNameParts(undefined, (a as any).patientName)
        pat = { id: a.patientId, ...parts }
      } else {
        const parts = pickNameParts(pat)
        pat = { ...pat, ...parts }
      }

      const normalizedStatus = a.status === 'booked' ? AppointmentStatus.SCHEDULED : a.status
      const startTime = a.startTime || a.timeSlot?.startTime || ''
      const endTime = a.endTime || a.timeSlot?.endTime || ''
      return { ...a, status: normalizedStatus, startTime, endTime, doctor: doc, patient: pat }
    })

  const isLoading = selectedPatient?.id ? loadingPatientAppointments : loadingAppointments
  if (isLoading) {
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
            <div key={appointment.id} className="card bg-white shadow-md rounded-lg p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {appointment.doctor ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 'Unknown Doctor'}
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
                        <span>{appointment.startTime || 'N/A'}{appointment.endTime ? ` - ${appointment.endTime}` : ''}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown Patient'}</span>
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
                    {[AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED, AppointmentStatus.RESCHEDULED].includes(appointment.status) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Cancel appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments
