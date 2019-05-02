import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter, push } from 'connected-react-router';
import { Switch, Route } from 'react-router';

import store, { history } from './store';
import Home from './routes/Home';
import { getPath } from './router-paths';
import AddArticle from './routes/AddArticle';
import EditArticle from './routes/EditArticle';
import ViewArticle from './routes/ViewArticle';
// Auth stuff
import {Callback} from './features/auth0/components/Callback';
// import {Home as AuthHome} from './features/auth0/components/Home';
// import {App as AuthApp} from './features/auth0/components/App';
import Auth from './services/auth0-service';
import {LocalStorageLayout as Exchange} from './features/exchange/components/Exchange';
const auth = new Auth(() => store.dispatch(push(getPath("exchange"))));
//type AuthProps = {location: Location}
const handleAuthentication = ({location}: any) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}
// End Auth stuff

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>

            <Route exact path={getPath("exchange")} render={(props) => <Exchange auth={auth} {...props}/>} /> 
            {/* <Route exact path={getPath("auth")} render={(props) => <AuthApp auth={auth} {...props} />} /> */}
            {/* <Route exact path={getPath("auth_home")} render={(props) => <AuthHome auth={auth} {...props} />} /> */}
            <Route exact path={getPath("callback")}  render={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />
            }}/>

            <Route exact path={getPath('home')} render={Home} />
            <Route exact path={getPath('addArticle')} render={AddArticle} />
            <Route
              exact
              path={getPath('editArticle', ':articleId')}
              render={props => <EditArticle {...props} />}
            />
            <Route
              exact
              path={getPath('viewArticle', ':articleId')}
              render={props => <ViewArticle {...props} />}
            />
            <Route render={() => <div>Page not found!</div>} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
