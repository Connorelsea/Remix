import React from "react"
import { Text, ScrollView, View, Button, TextInput } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import { bind } from "decko"

import Routing from "../../utilities/routing"
const Link = Routing.Link

import { compose } from "react-apollo"

import { Header, HeaderLink, HeaderTitle } from "../../components/Header"

import Message from "../Message"

class Messages extends React.Component {
  @bind
  renderMessage(message) {
    return (
      <Message
        user={message.user}
        message={message}
        lastReads={this.props.data.Channel.lastReads.filter(
          ({ message: { id } }) => id === message.id
        )}
      />
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

    this.props.createMessage({
      variables,
      refetchQueries: [{ query: channelQuery, variables: refetchVariables }],
    })

    this.scrollView.scrollToEnd({ animated: true })
    this.draftInput.clear()
    this.draftInput.selectionState.focus()
  }

  componentWillMount() {
    // this.props.createMessage.subscribeToMore({
    //   document: gql`
    //     subcription($channelId: ID!) {
    //       Channel(id: $channelId) {
    //         name
    //         lastReads {
    //           id
    //           updatedAt
    //           user {
    //             displayName
    //           }
    //           message {
    //             id
    //           }
    //         }
    //         messages {
    //           id
    //           messageType
    //           createdAt
    //           user {
    //             displayName
    //             userName
    //             id
    //             colorPrimary
    //             colorSecondary
    //           }
    //           object {
    //             objectType
    //             content
    //           }
    //         }
    //       }
    //     }
    //   `,
    //   updateQuery: (previousState, { subscriptionData }) => {
    //     console.log(previousState, subscriptionData)
    //   },
    //   onError: error => console.error(error),
    // })
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
          style={{
            flex: 1,
            background:
              "url(https://i.imgur.com/Rt6TNGp.png) no-repeat center center ",
            "background-size": "cover",
          }}
          ref={scroll => {
            this.scrollView = scroll
          }}
          onContentSizeChange={(contentWidth, contentHeight) =>
            this.scrollView.scrollToEnd({ animated: true })}
          keyboardDismissMode="interactive"
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
  width: "100%",
  maxHeight: 50,
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

const ViewContainer = glamorous.view({
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
      lastReads {
        id
        updatedAt
        user {
          displayName
        }
        message {
          id
        }
      }
      messages {
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
