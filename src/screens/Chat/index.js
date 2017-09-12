import React from "react"
import { Text, ScrollView, View, Button, TextInput } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import { bind } from "decko"

import Routing from "../../utilities/routing"
const Link = Routing.Link

import { compose } from "react-apollo"

class Chat extends React.Component {
  state = {
    draft: "",
  }

  renderMessage(message) {
    const { id, name, object: { content }, user: { displayName } } = message

    return (
      <Message key={id}>
        <Text>{displayName}</Text>
        <Text>{content}</Text>
      </Message>
    )
  }

  @bind
  onDraftChange(draft) {
    this.setState({ draft })
  }

  @bind
  onDraftSubmit(draft) {
    const variables = {
      userId: window.localStorage.getItem("userId"),
      channelId: this.props.match.params.channel_id,
      content: draft.nativeEvent.text,
    }

    const refetchVariables = {
      channelId: this.props.match.params.channel_id,
    }

    console.log(variables)

    this.props.createMessage({
      variables,
      refetchQueries: [{ query: channelQuery, variables: refetchVariables }],
    })
  }

  render() {
    const channel = this.props.data.Channel || { messages: [] }
    const { name, messages } = channel

    return (
      <ViewContainer>
        <ScrollView>{messages.map(this.renderMessage)}</ScrollView>
        <InputContainer>
          <Input
            autoFocus
            onChangeText={this.onDraftChange}
            blurOnSubmit
            onSubmitEditing={this.onDraftSubmit}
            placeholder="Message..."
            value={this.state.draft}
          />
        </InputContainer>
      </ViewContainer>
    )
  }
}

const InputContainer = glamorous.view({
  backgroundColor: "gray",
})

const Input = glamorous(TextInput)({
  borderWidth: "1px",
  borderColor: "#dddfe2",
  borderStyle: "solid",
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  height: 50,
  padding: 10,
  backgroundColor: "white",
})

const Message = glamorous.view({
  backgroundColor: "#fff",
  padding: 20,
  borderBottomWidth: "1px",
  borderBottomColor: "#dddfe2",
  borderBottomStyle: "solid",
})

const ViewContainer = glamorous.view({
  marginBottom: 50,
})

const createMessageMutation = gql`
  mutation($content: String!, $userId: ID!, $channelId: ID!) {
    createMessage(
      messageType: Original
      object: { objectType: Text, content: $content }
      userId: $userId
      channelId: $channelId
    ) {
      id
    }
  }
`

const channelQuery = gql`
  query($channelId: ID!) {
    Channel(id: $channelId) {
      name
      messages {
        messageType
        object {
          objectType
          content
        }
        user {
          displayName
          userName
          id
        }
      }
    }
  }
`

const channelQueryOptions = ({ match: { params: { channel_id } } }) => ({
  variables: { channelId: channel_id },
})

const createMessageMutationOptions = {
  refetchQueries: [{ query: "channelQuery" }],
}

export default compose(
  graphql(createMessageMutation, {
    name: "createMessage",
    options: createMessageMutationOptions,
  }),
  graphql(channelQuery, { options: channelQueryOptions })
)(Chat)
