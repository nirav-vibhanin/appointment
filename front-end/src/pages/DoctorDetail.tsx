import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { fetchDoctorById } from '../store/slices/doctorSlice'
import { User, Mail, Phone, MapPin, Calendar, ArrowLeft } from 'lucide-react'

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedDoctor, loading, error } = useSelector((state: RootState) => ({
    selectedDoctor: state.doctors.selectedDoctor,
    loading: state.doctors.loading.doctor,
    error: state.doctors.error.doctor
  }))

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorById(id))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading doctor details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!selectedDoctor) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Doctor not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The doctor you're looking for doesn't exist.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/doctors"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Doctors
      </Link>

      {/* Doctor Header */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <div className="bg-primary-100 p-4 rounded-lg">
            <User className="w-12 h-12 text-primary-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Dr. {selectedDoctor.name}
            </h1>
            <p className="text-xl text-gray-600 mt-2">{selectedDoctor.specialization}</p>
            <div className="flex items-center space-x-2 mt-4">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{selectedDoctor.specialization}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{selectedDoctor.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">{selectedDoctor.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to={`/book-appointment?doctorId=${selectedDoctor.id}`}
              className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-primary-900">Book Appointment</p>
                <p className="text-sm text-primary-700">Schedule a consultation</p>
              </div>
            </Link>
            <Link
              to="/my-appointments"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">View My Appointments</p>
                <p className="text-sm text-gray-700">Check your schedule</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Doctor Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About Dr. {selectedDoctor.name}</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600">
            Dr. {selectedDoctor.name} is a qualified medical professional specializing in{' '}
            {selectedDoctor.specialization.toLowerCase()}. With years of experience in the field,
            Dr. {selectedDoctor.name} is committed to providing high-quality healthcare services
            to patients.
          </p>
          <p className="text-gray-600 mt-4">
            To schedule an appointment with Dr. {selectedDoctor.name}, please use the booking
            system above or contact the office directly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetail
