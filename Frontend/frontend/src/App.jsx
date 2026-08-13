
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Navbar from '../components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Providers from './pages/Providers';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {


  return (
    <>
<Router>
      <Navbar/>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/providers" element={<Providers />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
</>
  )
}

export default App
