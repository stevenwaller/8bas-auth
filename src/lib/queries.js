import gql from 'graphql-tag'

import { AUTH_PROFILE_ID } from './constants'

export const SIGN_UP_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    userSignUpWithPassword(
      user: { email: $email }
      password: $password
      authProfileId: "${AUTH_PROFILE_ID}"
    ) {
      id
      email
      status
      origin
      is8base
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    userLogin(data: { email: $email, password: $password, authProfileId: "${AUTH_PROFILE_ID}" }) {
      success
      auth {
        idToken
        refreshToken
      }
    }
  }
`

export const USER_QUERY = gql`
  query($email: String!) {
    user(email: $email) {
      id
      email
      status
      roles {
        items {
          name
        }
      }
    }
  }
`
