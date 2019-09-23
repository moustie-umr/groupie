import React, { PureComponent } from 'react';
import GoogleLogin from 'react-google-login';
import Auth from '../../providers/auth';
import User from '../../providers/user';
import { CONFIG } from '../../Constants';
import { Jumbotron, Row, Col } from 'reactstrap';

const store = require('store');

class AuthComponent extends PureComponent {
    constructor(props){
        super(props);
        
        this.state = {
            loading: false,
        }
    }

    toggleLoading = () => {
        this.setState((prevState) => ({
            loading: !prevState.loading
        }))
    }

    onLoggedIn = () => {
        this.props.history.replace('/home');
    }

    onSuccess = async ({tokenId, profileObj}) => {
        try{
            const token = await Auth.invite(tokenId, this.props.match.params.id);
            User.setToken(token);
            this.onLoggedIn();

        }catch(e){
            this.onError(e);
        }
    }

    onError = (error) => {
        console.log(error);
    }

    render(){
        const {params} = this.props.match;
        return (
            <Row>
                <Col xs="3"></Col>
                <Col xs="6">
                    <div className="text-center pt-5 mt-5 mx-5 ">
                        <Jumbotron>
                            <h3>Welcome, {params.email}</h3>
                            <hr className="my-2" />
                            <hr className="my-2 pb-3" />
                            <GoogleLogin
                            clientId={CONFIG.GG_CLIENT_ID}
                            buttonText="Login"
                            onRequest={this.toggleLoading}
                            onSuccess={this.onSuccess}
                            onFailure={this.onError}
                            cookiePolicy={'single_host_origin'}
                            />
                        </Jumbotron>
                    </div> 
                </Col>
                <Col xs="3"></Col>
            </Row>

        )
    }
}

export default AuthComponent;