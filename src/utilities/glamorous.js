import { Platform } from "react-native"

let glamorous = require("glamorous")

if (Platform.OS === "ios" || Platform.OS === "android")
  glamorous = require("glamorous-native")

export const view = glamorous.view

export default glamorous
