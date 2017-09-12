import React from "react"
import { Text, ScrollView, View, Button } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import { bind } from "decko"

import Routing from "../../utilities/routing"
const Link = Routing.Link

class Channels extends React.Component {
  componentWillMount() {}

  @bind
  renderListItem(channel) {
    const { id, name } = channel
    return (
      <Container key={id}>
        <Text>#{name}</Text>
        <Text>{id}</Text>
        <Link to={`/group/${this.props.match.params.id}/${id}`}>Enter</Link>
      </Container>
    )
  }

  render() {
    const channels = this.props.data.Group ? this.props.data.Group.channels : []
    return (
      <View>
        <Text>Channels</Text>
        <Link to={`/group/${this.props.match.params.id}`}>Back</Link>
        <ScrollView>{channels.map(this.renderListItem)}</ScrollView>
      </View>
    )
  }
}

const Container = glamorous.view({
  backgroundColor: "#fff",
  padding: 20,
  borderBottomWidth: "1px",
  borderBottomColor: "#dddfe2",
  borderBottomStyle: "solid",
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
