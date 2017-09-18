import React from "react"
import { Text, View } from "react-native"

import { gql, graphql } from "react-apollo"

import glamorous from "glamorous-primitives"

import Routing from "../../utilities/routing"
const Link = Routing.Link

import { Header, HeaderLink, HeaderTitle } from "../../components/Header"

class Groups extends React.Component {
  renderListItem(group) {
    const { id, name, channels, users } = group

    return (
      <Container key={id}>
        <Text>{name}</Text>
        <Text>
          {channels.length} Channel{channels.length > 1 && "s"}
        </Text>
        <Text>
          {users.length} User{users.length > 1 && "s"}
        </Text>
        <Link to={`/group/${id}`}>Enter Group</Link>
      </Container>
    )
  }

  render() {
    const allGroups = this.props.data.allGroups || []

    return (
      <View style={{ flex: 1, maxWidth: "16%" }}>
        <Header>
          <HeaderTitle>Groups</HeaderTitle>
          <HeaderLink to="/">{process.env.REACT_APP_VERSION}</HeaderLink>
        </Header>
        {allGroups.map(this.renderListItem)}
      </View>
    )
  }
}

const Container = glamorous.view({
  backgroundColor: "#fff",
  padding: 20,
  flex: 1,
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

export default graphql(groupQuery, {
  options: { variables: groupQueryVariables },
})(Groups)
