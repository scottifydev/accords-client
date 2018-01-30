import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { invokeApig } from '../libs/awsLib';
import "./Home.css";
import Typist from 'react-typist';
import LinkContainer from "react-router-bootstrap/lib/LinkContainer";
export default class Proposals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            proposals: []
        };
    }
    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const results = await this.proposals();
            this.setState({ proposals: results });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    proposals() {
        return invokeApig({ path: "/get/proposals" });
    }

    renderProposalsList(proposals) {
        console.log(proposals)
        let arry = []
        for (let i = 0; i < proposals.Count; i++) {
            arry.push(
                <LinkContainer to={`/proposal/${proposals.Items[i].userId}/${proposals.Items[i].proposalId}`}>
                <ListGroupItem
                    key={proposals.Items[i].proposalId}
                    onClick={this.handleproposalClick}
                    header={proposals.Items[i].content.trim().split("\n")}
                >
                    {`Proposed by: ${proposals.Items[i].userId} at ${new Date(proposals.Items[i].createdAt).toLocaleString()}\n`}
                    {proposals.Items[i].hasOwnProperty("amendedBy")
                    ?`Amened by: ${proposals.Items[i].amendedBy} at ${new Date(proposals.Items[i].amendedDate).toLocaleString()}`
                    :` `}
                </ListGroupItem>
                </LinkContainer>
            );
        }
        arry.push(
            <ListGroupItem
                key="new"
                href="/proposals/new"
                onClick={this.handleProposalClick}
            >
                <h4>
                    <b>{"\uFF0B"}</b> Propose a new protocol
            </h4>
            </ListGroupItem>
        )
        console.log(arry)
        return arry
    }


    handleProposalClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>Project Reddington:</h1>
                <p>Proposals</p>
            </div>
        );
    }

    renderProposals() {
        let avgTypingDelay = 20
        let stdTypingDelay = 0
        return (
            <div className="proposals">
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
                        Proposals
                    </Typist>
                </PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderProposalsList(this.state.proposals)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderProposals() : this.renderLander()}
            </div>
        );
    }
}