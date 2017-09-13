import React from "react"
import { Text, ScrollView, View, Button, TextInput } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import { bind } from "decko"

import Routing from "../../utilities/routing"
const Link = Routing.Link

import { compose } from "react-apollo"

import colorContrast from "font-color-contrast"

import { Header, HeaderLink, HeaderTitle } from "../../components/Header"

// TODO: rename to messages

class Messages extends React.Component {
  renderMessage(message) {
    const {
      id,
      name,
      createdAt,
      object: { content },
      user: { displayName, colorPrimary, colorSecondary, ...props },
    } = message

    const date = new Date(createdAt)
    let hours = date.getHours()

    if (hours > 12) hours -= 12

    return (
      <MessageContainer
        you={props.id === window.localStorage.getItem("userId")}
      >
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
    this.draftInput.clear()
    this.draftInput.selectionState.focus()
  }

  componentDidMount() {
    this.scrollView.scrollToEnd({ animated: true })
  }

  @bind
  onInputUnFocus() {
    this.draftInput.focus()
  }

  render() {
    const channel = this.props.data.Channel || { messages: [] }
    const { name, messages, group: { id } = { id: "" } } = channel

    return (
      <ViewContainer>
        <Header three>
          <HeaderLink to={`/group/${id}`}>Back</HeaderLink>
          <HeaderTitle>#{name}</HeaderTitle>
          <HeaderLink to="/">Info</HeaderLink>
        </Header>

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
              this.draftInput = input
            }}
            onBlur={this.onInputUnFocus}
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

const MessageContainer = glamorous.view(
  {
    justifyContent: "flex-start",
    flexDirection: "row",
    display: "flex",
  },
  ({ you }) => ({ justifyContent: you && "flex-end" })
)

const Message = glamorous.view(
  {
    padding: 10,
    paddingTop: 8,
    paddingBottom: 8,
    margin: 10,
    marginTop: 0,

    borderRadius: 5,
    maxWidth: "80%",
    // Hovering doesn't work??
    // transition: "all 0.4s",
    // "&:hover": {
    //   boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    // },
    opacity: 1,
  },
  ({ colorPrimary, colorSecondary }) => ({
    background: `linear-gradient(135deg, ${colorSecondary} 0%, ${colorPrimary} 100%)`,
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    boxShadow: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`,
    color: colorContrast(colorSecondary),
  })
)

const UpperContainer = glamorous.view({
  flexDirection: "row",
  alignItems: "baseline",
  marginBottom: 5,
})

const MessageName = glamorous.text({
  fontSize: "0.75rem",
  fontWeight: "bold",
  marginRight: 8,
})

const Time = glamorous.text({
  fontSize: "0.68rem",
  opacity: 0.5,
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
      group {
        id
      }
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
