import React from "react"
import { Text, ScrollView } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import Routing from "../../utilities/routing"
const Link = Routing.Link

import { Header } from "react-native-elements"

// TODO: Rename to Groups

class ChatIndex extends React.Component {
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
  query($userId: ID!) {
    allGroups(filter: { users_some: { id: $userId } }) {
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

const groupQueryVariables = {
  userId: window.localStorage.getItem("userId"),
}

console.log("ggggg", groupQueryVariables)

export default graphql(groupQuery, {
  options: { variables: groupQueryVariables },
})(ChatIndex)
