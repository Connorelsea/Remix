import React from "react"
import { Text, ScrollView, View, Button, TextInput } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import { bind } from "decko"

import Routing from "../../utilities/routing"
const Link = Routing.Link

import { compose } from "react-apollo"

// TODO: rename to messages

class Messages extends React.Component {
  state = {
    draft: "",
  }

  renderMessage(message) {
    const { id, name, object: { content }, user: { displayName } } = message

    return (
      <Message key={id}>
        <MessageName>{displayName}</MessageName>
        <Text>{content}</Text>
      </Message>
    )
  }

  @bind
  onDraftChange(draft) {
    if (this.state.draft == -9) this.setState({ draft: "" })
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

    this.scrollView.scrollToEnd({ animated: true })
    this.input.clear()
    this.input.selectionState.focus()
    this.setState({ draft: -9 })
  }

  componentDidMount() {
    this.scrollView.scrollToEnd({ animated: true })
  }

  render() {
    const channel = this.props.data.Channel || { messages: [] }
    const { name, messages } = channel

    return (
      <ViewContainer>
        <ScrollView
          style={{ height: "100%" }}
          ref={scroll => {
            this.scrollView = scroll
          }}
          onContentSizeChange={(contentWidth, contentHeight) =>
            this.scrollView.scrollToEnd({ animated: true })}
          keyboardDismissMode="on-drag"
        >
          {messages.map(this.renderMessage)}
        </ScrollView>
        <InputContainer>
          <StyleInput
            innerRef={input => {
              this.input = input
            }}
            autoFocus
            onChangeText={this.onDraftChange}
            blurOnSubmit
            onSubmitEditing={this.onDraftSubmit}
            placeholder="Message..."
          />
        </InputContainer>
      </ViewContainer>
    )
  }
}

const InputContainer = glamorous.view({
  backgroundColor: "white",
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  height: 50,
  padding: 10,
  alignItems: "center",
  borderWidth: "1px",
  borderColor: "#dddfe2",
  borderStyle: "solid",
  flex: 1,
})

const StyleInput = glamorous(TextInput)({
  height: "100%",
  width: "100%",
})

const Message = glamorous.view({
  backgroundColor: "#fff",
  padding: 15,
  borderBottomWidth: "1px",
  borderBottomColor: "#dddfe2",
  borderBottomStyle: "solid",
})

const MessageName = glamorous.text({
  fontSize: "0.9rem",
  fontWeight: "bold",
  marginBottom: 4,
})

const ViewContainer = glamorous.view({
  marginBottom: 50,
  flex: 1,
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
)(Messages)
