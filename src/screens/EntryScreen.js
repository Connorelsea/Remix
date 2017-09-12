import React from "react"
import { connect } from "react-redux"
import SampleAction from "./../actions/SampleAction"
import TopLevelScreenComponent from "./../components/TopLevelScreenComponent"
import { StyleSheet, View, Text } from "react-native"

class EntryScreen extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      message: "Welcome to this app",
      dispatchMessage: "Dispatch an action to:",
      passActionDispatchValue: 1,
      failActionDispatchValue: 0,
    }
    this.passDispatchedAction = this.passDispatchedAction.bind(this)
    this.failDispatchedAction = this.failDispatchedAction.bind(this)
  }

  passDispatchedAction() {
    this.props.dispatch(SampleAction(this.state.passActionDispatchValue))
  }

  failDispatchedAction() {
    this.props.dispatch(SampleAction(this.state.failActionDispatchValue))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello</Text>
        <TopLevelScreenComponent
          passDispatchedAction={this.passDispatchedAction}
          failDispatchedAction={this.failDispatchedAction}
          message={this.props.sampleReducer.message}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
})

function mapStateToProps(state) {
  return {
    sampleReducer: state.sampleReducer,
  }
}

export default connect(mapStateToProps)(EntryScreen)
