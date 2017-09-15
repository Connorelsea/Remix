import React, { Component } from "react"
import { Platform, Button } from "react-native"
import glamorous from "glamorous-primitives"
import { bind } from "decko"

export default class Frame extends Component {
  state = {
    open: true,
  }

  @bind
  toggle() {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { color, uri } = this.props

    if (Platform.OS === "web") {
      return (
        <EmbedContainer color={color}>
          <EmbedInformation>
            <Tag colorPrimary="#1ED760" colorBackground="#282828">
              Spotify
            </Tag>
            <Button
              onPress={this.toggle}
              title={this.state.open ? "Close" : "Open"}
            />
          </EmbedInformation>
          <iframe
            src={uri}
            width="250"
            height="330"
            frameBorder="0"
            allowTransparency="true"
            style={{
              transition: "all 0.4s",
              height: this.state.open ? "330px" : "0px",
            }}
          />
        </EmbedContainer>
      )
    } else {
      let WebView = require("react-native").WebView

      if (WebView === undefined) return

      return (
        <WebView
          src={{
            uri: "https://open.spotify.com/embed/track/28y73loqaAz5QS2gToWHks",
          }}
        />
      )
    }
  }
}

const EmbedContainer = glamorous.view(({ color }) => ({
  borderRadius: 6,
  overflow: "hidden",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  // border: `1px solid rgba(255, 255, 255, 0.35)`,
  boxShadow: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`,
  // margin: 10,
}))

const EmbedInformation = glamorous.view({
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 10,
  paddingLeft: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const Tag = glamorous.text(({ colorPrimary, colorBackground }) => ({
  color: colorPrimary,
  backgroundColor: colorBackground,
  borderRadius: 6,
  boxShadow: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`,
  padding: 6,
  paddingRight: 12,
  paddingLeft: 12,
  textTransform: "uppercase",
  letterSpacing: 1.7,
  fontWeight: "800",
  fontSize: "0.7rem",
}))
