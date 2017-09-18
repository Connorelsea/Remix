import React, { Component } from "react"
import { View } from "react-native"
import glamorous from "glamorous-primitives"

import Channels from "../Channels"
import Messages from "../Messages"
import Groups from "../Groups"

import { gql, graphql } from "react-apollo"

class ChatScreen extends Component {
  componentDidMount() {
    this.props.allMessagesQuery.subscribeToMore({
      document: gql`
        subscription {
          Message(filter: { mutation_in: [CREATED] }) {
            node {
              id
              messageType
              createdAt
              user {
                displayName
                userName
                id
                colorPrimary
                colorSecondary
              }
              object {
                objectType
                content
              }
            }
          }
        }
      `,
      updateQuery: (previousState, { subscriptionData }) => {
        const newMessage = subscriptionData.data.Message.node
        const messages = previousState.allMessages.concat([newMessage])
        return {
          allMessages: messages,
        }
      },
      onError: error => console.error(error),
    })
  }

  render() {
    const group_id = this.props.match.params.id
    const channel_id = this.props.match.params.channel_id

    console.log("asdkhabsd")
    console.log(this.props.allMessagesQuery)

    return (
      <View style={{ flexDirection: "row", flex: 1 }}>
        {window.innerWidth > 500 && <Groups />}
        {group_id &&
        window.innerWidth > 500 && <Channels match={this.props.match} squish />}
        {channel_id && this.props.allMessagesQuery.allMessages ? (
          <Messages
            match={this.props.match}
            messages={this.props.allMessagesQuery.allMessages}
          />
        ) : (
          <div>Select a channel</div>
        )}
      </View>
    )
  }
}

const allMessagesQuery = gql`
  query allMessages {
    allMessages(filter: { channel: { id: "cj7gmc5uqory501446fnxvz22" } }) {
      id
      messageType
      createdAt
      user {
        displayName
        userName
        id
        colorPrimary
        colorSecondary
      }
      object {
        objectType
        content
      }
    }
  }
`

export default graphql(allMessagesQuery, { name: "allMessagesQuery" })(
  ChatScreen
)
