import React from "react"
import { ScrollView, TextInput } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import { bind, memoize } from "decko"

import Routing from "../../utilities/routing"

import { compose } from "react-apollo"

import { Header, HeaderLink, HeaderTitle } from "../../components/Header"

import Message from "../Message"

class Messages extends React.Component {
  @bind
  @memoize
  renderMessages(messages) {
    if (messages.length === 0) return undefined

    let calc = function() {
      this.currentFoundUsername = messages[this.currentIndex].user.userName

      if (this.lastFoundUsername === this.currentFoundUsername)
        this.dontUseUser = true
      else {
        this.lastFoundUsername = this.currentFoundUsername
        this.dontUseUser = false
      }

      return this.dontUseUser
    }

    let object = {
      lastFoundUsername: "",
      dontUseUser: false,
      currentIndex: 0,
      currentFoundUsername: messages[0].user.userName,
      props: this.props,
      calc: calc,
    }

    object[calc] = calc.bind(object)

    let bindedFunction = function(message, i) {
      this.currentIndex = i
      const co = this.calc()
      return (
        <Message
          key={message.id}
          user={message.user}
          message={message}
          //lastReads={this.props.data.Channel.lastReads.filter(
          // ({ message: { id } }) => id === message.id
          //)}
          dontUseUser={co}
        />
      )
    }.bind(object)

    return messages.map(bindedFunction)
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
      optimisticResponse: {
        __typename: "Mutation",
        createMessage: {
          id: "asd",
          _typename: "Comment",
          object: {
            id: "asdas",
            type: "Text",
            content: draft.nativeEvent.text,
          },
        },
        update: (store, { data: { createMessage } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: createMessageMutation })
          // Add our comment from the mutation to the end.
          data.messages.push(createMessage)
          // Write our data back to the cache.
          store.writeQuery({ query: createMessageMutation, data })
        },
      },
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
          {this.renderMessages(this.props.messages)}
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
