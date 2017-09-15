import React, { Component } from "react"
import glamorous from "glamorous-primitives"
import { Text, ScrollView, View, Button, TextInput } from "react-native"

import colorContrast from "font-color-contrast"
import VisibilitySensor from "react-visibility-sensor"

import Frame from "../../components/Frame"

import { bind } from "decko"

export default class Message extends Component {
  render() {
    const {
      message: { id, createdAt, object },
      user: { displayName, colorPrimary, colorSecondary, ...props },
      lastReads,
    } = this.props

    const date = new Date(createdAt)
    let hours = date.getHours()

    if (hours > 12) hours -= 12

    let lastReadComponent

    const content = object ? object.content : "deleted"
    const objectType = object ? object.objectType : "deleted"

    if (lastReads.length > 0) {
      console.log("readssss")
      lastReadComponent = (
        <MessageReadContainer>
          {lastReads.map(({ updatedAt, user: { displayName } }) => (
            <MessageRead>Read: {displayName}</MessageRead>
          ))}
        </MessageReadContainer>
      )
    }

    return (
      <VisibilitySensor onChange={this.onVisibleChange}>
        <MessageContainer
          you={props.id === window.localStorage.getItem("userId")}
        >
          <MessageBubble
            key={id}
            colorPrimary={colorPrimary}
            colorSecondary={colorSecondary}
          >
            <UpperContainer>
              <MessageName>{displayName}</MessageName>
              <Time
              >{`${hours}:${date.getMinutes()}:${date.getSeconds()}`}</Time>
            </UpperContainer>
            <Text>{this.renderContent(content, objectType)}</Text>
          </MessageBubble>
          {lastReadComponent}
        </MessageContainer>
      </VisibilitySensor>
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
        return <Text>{content}</Text>
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

  onVisibleChange(visible) {
    console.log(visible)
  }
}

const MessageContainer = glamorous.view(
  {
    flexDirection: "column",
    margin: 10,
    marginTop: 0,
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
  fontSize: "0.8rem",
  fontWeight: "600",
  marginRight: 8,
})

const Time = glamorous.text({
  fontSize: "0.68rem",
  opacity: 0.5,
})

const MessageReadContainer = glamorous.view({
  flexDirection: "row",
})

const MessageRead = glamorous.view({})

const MessageReadName = glamorous.text({})
