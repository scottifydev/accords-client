import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { invokeApig } from "../libs/awsLib";
import LoaderButton from "../components/LoaderButton";
// import config from "../config";
import "./NewProtocol.css";

export default class NewProtocol extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: null,
            content: ""
        };
    }

    validateForm() {
        return this.state.content.length > 0;
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
            await this.createProtocol({
                content: this.state.content
            });
            this.props.history.push("/proposals/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }
    
    createProtocol(protocol) {
        return invokeApig({
            path: "/proposal/submit",
            method: "POST",
            body: protocol
        });
    }

    render() {
        return (
            <div className="NewProtocol">
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
                        text="Create"
                        loadingText="Creating…"
                    />
                </form>
            </div>
        );
    }
}