import React from "react"
// import glamorous from "glamorous-native"
import { Text, View, Button } from "react-native"

import Routing from "../../utilities/routing"
const Link = Routing.Link

class Welcome extends React.Component {
  static navigationOptions = {
    title: "Login",
  }

  state = {
    username: "",
    password: "",
  }

  render() {
    return (
      <View>
        <Text>Testing</Text>
        <Link to="/">Hello</Link>
        {/* <Text>Username</Text>
        <TextInput
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
        />
        <Text>Password</Text>
        <TextInput
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
        /> */}
        <Button onPress={() => this.props.showLogin()} title="Login" />
      </View>
    )
  }
}

export default Welcome
