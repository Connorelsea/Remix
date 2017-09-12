import React from "react"
import { gql, graphql } from "react-apollo"

// import Routing from "../../utilities/routing"
// const Route = Routing.Route

import { bind } from "decko"

import { Text, View, Button, TextInput } from "react-native"

class UserFirstSetup extends React.Component {
  state = {
    userName: "",
    displayName: "",
  }

  @bind
  createUser() {
    const variables = {
      idToken: window.localStorage.getItem("auth0IdToken"),
      userName: this.state.userName,
      displayName: this.state.displayName,
    }

    this.props
      .createUser({ variables })
      .then(response => {
        console.log("After create user")
        console.log(response)
        window.localStorage.setItem("userId", response.data.createUser.id)
      })
      .catch(error => console.error("error on create", error))
  }

  render() {
    return (
      <View>
        <Text>User First Setup</Text> <Text>Username, like @username</Text>
        <TextInput
          placeholder="User Name"
          onChangeText={text => this.setState({ userName: text })}
          value={this.state.userName}
        />
        <Text>Display Name, like "First Last"</Text>
        <TextInput
          placeholder="Display Name"
          onChangeText={text => this.setState({ displayName: text })}
          value={this.state.displayName}
        />
        <Button onPress={this.createUser} title="Create" />
      </View>
    )
  }
}

const createUser = gql`
  mutation($idToken: String!, $userName: String!, $displayName: String!) {
    createUser(
      authProvider: { auth0: { idToken: $idToken } }
      userName: $userName
      displayName: $displayName
    ) {
      id
    }
  }
`

const userQuery = gql`
  query {
    user {
      id
    }
  }
`

export default graphql(createUser, { name: "createUser" })(
  graphql(userQuery, { options: { fetchPolicy: "network-only" } })(
    UserFirstSetup
  )
)
