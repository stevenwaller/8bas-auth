import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useApolloClient } from '@apollo/react-hooks'

import ErrorBox from './ErrorBox'
import { LOGIN_MUTATION } from '../lib/queries'

const propTypes = {
  onLogin: PropTypes.func
}
const defaultProps = {
  onLogin: () => {}
}

const LoginForm = ({ onLogin }) => {
  const client = useApolloClient()
  const [isLoading, setIsLoading] = useState(false)
  const [graphQLErrors, setGraphQLErrors] = React.useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    setGraphQLErrors([])

    // login using the `userLogin` mutation
    try {
      const loginResponse = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          email,
          password
        }
      })

      setIsLoading(false)
      onLogin(email, loginResponse.data.userLogin.auth)
    } catch (loginError) {
      setGraphQLErrors(loginError.graphQLErrors)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <ErrorBox errors={graphQLErrors} />
        <button disabled={isLoading} className={`${isLoading ? 'is-loading' : ''}`}>
          Login
        </button>
      </form>
    </div>
  )
}

LoginForm.propTypes = propTypes
LoginForm.defaultProps = defaultProps
LoginForm.displayName = 'LoginForm'

export default LoginForm
