import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../store'
import { createPatient } from '../store/slices/patientSlice'
import { User, Mail, Phone, Calendar } from 'lucide-react'

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'Patient must be at least 1 year old', function(value) {
      if (!value) return false
      const age = new Date().getFullYear() - value.getFullYear()
      return age >= 1
    }),
})

const PatientRegistration = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => ({
    loading: state.patients.loading.creating,
    error: state.patients.error.creating
  }))

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      await dispatch(createPatient(values)).unwrap()
      resetForm()
      navigate('/book-appointment')
    } catch (error) {
      console.error('Failed to create patient:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getMaxDate = () => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="text-center mb-6">
          <div className="bg-primary-100 p-3 rounded-full w-fit mx-auto mb-4">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
          <p className="text-gray-600 mt-2">
            Create your patient account to book appointments
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            dateOfBirth: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="input"
                  placeholder="Enter your full name"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="input"
                  placeholder="Enter your email address"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <Field
                  type="tel"
                  id="phone"
                  name="phone"
                  className="input"
                  placeholder="Enter your phone number"
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date of Birth
                </label>
                <Field
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  max={getMaxDate()}
                  className="input"
                />
                <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Additional Information */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Why register?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Book appointments with our qualified doctors</li>
            <li>• Manage your appointment schedule</li>
            <li>• Receive appointment reminders</li>
            <li>• Access your medical history</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PatientRegistration
