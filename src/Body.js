import React from "react"
import Welcome from "./screens/Welcome"

import ChatIndex from "./screens/ChatIndex"
import Channels from "./screens/Channels"
import Messages from "./screens/Messages"
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

    // TODO: idk about this right here...
    if (user) {
      window.localStorage.setItem("userId", user.id)
    }

    // if (!user && this.props.loggedIn) {
    //   return <Route path="/" component={UserFirstSetup} />
    // }

    return (
      <View style={{ flex: 1 }}>
        {this.props.loggedIn ? (
          <View style={{ flex: 1 }}>
            <Route exact path="/" component={ChatIndex} />
            <Route exact path="/group/:id" component={Channels} />
            <Route exact path="/group/:id/:channel_id" component={Messages} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
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
