import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Signup from "./containers/Signup";
import NewProtocol from "./containers/NewProtocol";
import Protocols from "./containers/Protocols";
import Proposals from "./containers/Proposals"
import Proposal from "./containers/Proposal"

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <AuthenticatedRoute path="/proposals" exact component={Proposals} props={childProps} />
        <AuthenticatedRoute path="/proposal/:userId/:proposalId" exact component={Proposal} props={childProps} />
        <AuthenticatedRoute path="/proposals/new" exact component={NewProtocol} props={childProps} />
        <AuthenticatedRoute path="/protocol/:id" exact component={Protocols} props={childProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>;