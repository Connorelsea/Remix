import React from "react"
import { Text, ScrollView, View, Button } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import { bind } from "decko"

import Routing from "../../utilities/routing"
const Link = Routing.Link

import { Header, HeaderLink, HeaderTitle } from "../../components/Header"

import { withRouter } from "react-router-dom"

class Channels extends React.Component {
  componentWillMount() {}

  @bind
  renderListItem(channel) {
    const { id, name } = channel
    return (
      <ChannelLink>
        <Link to={`/group/${this.props.match.params.id}/${id}`}>
          <ChannelLinkText>
            <span>#</span>
            {name}
          </ChannelLinkText>
        </Link>
      </ChannelLink>
    )
  }

  render() {
    const channels = this.props.data.Group ? this.props.data.Group.channels : []
    return (
      <View
        style={{
          flex: 1,
          maxWidth: this.props.squish && "30%",
        }}
      >
        <Header three>
          <HeaderLink to={`/`}>Back</HeaderLink>
          <HeaderTitle>Channels</HeaderTitle>
          <HeaderLink to={`/`}>+ Create</HeaderLink>
        </Header>
        <ScrollView>{channels.map(this.renderListItem)}</ScrollView>
      </View>
    )
  }
}

const ChannelLink = glamorous.view({
  backgroundColor: "#fff",
  width: "100%",
  padding: 20,
  borderBottomWidth: "1px",
  borderBottomColor: "#dddfe2",
  borderBottomStyle: "solid",
  cursor: "pointer",
})

const ChannelLinkText = glamorous.text({
  fontWeight: "bold",
  textTransform: "lowercase",
  color: "black",
})

const channelQuery = gql`
  query($groupId: ID!) {
    Group(id: $groupId) {
      channels {
        id
        name
        description
      }
    }
  }
`

const options = ({ match: { params: { id } } }) => ({
  variables: { groupId: id },
})

export default graphql(channelQuery, { options })(Channels)
