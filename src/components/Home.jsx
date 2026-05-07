import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")
  
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    dob: "",
    gender: "",
    hobby: ""
  })
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchProfiles()
    }
  }, [userId])

  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/profile/${userId}`)
      const data = await response.json()
      if (data.success) {
        setProfiles(data.profiles)
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userId")
    navigate("/")
  }

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.BASE_URL}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...profileData, userId })
      })
      const data = await response.json()
      if (data.success) {
        alert("Profile added successfully!")
        setProfileData({ name: "", age: "", dob: "", gender: "", hobby: "" })
        fetchProfiles()
      } else {
        alert(data.message || "Failed to add profile")
      }
    } catch (error) {
      alert("Error adding profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="home-header">
        <h1 id='Dashboard'>Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <section className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#f8fafc' }}>Add New Profile</h2>
        <form onSubmit={handleSubmit}>

          
          <div className="form-grid">
            <div className="input-field">
              <label htmlFor="name">Full Name</label>
              <input type="text" name="name" id="name" placeholder="John Doe" value={profileData.name} onChange={handleChange} required />
            </div>

            <div className="input-field">
              <label htmlFor="age">Age</label>
              <input type="number" name="age" id="age" placeholder="25" value={profileData.age} onChange={handleChange} required />
            </div>

            <div className="input-field">
              <label htmlFor="dob">Date of Birth</label>
              <input type="date" name="dob" id="dob" value={profileData.dob} onChange={handleChange} required />
            </div>

            <div className="input-field">
              <label htmlFor="gender">Gender</label>
              <select name="gender" id="gender" value={profileData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="input-field">
              <label htmlFor="hobby">Hobby</label>
              <input type="text" name="hobby" id="hobby" placeholder="Photography" value={profileData.hobby} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} style={{ width: '200px' }}>
              {loading ? "Adding..." : "Add Profile"}
            </button>
          </div>
        </form>
      </section>

      <section className="table-container">
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>Your Profiles</h2>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{profiles.length} Total</span>
        </div>
        
        {profiles.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Hobby</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{profile.name}</td>
                    <td>{profile.age}</td>
                    <td>{new Date(profile.dob).toLocaleDateString('en-GB')}</td>
                    <td style={{ textTransform: 'capitalize' }}>{profile.gender}</td>
                    <td>{profile.hobby}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>No profiles found. Start by adding one above!</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home