import { useState, useEffect, useMemo } from 'react'
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
  const { doctors = [] } = useSelector((state: RootState) => state.doctors || ({} as any)) as any
  const {
    patients = [],
    loading: patientLoadingState = {},
    error: patientErrorState = {},
  } = useSelector((state: RootState) => state.patients || ({} as any)) as any
  const { loading, error } = useSelector((state: RootState) => ({
    loading: state.appointments.loading.creating,
    error: state.appointments.error.creating
  }))


  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const renderPatientLabel = (patient: any) => {
    const fn = (patient.firstName || '').trim()
    const ln = (patient.lastName || '').trim()
    const full = [fn, ln].filter(Boolean).join(' ')
    const primary = full || patient.name || ''
    const secondary = patient.email || patient.phone || ''
    return secondary ? `${primary} - ${secondary}` : primary
  }

  const SearchableSelect = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    ariaLabel,
  }: {
    options: { value: string; label: string }[]
    value: string
    onChange: (v: string) => void
    placeholder?: string
    ariaLabel?: string
  }) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')

    const selected = useMemo(() => options.find(o => o.value === value) || null, [options, value])
    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase()
      if (!q) return options
      return options.filter(o => o.label.toLowerCase().includes(q))
    }, [options, query])

    return (
      <div className="relative">
        <button
          type="button"
          aria-label={ariaLabel}
          className="input w-full text-left"
          onClick={() => setOpen(o => !o)}
        >
          {selected ? selected.label : placeholder}
        </button>
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow">
            <div className="p-2 border-b">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
            </div>
            <ul className="max-h-56 overflow-auto">
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-gray-500">No results</li>
              )}
              {filtered.map(opt => (
                <li
                  key={opt.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                    setQuery('')
                  }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    dispatch(fetchDoctors({ page: 1, limit: 100 }))
    dispatch(fetchPatients({ page: 1, limit: 100 }))
  }, [dispatch])

  const patientList = useMemo(() => (patients || []), [patients])

  useEffect(() => {
    if (selectedDoctor && !(doctors || []).some((d: any) => String(d.id) === String(selectedDoctor))) {
      setSelectedDoctor('')
    }
  }, [doctors, selectedDoctor])

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots()
    } else {
      setAvailableSlots([])
    }
  }, [selectedDoctor, selectedDate])

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return
    if (!(doctors || []).some((d: any) => String(d.id) === String(selectedDoctor))) {
      console.warn('Selected doctor not found in list, skipping slot fetch.')
      return
    }

    setLoadingSlots(true)
    try {
      const slots = await appointmentApi.getAvailableSlots(selectedDoctor, selectedDate, true)
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
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>
                {patientLoadingState?.patients ? (
                  <div className="input text-gray-500">Loading patients...</div>
                ) : patientErrorState?.patients ? (
                  <div className="input text-red-600">Failed to load patients</div>
                ) : patientList.length === 0 ? (
                  <div className="input text-gray-500">No patients found</div>
                ) : (
                  <SearchableSelect
                    options={(patientList || []).map((p: any) => ({ value: String(p.id), label: renderPatientLabel(p) }))}
                    value={String((values as any).patientId || '')}
                    onChange={(v) => setFieldValue('patientId', v)}
                    placeholder="Search and select a patient"
                    ariaLabel="Patient"
                  />
                )}
                <ErrorMessage name="patientId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor
                </label>
                {doctors.length === 0 ? (
                  <div className="input bg-gray-50 text-gray-500">Loading doctors or none found</div>
                ) : (
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
                    {doctors.map((doctor: any) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </Field>
                )}
                <ErrorMessage name="doctorId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

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
                    {availableSlots.map((slot) => (
                      <option key={slot.id} value={slot.time} disabled={slot.status !== 'available'}>
                        {slot.time}{slot.status !== 'available' ? ' (booked)' : ''}
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
