import React, { Component } from "react"
import { View } from "react-native"
import glamorous from "glamorous-primitives"

import Channels from "../Channels"
import Messages from "../Messages"

export default class ChatScreen extends Component {
  render() {
    return (
      <View style={{ flexDirection: "row", flex: 1 }}>
        {window.innerWidth > 500 && (
          <Channels match={this.props.match} squish />
        )}
        {this.props.match &&
        this.props.match.params.channel_id && (
          <Messages match={this.props.match} />
        )}
      </View>
    )
  }
}
