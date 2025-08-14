import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '../store'
import { fetchDoctors } from '../store/slices/doctorSlice'
import { User, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const DoctorList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { doctors, loading, error } = useSelector((state: RootState) => ({
    doctors: state.doctors.doctors,
    loading: state.doctors.loading.doctors,
    error: state.doctors.error.doctors
  }))

  useEffect(() => {
    dispatch(fetchDoctors())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading doctors...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Our Doctors</h1>
        <p className="text-gray-600 mt-2">
          Browse our qualified medical professionals and their specializations.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors available</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no doctors in the system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="card bg-white shadow-md rounded-lg p-6 space-y-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {doctor?.name}
                  </h3>
                  <p className="text-sm text-gray-600">{doctor?.specialization}</p>
                </div>
                <div className="bg-primary-100 p-2 rounded-lg">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.specialization}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  to={`/doctors/${doctor.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorList
