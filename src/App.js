import React, { useState } from 'react'

import SignUpForm from './components/SignUpForm'
import LoginForm from './components/LoginForm'
import UserInfo from './components/UserInfo'

const storedIdToken = localStorage.getItem('idToken')

const propTypes = {}
const defaultProps = {}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedIdToken)

  const handleLogin = (email, { idToken }) => {
    setIsAuthenticated(true)

    localStorage.setItem('email', email)
    localStorage.setItem('idToken', idToken)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)

    localStorage.removeItem('email')
    localStorage.removeItem('idToken')
  }

  if (isAuthenticated) {
    return (
      <div>
        <button className="logout-btn" type="button" onClick={handleLogout}>
          Logout
        </button>
        <UserInfo />
      </div>
    )
  }

  return (
    <div>
      <SignUpForm onLogin={handleLogin} />
      <LoginForm onLogin={handleLogin} />
    </div>
  )
}

App.propTypes = propTypes
App.defaultProps = defaultProps
App.displayName = 'App'

export default App
