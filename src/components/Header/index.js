import React from "react"
import { Text, View, Button, TextInput } from "react-native"
import glamorous from "glamorous-primitives"

import { bind } from "decko"

import Routing from "../../utilities/routing"
const Link = Routing.Link

export const HeaderLink = ({ to, children }) => <Link to={to}>{children}</Link>

export const Header = glamorous.view(
  {
    background: "white",
    height: 55,
    boxShadow: `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.14)`,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    paddingBottom: 2,
    zIndex: 9999,
  },
  ({ three }) => ({ justifyContent: "space-between" })
)

export const HeaderTitle = glamorous.text({
  letterSpacing: -0.5,
  fontWeight: "700",
  fontSize: "1.4rem",
})
