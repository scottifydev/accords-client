import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { invokeApig } from '../libs/awsLib';
import Typist from 'react-typist';
import "./Home.css";

export default class Dossiers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            dossiers: []
        };
    }
    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const results = await this.dossiers();
            this.setState({ dossiers: results });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    dossiers() {
        return invokeApig({ path: "/dossiers" });
    }

    renderDossiersList(dossiers) {
        console.log(dossiers)
        let arry = []
        // for (let i = 0; i < dossiers.Count; i++) {
        //     let dossierText = "[ no. " + dossiers.Items[i].dossierNumber + " ]  " + dossiers.Items[i].content.trim().split("\n")
        //     arry.push(
        //         <LinkContainer to={`/dossier/${dossiers.Items[i].dossierNumber}`}>
        //             <ListGroupItem
        //                 key={dossiers.Items[i].dossierNumber}
        //                 onClick={this.handledossierClick}
        //                 header={dossierText}
        //             >
        //                 {"Proposed by: " + dossiers.Items[i].userId}
        //                 <br />
        //                 {"Ratified by: " + dossiers.Items[i].ratifiedBy + " at " + new Date(dossiers.Items[i].ratifiedDate).toLocaleString()}
        //                 <br />
        //                 {" Review on: " + new Date(dossiers.Items[i].reviewDate).toLocaleString()}
        //             </ListGroupItem>
        //         </LinkContainer>
        //     );
        // }
        arry.push(
            <ListGroupItem
                key="new"
                href="/dossiers/new"
                onClick={this.handleProposalClick}
            >
                <h4>
                    <b>{"\uFF0B"}</b> Create a new dossier
            </h4>
            </ListGroupItem>
        )
        console.log(arry)
        return arry
    }


    handleDossierClick = event => {
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
                    <h1>Project Reddington:</h1>
                    <Typist.Delay ms={200} />
                    <p>Dossiers</p>
                </Typist>
            </div>
        );
    }

    renderDossiers() {
        let avgTypingDelay = 20
        let stdTypingDelay = 0
        return (
            <div className="dossiers">
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
                        Dossiers
                    </Typist>
                </PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderDossiersList(this.state.dossiers)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderDossiers() : this.renderLander()}
            </div>
        );
    }
}