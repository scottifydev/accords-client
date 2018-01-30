import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { getCurrentUser, invokeApig } from "../libs/awsLib";
// import config from "../config";
import "./Protocols.css";
import Typist from 'react-typist';

export default class Protocols extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: null,
            isDeleting: null,
            isRefreshing: null,
            protocol: null,
            content: "",
            comment: "",
            comments: "",
            userId: "",
            proposalId: "",
            currentUser: getCurrentUser().username
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

        try {
            const results = await this.getComments();
            console.log(results)
            this.setState({
                comments: results

            });
        } catch (e) {
            alert(e);
        }
        
        
    }

    componentDidUpdate() {
        this.refs.comments.lastChild.scrollIntoView();
        // alert()
    }

    getProtocol() {
        return invokeApig({ path: `/protocol/${this.props.match.params.id}` });
    }

    getComments() {
        return invokeApig({ path: `/protocol/comments/${this.props.match.params.id}` });
    }
    
    async refreshComments() {
        try {
            const results = await this.getComments();
            this.setState({
                comments: results,
                isRefreshing: false
            });
            console.log(results)
        } catch (e) {
            alert(e);
        }
    }

    validateForm() {
        return this.state.content.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
        document.getElementById('comments').scrollIntoView(false);
    }


    comment(comment) {
        console.log(this.state.isRefreshing)
        return invokeApig({
            path: `/protocol/${this.props.match.params.id}/comment/${this.state.currentUser}`,
            method: "POST",
            body: comment
        });
    }
    


    handleComment = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.setState({ isRefreshing: true });
        console.log(this.state.isRefreshing)            
        
        try {
            await this.comment({
                ...this.state.protocol,
                content: this.state.comment,
            });

            this.setState({ isLoading: false });
            this.refreshComments()
            this.state.comment = ""
            // this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }

    }

    renderComments(comments) {
        console.log(comments)
        let arry = []
        for (let i = 0; i < comments.Count; i++) {
            arry.push(
                <div className="comment" key={comments.Items[i].commentDate} id={comments.Items[i].commentDate}>
                    <div className="comment-body">
                        <span className="comment-username">{comments.Items[i].userId}:</span><span className="comment-text">{comments.Items[i].content}</span>
                    </div>
                    <div className="comment-date">{new Date(comments.Items[i].commentDate).toLocaleString()}</div>
                </div>
            );
        }
        arry.push(
            <div className="comment-end" />
        )
        console.log(arry)
        return arry
    }


    render() {
        return (
            <div className="Protocols">
                <Grid>
                    <Row className="show-grid">
                            <Typist.Delay ms={1500} />
                        <Col md={2} mdOffset={1} >                   
                            <div className="no">[ no. {this.props.match.params.id} ]</div>
                        </Col>
                        <Col md={5} >
                            <div className="protocol">{this.state.content}</div>
                        </Col>
                        <Col md={3} mdOffset={1}>
                            <div className="comments-container">
                                <span className="comment-header">Comments</span>
                                <div className="comments" id="comments" ref="comments">
                                {this.renderComments(this.state.comments)}
                                {/* <div className="comment" id="comment-1">
                                    <div class="comment-body">
                                        <span className="comment-username">Username:</span><span className="comment-text">Comment text</span>
                                    </div>
                                    <div className="comment-date">date</div>
                                </div> */}
                                </div>
                            </div>
                            {this.state.protocol &&
                                <form onSubmit={this.handleSubmit}>
                                <ControlLabel>Add a comment</ControlLabel>
                                    <FormGroup controlId="comment">
                                        <FormControl
                                            onChange={this.handleChange}
                                            componentClass="textarea"
                                            value={this.state.comment}
                                            />
                                    </FormGroup>
                                    <LoaderButton
                                        block
                                        bsStyle="primary"
                                        bsSize="large"
                                        disabled={!this.validateForm()}
                                        type="submit"
                                        isLoading={this.state.isLoading}
                                        onClick={this.handleComment}
                                        text="Post"
                                        loadingText="Saving…"
                                        />
                                </form>}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

