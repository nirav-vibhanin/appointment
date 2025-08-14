import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../store'
import { createAppointment } from '../store/slices/appointmentSlice'
import { fetchDoctors } from '../store/slices/doctorSlice'
import { fetchPatients } from '../store/slices/patientSlice'
import { appointmentApi } from '../services/appointmentApi'
import { AppointmentSlot } from '../types/appointment'

const validationSchema = Yup.object({
  patientId: Yup.string().required('Please select a patient'),
  doctorId: Yup.string().required('Please select a doctor'),
  date: Yup.date().required('Please select a date').min(new Date(), 'Date cannot be in the past'),
  time: Yup.string().required('Please select a time'),
  notes: Yup.string().max(500, 'Notes cannot exceed 500 characters'),
})

const BookAppointment = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { doctors } = useSelector((state: RootState) => state.doctors)
  const { patients } = useSelector((state: RootState) => state.patients)
  const { loading, error } = useSelector((state: RootState) => ({
    loading: state.appointments.loading.creating,
    error: state.appointments.error.creating
  }))

  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    dispatch(fetchDoctors())
    dispatch(fetchPatients())
  }, [dispatch])

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots()
    } else {
      setAvailableSlots([])
    }
  }, [selectedDoctor, selectedDate])

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return

    setLoadingSlots(true)
    try {
      const slots = await appointmentApi.getAvailableSlots(selectedDoctor, selectedDate)
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Failed to fetch available slots:', error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      await dispatch(createAppointment(values)).unwrap()
      resetForm()
      navigate('/my-appointments')
    } catch (error) {
      console.error('Failed to create appointment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="max-w-2xl mx-auto">
        <div className="card bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Formik
          initialValues={{
            patientId: '',
            doctorId: '',
            date: '',
            time: '',
            notes: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Patient Selection */}
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>
                <Field
                  as="select"
                  id="patientId"
                  name="patientId"
                  className="input"
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="patientId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Doctor Selection */}
              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor
                </label>
                <Field
                  as="select"
                  id="doctorId"
                  name="doctorId"
                  className="input"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue('doctorId', e.target.value)
                    setSelectedDoctor(e.target.value)
                    setFieldValue('time', '')
                  }}
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="doctorId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Date Selection */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <Field
                  type="date"
                  id="date"
                  name="date"
                  min={getMinDate()}
                  className="input"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('date', e.target.value)
                    setSelectedDate(e.target.value)
                    setFieldValue('time', '')
                  }}
                />
                <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Time Selection */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                {loadingSlots ? (
                  <div className="input bg-gray-50 text-gray-500">Loading available slots...</div>
                ) : availableSlots.length > 0 ? (
                  <Field
                    as="select"
                    id="time"
                    name="time"
                    className="input"
                  >
                    <option value="">Select a time</option>
                    {availableSlots
                      .filter((slot) => slot.status === 'available')
                      .map((slot) => (
                        <option key={slot.id} value={slot.time}>
                          {slot.time}
                        </option>
                      ))}
                  </Field>
                ) : selectedDoctor && selectedDate ? (
                  <div className="input bg-gray-50 text-gray-500">
                    No available slots for this date
                  </div>
                ) : (
                  <div className="input bg-gray-50 text-gray-500">
                    Please select a doctor and date first
                  </div>
                )}
                <ErrorMessage name="time" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <Field
                  as="textarea"
                  id="notes"
                  name="notes"
                  rows={3}
                  className="input"
                  placeholder="Any additional notes or symptoms..."
                />
                <ErrorMessage name="notes" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/my-appointments')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default BookAppointment
