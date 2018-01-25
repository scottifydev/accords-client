import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import Signup from "./containers/Signup";
import NewProtocol from "./containers/NewProtocol";
import Protocols from "./containers/Protocols";
import Proposals from "./containers/Proposals"
import Proposal from "./containers/Proposal"

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
        <AppliedRoute path="/proposals" exact component={Proposals} props={childProps} />
        <AppliedRoute path="/proposal/:userId/:proposalId" exact component={Proposal} props={childProps} />
        <AppliedRoute path="/proposals/new" exact component={NewProtocol} props={childProps} />
        <AppliedRoute path="/protocol/:id" exact component={Protocols} props={childProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>;