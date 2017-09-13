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
  renderMessage(message) {
    const {
      id,
      name,
      createdAt,
      object: { content },
      user: { displayName, colorPrimary, colorSecondary },
    } = message

    const date = new Date(createdAt)
    let hours = date.getHours()

    if (hours > 12) hours -= 12

    return (
      <MessageContainer>
        <Message
          key={id}
          colorPrimary={colorPrimary}
          colorSecondary={colorSecondary}
        >
          <UpperContainer>
            <MessageName>{displayName}</MessageName>
            <Time>{`${hours}:${date.getMinutes()}:${date.getSeconds()}`}</Time>
          </UpperContainer>
          <Text>{content}</Text>
        </Message>
      </MessageContainer>
    )
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
    this.input.value = ""
    this.input.clear()
    this.input.selectionState.focus()
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
  alignItems: "center",
  borderWidth: "1px",
  borderColor: "#dddfe2",
  borderStyle: "solid",
  flex: 1,
})

const StyleInput = glamorous(TextInput)({
  height: "100%",
  padding: 10,
  width: "100%",
})

const MessageContainer = glamorous.view({
  justifyContent: "flex-start",
  flexDirection: "row",
  display: "flex",
})

const Message = glamorous.view(
  {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: "1px",
    borderBottomColor: "#dddfe2",
    borderBottomStyle: "solid",
    backgroundColor: "white",
    borderRadius: 7,
    maxWidth: "80%",
    marginLeft: 13,
    marginBottom: 9,
    boxShadow: "0 0 0.5px 0 rgba(0,0,0,.14), 0 1px 1px 0 rgba(0,0,0,.24)",
    transition: "all 0.4s",
  },
  ({ colorPrimary, colorSecondary }) => ({
    background: `linear-gradient(135deg, ${colorSecondary} 0%,${colorPrimary} 100%)`,
  })
)

const UpperContainer = glamorous.view({
  flexDirection: "row",
  alignItems: "baseline",
  marginBottom: 5,
})

const MessageName = glamorous.text({
  fontSize: "0.9rem",
  fontWeight: "bold",
  marginBottom: 4,
  marginRight: 8,
})

const Time = glamorous.text({
  fontSize: "0.71rem",
  color: "gray",
})

const ViewContainer = glamorous.view({
  marginBottom: 50,
  flex: 1,
  backgroundColor: "#eee",
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
        createdAt
        object {
          objectType
          content
        }
        user {
          displayName
          userName
          id
          colorPrimary
          colorSecondary
        }
      }
    }
  }
`

const channelQueryOptions = ({ match: { params: { channel_id } } }) => ({
  variables: { channelId: channel_id },
  pollInterval: 3000,
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
