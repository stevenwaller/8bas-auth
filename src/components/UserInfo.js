import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/react-hooks'

import ErrorBox from './ErrorBox'
import { USER_QUERY } from '../lib/queries'

const storedEmail = localStorage.getItem('email')

const propTypes = {}
const defaultProps = {}

const UserInfo = () => {
  const client = useApolloClient()
  const [isLoading, setIsLoading] = useState(true)
  const [graphQLErrors, setGraphQLErrors] = useState([])
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await client.mutate({
          mutation: USER_QUERY,
          variables: {
            email: storedEmail
          }
        })

        setIsLoading(false)
        setUserData(response.data.user)
      } catch (error) {
        setGraphQLErrors(error.graphQLErrors)
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (isLoading) {
    return <h3>Loading User Info...</h3>
  }

  if (graphQLErrors.length > 0) {
    return <ErrorBox errors={graphQLErrors} />
  }

  return (
    <div>
      <h1>User Info</h1>
      <ul>
        <li>
          <strong>ID:</strong> {userData.id}
        </li>
        <li>
          <strong>Email:</strong> {userData.email}
        </li>
        <li>
          <strong>is8base:</strong> {userData.is8base}
        </li>
        <li>
          <strong>Roles:</strong> {userData.roles.items.map((item) => item.name).join(', ')}
        </li>
      </ul>
    </div>
  )
}

UserInfo.propTypes = propTypes
UserInfo.defaultProps = defaultProps
UserInfo.displayName = 'UserInfo'

export default UserInfo
