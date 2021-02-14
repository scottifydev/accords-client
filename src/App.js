import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, NavItem, Navbar } from "react-bootstrap";
import RouteNavItem from "./components/RouteNavItem";
import Routes from "./Routes";
import { authUser, signOutUser } from "./libs/awsLib";
import { LinkContainer } from 'react-router-bootstrap';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      isOn: false
    };
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = event => {
    signOutUser();

    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  async componentDidMount() {
    console.log(authUser())
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    }
    catch (e) {
      alert(e);
    }

    this.setState({ isAuthenticating: false });
    document.onkeydown = evt => {
      evt = evt || window.event;
      if (evt.keyCode === 27) {
        if (this.state.isOn === true ) {
          document.getElementById('root').style.webkitAnimationName = 'turn-off';
          document.getElementById('root').style.webkitAnimationDuration = '2s'
          document.getElementById('root').style.webkitAnimationFillMode = 'forwards'
          this.state.isOn = false;
        } else if (this.state.isOn === false) {
          this.state.isOn = true
          // document.getElementById('root').style.webkitAnimationName = '';
          document.getElementById('root').style.webkitAnimationName = 'turn-on';
        }
      }
    };
  }



render() {
  const childProps = {
    isAuthenticated: this.state.isAuthenticated,
    userHasAuthenticated: this.userHasAuthenticated
  };

  return (
    !this.state.isAuthenticating &&
    <div className="App container crt">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Accords: Organization Managment System</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {this.state.isAuthenticated
              ? [<LinkContainer to="/proposals">
                  <RouteNavItem key={1}>Proposals</RouteNavItem>
                </LinkContainer>,
                <LinkContainer to="/actions">
                  <RouteNavItem key={2}>Actions</RouteNavItem>
                </LinkContainer>,
                <LinkContainer to="/dossiers">
                  <RouteNavItem key={3}>Dossiers</RouteNavItem>
                </LinkContainer>,
                <NavItem key="4" onClick={this.handleLogout}>Logout</NavItem>
              ]
              : [
                <RouteNavItem key={2} href="/signup">Signup</RouteNavItem>,
                <RouteNavItem key={3} href="/login">Login</RouteNavItem>
              ]}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes childProps={childProps} />
    </div>
  );
}
}

export default withRouter(App);