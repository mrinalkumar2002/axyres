import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Templates from './pages/Templates.jsx'
import ResumeStart from './pages/ResumeStart.jsx'
import Details from './pages/Details.jsx'
import Download from './pages/Download.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/templates' element={<Templates/>}/>
      <Route path="/resume-start" element={<ResumeStart />} />
      <Route path="/resume" element={<Navigate to="/resume-start" replace />} />
      <Route path='/details' element={<Details/>}/>
      <Route path='/download' element={ <Download/> }/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<div className="container"><h1>404</h1><p>Page not found.</p></div>} />
    </Routes>
  )
}
