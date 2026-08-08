import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChange = e => setValues(v => ({ ...v, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    if (!values.email || !values.password) {
      setError('Please enter email and password')
      return
    }
    setLoading(true)
    try {
      await login(values);
      navigate("/resume-start");
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar/>
      <div className="container">
        <div className="card" style={{maxWidth:420, margin:'80px auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <h2 style={{margin:0}}>Login</h2>
          </div>
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <input className="input" name="email" placeholder="Email" value={values.email} onChange={onChange} />
              <input className="input" type="password" name="password" placeholder="Password" value={values.password} onChange={onChange} />
            </div>
            {error && <p style={{color:'tomato', marginTop:10}}>{error}</p>}
            <div style={{height:12}} />
            <button className="spl_btn" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          </form>
          <p className="muted" style={{marginTop:12}}>No account? <Link to="/signup">Create one</Link></p>
        </div>
      </div>
    </>
  )
}
