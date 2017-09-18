import React from "react"
import { gql, graphql } from "react-apollo"
import { Text } from "react-native"
import UserFirstSetup from "./screens/UserFirstSetup"

class UserProvider extends React.Component {
  render() {
    console.log(this.props.data)
    console.log("hello")
    // if (this.props.data.userQuery === undefined) return <div>loading</div>
    if (this.props.data.user) {
      window.localStorage.setItem("userId", this.props.data.user.id)
    }

    if (this.props.data.loading) {
      return <div>Loading</div>
    }

    console.log("RECENT AUTH", window.localStorage.getItem("recentAuth"))

    const recentAuth = window.localStorage.getItem("recentAuth")

    console.log(this.props.data.user)

    if (this.props.data.user && this.props.data.user.displayName)
      return this.props.children(this.props.data.user)

    if (recentAuth === "true" && this.props.data.user) {
      console.log("inside of return")
      return <UserFirstSetup />
    } else {
      console.log("NOT", recentAuth)
    }

    return this.props.children(this.props.data.user)
  }
}

const userQuery = gql`
  query {
    user {
      id
      displayName
    }
  }
`

export default graphql(userQuery, {
  options: { fetchPolicy: "network-only" },
})(UserProvider)
