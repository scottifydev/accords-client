import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import config from "../config";
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: "",
            password: ""
        };

    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await this.login(this.state.username, this.state.password);
            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    login(username, password) {
        const userPool = new CognitoUserPool({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
        });
        const user = new CognitoUser({ Username: username, Pool: userPool });
        const authenticationData = { Username: username, Password: password };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        return new Promise((resolve, reject) =>
            user.authenticateUser(authenticationDetails, {
                onSuccess: result => resolve(),
                onFailure: err => reject(err),
                newPasswordRequired: result => {
                    alert(result)
                }
            })
        );
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>username</ControlLabel>
                        <FormControl
                            autoFocus
                            type="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Login"
                        loadingText="Logging in…"
                    />
                </form>
            </div>
        );
    }
}


// aws cognito-idp admin-initiate-auth --user-pool-id us-east-1_ptqan3iCG --client-id 1gd50lsg3t989lvefkc2qemdo6 --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=Scott,PASSWORD=password
// aws cognito-idp admin-respond-to-auth-challenge --user-pool-id us-east-1_ptqan3iCG --client-id 1gd50lsg3t989lvefkc2qemdo6 --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=3lPsycongr00,USERNAME=Scott --session "o8zWBw8I0nuXd1YXedjNKi7xzpBR1_K2YOP0b-KwP1nK_N4OJ7Cjw2OfMPd0A_WbC3vqj8YSdnqyO-i2hF-zKghtPs-UHzWafhesHBVIa8lfDHNmbTsSTVsJVMSUMEbgzcE6l7F84v9QPPj1QOczgCzIp1j3UzBxU623DkjRkgrkfysEfvxwLG_AejFrP0YzeWmv6DvAbdLlBNTMhVhbD_TZacq5qbqdV5IlifHdU0Mn0srfboBvHhXeKzwFeE1ihxdKgCalVg6aAKKn88x3mrLlziF8K2V4yvTLDMc09D7MigwlIrP3fVjTXuhD0NgRFnkykxOg9Xjfpxn1qSXLhtsM5sZBe6HQeRmzRA-sYxjJqZjBSzmgAeLhxf2swIbJb2NqKNCthQSGQ381Jg7OrOhn6L93qAO13rS_xfMqVaYUBkh7svRIwo_XOmOM6RTcpR1_Vz9iusulVOoE5jNADivEkxcKp8IK-5xoi74BMX40ENP1ymMk9tqk5uL0x_WYBIU2zdap3dQf3SbZl1-f8drJWbYvgoepBW_5cajVT5RYP3zVs4U3PXoHeELygS93_XZARe3ExqpPdbdJGTT24Pvp02zaWAWokNv5uepah-ba0B-AWGZHHoxtBLQSSam4MlhV4xcZc9HPhOurSVZWAOiclMYSIKvoe5b0oOcy5Hw3WRq5i3P5S6yS_G1SQDraIuVXn8L-UrSnoLmwa9QUO20_gRBCZbn0y6v5mnANxTUT0X4Bo_qWWkyrJgM7pBfJhR5zSEcWk3fau8q6WD8zyEuNaPAADdVh7Ilf8_UoRNmKoxKuQkkekTkJOSIDL49GZNBRONJ13iQ"