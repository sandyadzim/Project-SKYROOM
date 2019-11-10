import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { createReduxContainer } from 'react-navigation-redux-helpers';


import RootNavigation from './src/navigation/SwitchNav';
import { store } from './src/redux/store';

const AppNav = createReduxContainer(RootNavigation, 'root');

const mapStateToProps = state => ({
  state: state.router
});
const AppWithNavigationState = connect(mapStateToProps)(AppNav);


class App extends Component {
  render() {
    return (
      // <SwitchNav />
      <Provider store={store} >
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default App;
