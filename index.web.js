import React from "react"
import ReactNative from "react-native"
import App from "./src/App"

import { AppContainer } from "react-hot-loader"

ReactNative.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById("root")
)

if (module.hot) {
  console.log("HOTTTTT")
  module.hot.accept("./src/App", () =>
    ReactNative.render(<App />, document.getElementById("root"))
  )
}
