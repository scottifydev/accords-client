import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { invokeApig } from '../libs/awsLib';
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
        return invokeApig({ path: "/get/protocols" });
    }

    renderProtocolsList(protocols) {
        console.log(protocols)
        let arry = []
        for (let i=0; i < protocols.Count; i++) {
            arry.push(<ListGroupItem
                key={protocols.Items[i].protocolNumber}
                href={`/protocol/${protocols.Items[i].protocolNumber}`}
                onClick={this.handleprotocolClick}
                header={`no. ${protocols.Items[i].protocolNumber} - ${protocols.Items[i].content.trim().split("\n")}`}
                >
                {"Proposed by: " + protocols.Items[i].userId + " and " + "ratified by: " + protocols.Items[i].ratifiedBy + " at " + new Date(protocols.Items[i].ratifiedDate).toLocaleString() + " Review on: " + new Date(protocols.Items[i].reviewDate).toLocaleString()}
                </ListGroupItem>
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
                <h1>Project Reddington:</h1>
                <p>Protocols</p>
            </div>
        );
    }

    renderProtocols() {
        return (
            <div className="protocols">
                <PageHeader>Protocols</PageHeader>
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