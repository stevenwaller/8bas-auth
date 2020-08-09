import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useApolloClient } from '@apollo/react-hooks'

import ErrorBox from './ErrorBox'
import { SIGN_UP_MUTATION, LOGIN_MUTATION } from '../lib/queries'

const propTypes = {
  onLogin: PropTypes.func
}
const defaultProps = {
  onLogin: () => {}
}

const SignUpForm = ({ onLogin }) => {
  const client = useApolloClient()
  const [isLoading, setIsLoading] = useState(false)
  const [graphQLErrors, setGraphQLErrors] = React.useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    setGraphQLErrors([])

    // Create a user using the `userSignUpWithPassword` mutation
    try {
      await client.mutate({
        mutation: SIGN_UP_MUTATION,
        variables: {
          email,
          password
        }
      })
    } catch (signUpError) {
      setIsLoading(false)
      setGraphQLErrors(signUpError.graphQLErrors)

      return
    }

    // Automatically login the newly created user by using the `userLogin` mutation
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="sign-up-email">Email</label>
        <input
          id="sign-up-email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="sign-up-password">Password</label>
        <input
          id="sign-up-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <ErrorBox errors={graphQLErrors} />
        <button disabled={isLoading} className={`${isLoading ? 'is-loading' : ''}`}>
          Sign Up
        </button>
      </form>
    </div>
  )
}

SignUpForm.propTypes = propTypes
SignUpForm.defaultProps = defaultProps
SignUpForm.displayName = 'SignUpForm'

export default SignUpForm
