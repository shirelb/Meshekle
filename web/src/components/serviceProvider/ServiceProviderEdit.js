import React from 'react';
import {get, patch} from 'axios';
import {Helmet} from 'react-helmet';
import ServiceProviderForm from './ServiceProviderForm';
import Page from '../Page';
import store from "store";
import appointmentsStorage from "../../storage/appointmentsStorage";
import usersStorage from "../../storage/usersStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import {Grid, Header, Modal} from "semantic-ui-react";

class ServiceProviderEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {user: this.props.location.state.user};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
    }

    componentDidMount() {
        if (this.props.location.state.user)
            this.setState({user: this.props.location.state.user});
        else
            usersStorage.getUserByUserID(this.props.match.params.userId, this.serviceProviderHeaders)
                .then(user => {
                    this.setState({user: user});
                })
    }

    handleSubmit(user) {
        usersStorage.updateUserById(user, this.serviceProviderHeaders)
            .then((response) => {
                this.props.history.goBack();
                this.props.history.goBack();
            })
    }

    handleCancel(e) {
        e.preventDefault();

        console.log('you have canceled');

        this.props.history.goBack();
    }

    render() {
        const {user} = this.state;

        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | ערוך משתמש {user.fullname}</title>
                </Helmet>

                <Grid padded>
                    <Grid.Row>
                        <Header as="h1" floated="right">ערוך משתמש</Header>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <ServiceProviderForm
                                submitText="עדכן"
                                user={user}
                                handleSubmit={this.handleSubmit}
                                handleCancel={this.handleCancel}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal>);
    }
}

export default ServiceProviderEdit;