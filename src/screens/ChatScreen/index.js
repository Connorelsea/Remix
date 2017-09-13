import React, { Component } from "react"
import { Text, View } from "react-native"
import glamorous from "glamorous-primitives"

import Channels from "../Channels"
import Messages from "../Messages"

import { withRouter } from "react-router-dom"

class ChatScreen extends Component {
  render() {
    return (
      <Container>
        {window.innerWidth > 500 && (
          <Channels match={this.props.match} squish />
        )}
        {this.props.match &&
        this.props.match.params.channel_id && (
          <Messages match={this.props.match} />
        )}
      </Container>
    )
  }
}

export default ChatScreen

const Container = glamorous.view({
  flexDirection: "row",
  flex: 1,
})
