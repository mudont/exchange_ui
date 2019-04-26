// @ts-nocheck
import React, { Component } from 'react';
//import {Navbar, Button} from 'react-bootstrap';
//import DNavbar from 'react-bootstrap/Navbar';
// import * as Button from 'react-bootstrap/Button';

import './App.css';

export class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  componentDidMount() {
    const { renewSession } = this.props.auth;

    if (localStorage.getItem('isLoggedIn') === 'true') {
      renewSession();
    }
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    console.log(`in DoAuth autheticated=${isAuthenticated()}`)
    return (
      <div>
        
            <button
              className="btn-margin"
              onClick={this.goTo.bind(this, 'login')}
            >
              Home
            </button>
            {
              !isAuthenticated() && (
                  <button
                    id="qsLoginBtn"
                    className="btn-margin"
                    onClick={this.login.bind(this)}
                  >
                    Log In
                  </button>
                )
            }
            {
              isAuthenticated() && (
                  <button
                    id="qsLogoutBtn"
                    className="btn-margin"
                    onClick={this.logout.bind(this)}
                  >
                    Log Out
                  </button>
                )
            }
          
      </div>
    );
  }
}


