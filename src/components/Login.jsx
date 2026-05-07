import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './Auth.css'

const Login = () => {
  const [email, setemail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${process.env.BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem("userId", data.user.id)
        navigate("/home")
      } else {
        setError(data.message || "Login failed")
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
        <h1 className="auth-card__title">Login</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="alert-error">{error}</p>}

          <div className="form-group">
            <label className="form-group__label" htmlFor="email">Email</label>
            <input 
              className="form-group__input"
              type="email" 
              name="email" 
              id="email" 
              placeholder="Enter email" 
              onChange={(e) => setemail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">Password</label>
            <input 
              className="form-group__input"
              type="password" 
              name="password" 
              id="password" 
              placeholder="Enter password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="auth-footer">
            Don't have an account? <Link className="auth-footer__link" to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login