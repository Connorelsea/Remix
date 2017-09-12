import React from "react"
import { Text, ScrollView } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import Routing from "../../utilities/routing"
const Link = Routing.Link

// TODO: Rename to Groups

class ChatIndex extends React.Component {
  componentWillMount() {}

  renderListItem(group) {
    const { id, name, channels } = group
    return (
      <Container key={id}>
        <Text>{name}</Text>
        <Text>
          {channels.length} Channel{channels.length > 1 && "s"}
        </Text>
        <Link to={`/group/${id}`}>Enter Group</Link>
      </Container>
    )
  }

  render() {
    const allGroups = this.props.data.allGroups || []
    return (
      <ScrollView>
        <Text>Groups</Text>
        {allGroups.map(this.renderListItem)}
      </ScrollView>
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

const groupQuery = gql`
  query {
    allGroups(filter: { users_some: { id: "cj7gh2irgfjtx0179t9pclxrd" } }) {
      id
      name
      channels {
        name
      }
      users {
        id
      }
    }
  }
`

export default graphql(groupQuery)(ChatIndex)
