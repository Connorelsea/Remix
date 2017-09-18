import React from "react"
import { Provider } from "react-redux"
import store from "./utilities/storage/store"
import { Router } from "./utilities/routing"
import UserProvider from "./UserProvider"

import { bind } from "decko"

// TODO: Clean up all imports here and stuff

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from "react-apollo"

import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from "subscriptions-transport-ws"

import Auth0Lock from "auth0-lock"

import Body from "./Body"

import { withRouter } from "react-router-dom"

const wsClient = new SubscriptionClient(
  `wss://subscriptions.graph.cool/v1/cj7bjx88t1ir1019460i39dmi`,
  {
    reconnect: true,
  }
)

const networkInterface = createNetworkInterface({
  uri: "https://api.graph.cool/simple/v1/cj7bjx88t1ir1019460i39dmi",
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

networkInterfaceWithSubscriptions.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {}
      }

      console.log("applying middleware")

      const token = localStorage.getItem("auth0IdToken")
      console.log("apply header", token)
      req.options.headers.authorization = token ? `Bearer ${token}` : null

      next()
    },
  },
])

let client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})

class App extends React.Component {
  constructor(props) {
    super(props)

    this.lock = new Auth0Lock(
      "ng5lhb04aIUeeTkzmjG6xJaS4uONSr32",
      "connorelsea.auth0.com"
      // {
      //   auth: {
      //     responseType: "id_token token",
      //   },
      //   scope: "openid offline_access",
      // }
    )
  }

  componentDidMount() {
    this.lock.on("authenticated", authResult => {
      console.log("SETTING ON LOCAL STORAGE", authResult)
      window.localStorage.setItem("auth0IdToken", authResult.idToken)
      window.localStorage.setItem("recentAuth", true)
      location.reload()
    })
  }

  logout() {
    window.localStorage.removeItem("auth0IdToken")
    location.reload()
  }

  @bind
  showLogin() {
    this.lock.show()
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Router>
            <Body showLogin={this.showLogin} client={client} />
          </Router>
        </Provider>
      </ApolloProvider>
    )
  }
}

export default App
