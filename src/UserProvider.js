import React from "react"
import { gql, graphql } from "react-apollo"

import UserFirstSetup from "./screens/UserFirstSetup"

class UserProvider extends React.Component {
  componentWillReceiveProps(newProps) {
    console.log("new props", newProps)
  }

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

    if (
      this.props.data.loading === false &&
      this.props.data.user === null &&
      window.localStorage.getItem("auth0IdToken")
    ) {
      // this also happens when token expires i think
      console.log("user first setup")
      window.localStorage.setItem("auth0IdToken", "")
      return location.reload()
      // return <UserFirstSetup />
      // this.props.router.replace(`/login`)
    }

    return this.props.children(this.props.data.user)
  }
}

const userQuery = gql`
  query {
    user {
      id
    }
  }
`

export default graphql(userQuery, {
  options: { fetchPolicy: "network-only" },
})(UserProvider)
