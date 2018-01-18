import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import RouteNavItem from "./components/RouteNavItem";
import Routes from "./Routes";
import App from "./App";
import "./App.css";
import Home from "./containers/Home";

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <Router>
      <Home />
    </Router>,
    // div
  )
    expect(document.getElementById('test').text()).toBe('Buy Milk');
})
