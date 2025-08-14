import { Link } from 'react-router-dom'
import { Calendar, Users, User, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const Home = () => {
  const { appointments } = useSelector((state: RootState) => ({
    appointments: state.appointments.appointments
  }))
  const { doctors } = useSelector((state: RootState) => ({
    doctors: state.doctors.doctors
  }))

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === 'booked'
  ).slice(0, 3)

  const quickActions = [
    {
      name: 'Book Appointment',
      description: 'Schedule a new appointment with a doctor',
      href: '/book-appointment',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      name: 'View Doctors',
      description: 'Browse available doctors and their specializations',
      href: '/doctors',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'My Appointments',
      description: 'View and manage your existing appointments',
      href: '/my-appointments',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      name: 'Register',
      description: 'Create a new patient account',
      href: '/register',
      icon: User,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Appointment Booking System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Book appointments with qualified doctors, manage your schedule, and stay on top of your healthcare needs.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.name}
                to={action.href}
                className="group relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available Doctors</p>
              <p className="text-2xl font-semibold text-gray-900">{doctors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingAppointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Appointments</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {appointment.doctor?.name || 'Unknown Doctor'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
