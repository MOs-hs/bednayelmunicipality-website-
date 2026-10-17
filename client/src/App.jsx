import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Locations from './pages/Locations';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGallery from './pages/admin/AdminGallery';
import AdminLocations from './pages/admin/AdminLocations';
import AdminNewsletters from './pages/admin/AdminNewsletters';
import AdminCarousel from './pages/admin/AdminCarousel';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminComplaints from './pages/admin/AdminComplaints';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.type !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={
              <ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoute role="admin"><AdminGallery /></ProtectedRoute>
            } />
            <Route path="/admin/locations" element={
              <ProtectedRoute role="admin"><AdminLocations /></ProtectedRoute>
            } />
            <Route path="/admin/newsletters" element={
              <ProtectedRoute role="admin"><AdminNewsletters /></ProtectedRoute>
            } />
            <Route path="/admin/carousel" element={
              <ProtectedRoute role="admin"><AdminCarousel /></ProtectedRoute>
            } />
            <Route path="/admin/appointments" element={
              <ProtectedRoute role="admin"><AdminAppointments /></ProtectedRoute>
            } />
            <Route path="/admin/complaints" element={
              <ProtectedRoute role="admin"><AdminComplaints /></ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
