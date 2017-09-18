import React from "react"
import Welcome from "./screens/Welcome"

import Groups from "./screens/Groups"
import ChatScreen from "./screens/ChatScreen"
import Channels from "./screens/Channels"
import Messages from "./screens/Messages"
import UserFirstSetup from "./screens/UserFirstSetup"

import { Text, View } from "react-native"

import Routing from "./utilities/routing"
const Route = Routing.Route

import { gql, graphql } from "react-apollo"

import UserProvider from "./UserProvider"

class Body extends React.Component {
  render() {
    return (
      <UserProvider>
        {user => (
          <View style={{ flex: 1 }}>
            {user ? (
              <View style={{ flex: 1 }}>
                <Route exact path="/" component={ChatScreen} />
                <Route exact path="/group/:id" component={ChatScreen} />
                <Route
                  exact
                  path="/group/:id/:channel_id"
                  component={ChatScreen}
                />
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
        )}
      </UserProvider>
    )
  }
}

export default Body
