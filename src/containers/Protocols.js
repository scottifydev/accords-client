import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { invokeApig } from "../libs/awsLib";
import config from "../config";
import "./Protocols.css";

export default class Protocols extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: null,
            isDeleting: null,
            protocol: null,
            content: "",
            userId: "",
            proposalId: ""
        };
    }

    async componentDidMount() {
        try {
            const results = await this.getProtocol();
            console.log(results)
            this.setState({
                protocol: results,
                content: results.Items[0].content,
                userId: results.Items[0].userId,
                proposalId: results.Items[0].proposalId

            });
        } catch (e) {
            alert(e);
        }
    }

    getProtocol() {
        return invokeApig({ path: `/protocol/${this.props.match.params.id}` });
    }
    
    validateForm() {
        return this.state.content.length > 0;
    }


    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }


    saveProtocol(protocol) {
        return invokeApig({
            path: `/protocol/${this.state.userId}/${this.state.proposalId}`,
            method: "PUT",
            body: protocol
        });
    }

    handleSubmit = async event => {
        let uploadedFilename;

        event.preventDefault();

        this.setState({ isLoading: true });

        try {

            await this.saveProtocol({
                ...this.state.protocol,
                content: this.state.content,
                keys: {
                    userId: this.state.userId,
                    proposalId: this.state.proposalId
                }

            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    deleteProtocol() {
        return invokeApig({
            path: `/protocol/${this.state.userId}/${this.state.proposalId}`,
            method: "DELETE"
        });
    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this protocol?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await this.deleteProtocol();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    }

    render() {
        return (
            <div className="Protocols">
                {this.state.protocol &&
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="content">
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.content}
                                componentClass="textarea"
                            />
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Save"
                            loadingText="Saving…"
                        />
                        <LoaderButton
                            block
                            bsStyle="danger"
                            bsSize="large"
                            isLoading={this.state.isDeleting}
                            onClick={this.handleDelete}
                            text="Delete"
                            loadingText="Deleting…"
                        />
                    </form>}
            </div>
        );
    }
}

