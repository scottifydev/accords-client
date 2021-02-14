import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { invokeApig } from '../libs/awsLib';
import Typist from 'react-typist';
import "./Home.css";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            protocols: []
        };
    }
    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const results = await this.protocols();
            this.setState({ protocols: results });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    protocols() {
        return invokeApig({ path: "/protocols" });
    }

    renderProtocolsList(protocols) {
        console.log(protocols)
        let arry = []
        for (let i=0; i < protocols.Count; i++) {
            let protocolText = "[ no. " + protocols.Items[i].protocolNumber + " ]  " + protocols.Items[i].content.trim().split("\n")
            arry.push(
                <LinkContainer to={`/protocol/${protocols.Items[i].protocolNumber}`}>
                <ListGroupItem
                key={protocols.Items[i].protocolNumber}
                onClick={this.handleprotocolClick}
                header={protocolText}
                >
                {"Proposed by: " + protocols.Items[i].userId}
                <br />
                {"Ratified by: " + protocols.Items[i].ratifiedBy + " at " + new Date(protocols.Items[i].ratifiedDate).toLocaleString()}
                <br />
                {" Review on: " + new Date(protocols.Items[i].reviewDate).toLocaleString()}
                </ListGroupItem>
                </LinkContainer>
            );
        }
        console.log(arry)
        return arry
    }


    handleProtocolClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    renderLander() {
        return (
            <div className="lander">
                    <Typist
                        cursor={{
                            show: false,
                        }}
                    >
                    <Typist.Delay ms={1500} />
                    <h1>Accords:</h1>
                    <Typist.Delay ms={200} />
                    <p>Organization Management System</p>
                    </Typist>
            </div>
        );
    }
    
    renderProtocols() {
        let avgTypingDelay = 20
        let stdTypingDelay = 0
        return (
            <div className="protocols">
                <PageHeader>
                    <Typist
                        cursor={{
                            show: true,
                            blink: true,
                            element: '_',
                            hideWhenDone: false,
                            hideWhenDoneDelay: 1000,
                        }}
                        avgTypingDelay={avgTypingDelay}
                        stdTypingDelay={stdTypingDelay}
                    >
                    <Typist.Delay ms={1500} />
                        Protocols
                    </Typist>
                </PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderProtocolsList(this.state.protocols)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                    {this.props.isAuthenticated ? this.renderProtocols() : this.renderLander()}
            </div>
        );
    }
}