import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store'
import { fetchDoctors } from './store/slices/doctorSlice'
import { fetchPatients } from './store/slices/patientSlice'
import { fetchAppointments } from './store/slices/appointmentSlice'

// Components
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import BookAppointment from './pages/BookAppointment'
import MyAppointments from './pages/MyAppointments'
import DoctorList from './pages/DoctorList'
import DoctorDetail from './pages/DoctorDetail'
import PatientRegistration from './pages/PatientRegistration'

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Load initial data
    dispatch(fetchDoctors())
    dispatch(fetchPatients())
    dispatch(fetchAppointments())
  }, [dispatch])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/register" element={<PatientRegistration />} />
      </Routes>
    </Layout>
  )
}

export default App
