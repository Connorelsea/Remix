import React, { Component } from "react"
import glamorous from "glamorous-primitives"
import { Text } from "react-native"

import colorContrast from "font-color-contrast"

import Frame from "../../components/Frame"

import { bind } from "decko"

export default class Message extends Component {
  render() {
    const {
      message: { id, createdAt, object },
      user: { displayName, colorPrimary, colorSecondary, ...props },
      // lastReads,
      dontUseUser,
    } = this.props

    const date = new Date(createdAt)
    let hours = date.getHours()

    if (hours > 12) hours -= 12

    let lastReadComponent = undefined

    const content = object ? object.content : "deleted"
    const objectType = object ? object.objectType : "deleted"

    // if (lastReads.length > 0) {
    //   lastReadComponent = (
    //     <MessageReadContainer>
    //       {lastReads.map(({ updatedAt, user: { displayName } }) => (
    //         <MessageRead key={displayName}>Read: {displayName}</MessageRead>
    //       ))}
    //     </MessageReadContainer>
    //   )
    // }

    return (
      <MessageContainer
        you={props.id === window.localStorage.getItem("userId")}
      >
        <MessageBubble
          key={id}
          colorPrimary={colorPrimary}
          colorSecondary={colorSecondary}
          dontUseUser={dontUseUser}
        >
          {!dontUseUser && (
            <UpperContainer>
              <MessageName>{displayName}</MessageName>
              <Time
              >{`${hours}:${date.getMinutes()}:${date.getSeconds()}`}</Time>
            </UpperContainer>
          )}
          <Text>{this.renderContent(content, objectType)}</Text>
        </MessageBubble>
        {lastReadComponent}
      </MessageContainer>
    )
  }

  @bind
  renderContent(content, objectType) {
    switch (objectType) {
      case "deleted":
        return (
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.87rem" }}>
            The original content of this message was deleted.
          </Text>
        )
      case "Text":
        return (
          <Text
            style={{ color: colorContrast(this.props.user.colorSecondary) }}
          >
            {content}
          </Text>
        )
      case "SpotifyTrack":
        return (
          <Frame
            uri="https://open.spotify.com/embed/track/28y73loqaAz5QS2gToWHks"
            color={this.props.user.colorSecondary}
          />
        )
      case "SpotifyAlbum":
        return (
          <Frame
            uri="https://open.spotify.com/embed/album/1m1V83RrHAsSfmmM8aKy0x"
            color={this.props.user.colorSecondary}
          />
        )
    }
  }
}

const MessageContainer = glamorous.view(
  {
    flexDirection: "column",
    margin: 10,
    marginTop: 0,
    marginBottom: 3,
  },
  ({ you }) => ({ alignItems: you ? "flex-end" : "flex-start" })
)

const MessageBubble = glamorous.view(
  {
    padding: 10,
    paddingTop: 8,
    paddingBottom: 8,

    borderRadius: 6,
    maxWidth: "90%",
    opacity: 1,
  },
  ({ colorPrimary, colorSecondary, dontUseUser }) => ({
    background: `linear-gradient(135deg, ${colorSecondary} 0%, ${colorPrimary} 100%)`,
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    boxShadow: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`,
    color: colorContrast(colorSecondary),
    marginTop: !dontUseUser && 12,
  })
)

const UpperContainer = glamorous.view(
  {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 5,
  },
  ({ useLastUser }) => ({ display: useLastUser ? "none" : "block" })
)

const MessageName = glamorous.text({
  fontSize: "0.9rem",
  fontWeight: "600",
  marginRight: 8,
  opacity: 0.85,
})

const Time = glamorous.text({
  fontSize: "0.76rem",
  fontWeight: "300",
  opacity: 0.5,
})

const MessageReadContainer = glamorous.view({
  flexDirection: "row",
})

const MessageRead = glamorous.view({})

const MessageReadName = glamorous.text({})
