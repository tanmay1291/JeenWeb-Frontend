import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './Auth.css'

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${process.env.BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem("userId", data.user.id)
        navigate("/home")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Register</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="alert-error">{error}</p>}

          <div className="form-group">
            <label className="form-group__label" htmlFor="username">Username</label>
            <input 
              className="form-group__input"
              type="text" 
              id="username" 
              name="username" 
              placeholder="Enter username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="email">Email</label>
            <input 
              className="form-group__input"
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">Password</label>
            <input 
              className="form-group__input"
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link className="auth-footer__link" to="/">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register