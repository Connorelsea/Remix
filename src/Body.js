import React from "react"
import Welcome from "./screens/Welcome"

import ChatIndex from "./screens/ChatIndex"
import Channels from "./screens/Channels"
import Chat from "./screens/Chat"
import UserFirstSetup from "./screens/UserFirstSetup"

import { Text, View } from "react-native"

import Routing from "./utilities/routing"
const Route = Routing.Route

import { gql, graphql } from "react-apollo"

class Body extends React.Component {
  render() {
    console.log("data", this.props)

    const user = this.props.data.user

    console.log("user", user)

    if (user) {
      window.localStorage.setItem("userId", user.id)
    }

    if (!user && this.props.loggedIn) {
      return <Route path="/" component={UserFirstSetup} />
    }

    return (
      <View>
        {this.props.loggedIn ? (
          <View>
            <Route exact path="/" component={ChatIndex} />
            <Route exact path="/group/:id" component={Channels} />
            <Route exact path="/group/:id/:channel_id" component={Chat} />
          </View>
        ) : (
          <View>
            <Route
              path="/"
              render={() => <Welcome showLogin={this.props.showLogin} />}
            />
          </View>
        )}
      </View>
    )
  }
}

const userQuery = gql`
  query {
    user {
      id
    }
  }
`

export default graphql(userQuery, { options: { fetchPolicy: "network-only" } })(
  Body
)
