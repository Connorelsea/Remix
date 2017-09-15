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

      // get the authentication token from local storage if it exists
      if (localStorage.getItem("auth0IdToken")) {
        console.log("apply header", localStorage.getItem("auth0IdToken"))
        req.options.headers.authorization = `Bearer ${localStorage.getItem(
          "auth0IdToken"
        )}`
      }

      next()
    },
  },
])

let client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})

class App extends React.Component {
  state = {
    loggedIn: false,
  }

  constructor(props) {
    super(props)

    this.lock = new Auth0Lock(
      "ng5lhb04aIUeeTkzmjG6xJaS4uONSr32",
      "connorelsea.auth0.com",
      {
        auth: {
          responseType: "id_token token",
        },
        scope: "openid offline_access",
      }
    )
  }

  componentDidMount() {
    // if (window.localStorage.getItem("auth0IdToken")) {
    //   this.setState({ loggedIn: true })
    // }

    // if (window.localStorage.getItem("userId")) {
    //   console.log("TRUUU")
    //   this.setState({ loggedIn: true })
    // }

    this.lock.on("authenticated", authResult => {
      console.log("SETTING ON LOCAL STORAGE", authResult)
      // alert(JSON.stringify(authResult))
      window.localStorage.setItem("auth0IdToken", authResult.idToken)
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
            <Body showLogin={this.showLogin} loggedIn={this.state.loggedIn} />
          </Router>
        </Provider>
      </ApolloProvider>
    )
  }
}

export default App
