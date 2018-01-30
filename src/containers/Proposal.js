import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { getCurrentUser, invokeApig } from "../libs/awsLib";
// import config from "../config";
import "./Protocols.css";

export default class Proposals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: null,
            isDeleting: null,
            isRatifying: null,
            isAmending: null,
            proposal: null,
            content: "",
            userId: "",
            proposalId: ""
        };
    }
    
    async componentDidMount() {
        this.state.currentUser = getCurrentUser().username
        console.log(this.state)
        try {
            const results = await this.getProposal();
            console.log(results)
            this.setState({
                proposal: results,
                content: results.Items[0].content,
                userId: results.Items[0].userId,
                proposalId: results.Items[0].proposalId
                
            });
        } catch (e) {
            alert(e);
        }
    }
    
    getProposal() {
        // console.log(this.state)
        return invokeApig({ path: `/proposal/${this.props.match.params.userId}/${this.props.match.params.proposalId}` });
    }
    
    validateForm() {
        return this.state.content.length > 0;
    }


    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }


    saveProposal(proposal) {
        return invokeApig({
            path: `/proposal/${this.state.userId}/${this.state.proposalId}`,
            method: "PUT",
            body: proposal
        });
    }

    handleSubmit = async event => {

        event.preventDefault();

        this.setState({ isLoading: true });

        try {

            await this.saveProposal({
                ...this.state.proposal,
                content: this.state.content

            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    amendProposal(proposal) {
        return invokeApig({
            path: `/proposal/amend/${this.state.userId}/${this.state.proposalId}/${this.state.currentUser}`,
            method: "PUT",
            body: proposal
        });
    }

    handleAmend = async event => {

        event.preventDefault();

        this.setState({ isAmendinging: true });

        try {

            await this.amendProposal({
                ...this.state.proposal,
                content: this.state.content,

            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isAmending: false });
        }
    }

    ratifyProposal(proposal) {
        return invokeApig({
            path: `/proposal/ratify/${this.state.userId}/${this.state.proposalId}/${this.state.currentUser}`,
            method: "PUT",
            body: proposal
        });
    }

    handleRatify = async event => {

        event.preventDefault();

        this.setState({ isRatifying: true });

        try {

            await this.ratifyProposal({
                ...this.state.proposal,
                content: this.state.content,

            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isRatifying: false });
        }
    }

    deleteProposal() {
        return invokeApig({
            path: `/proposal/${this.state.userId}/${this.state.proposalId}`,
            method: "DELETE"
        });
    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this proposal?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await this.deleteProposal();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    }

    render() {
        return (
            <div className="Proposals">
                {this.state.proposal &&
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="content">
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.content}
                                componentClass="textarea"
                            />
                        </FormGroup>
                        {this.state.userId === this.state.currentUser 
                        ?<LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Save"
                            loadingText="Saving…"
                        />
                        :<LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isAmending}
                            onClick={this.handleAmend}
                            text="Amend"
                            loadingText="Amending…"
                        />}
                        {this.state.userId === this.state.currentUser 
                        ?<LoaderButton
                            block
                            bsStyle="danger"
                            bsSize="large"
                            isLoading={this.state.isDeleting}
                            onClick={this.handleDelete}
                            text="Delete"
                            loadingText="Deleting…"
                        />
                        :<LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            onClick={this.handleRatify}
                            text="Ratify"
                            loadingText="Ratifying…"
                        />}
                    </form>}
            </div>
        );
    }
}

