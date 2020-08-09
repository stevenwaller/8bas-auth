import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

import App from './App'
import { API_ENDPOINT } from './lib/constants'
import 'index.scss'

const httpLink = createHttpLink({
  uri: API_ENDPOINT,
  credentials: 'same-origin'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('idToken')

  if (token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`
      }
    }
  }

  return { headers }
})

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach((graphQLError) => {
          console.log('[GraphQL error]', graphQLError)
        })
      }

      if (networkError) {
        console.log('[Network error]', networkError)
      }
    }),
    authLink.concat(httpLink)
  ]),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
