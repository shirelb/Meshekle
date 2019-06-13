import React from 'react';
import {post} from 'axios';
import UserForm from './UserForm';
import {Helmet} from 'react-helmet';
import Page from '../Page';
import usersStorage from "../../storage/usersStorage";
import store from "store";
import {Grid, Header, Modal} from "semantic-ui-react";

class UserAdd extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
    }

    handleSubmit(user) {
        usersStorage.createUser(user, this.serviceProviderHeaders)
            .then(response => {
                // console.log('user created ', response);
                if (response.response) {
                    if (response.response.status !== 200)
                        return response;
                } else {
                    this.props.history.goBack();
                }
            });
    }

    handleCancel(e) {
        e.preventDefault();

        // console.log('you have canceled');

        this.props.history.goBack();
    }

    render() {
        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | Add User</title>
                </Helmet>

                <Grid padded>
                    <Grid.Row>
                        <Header as="h1" floated="right">משתמש חדש</Header>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <UserForm
                                submitText="הוסף"
                                handleSubmit={this.handleSubmit}
                                handleCancel={this.handleCancel}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal>
        );
    }
}

export default UserAdd;