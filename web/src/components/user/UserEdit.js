import React from 'react';
import {get} from 'axios';
import {Helmet} from 'react-helmet';
import UserForm from './UserForm';
import store from "store";
import usersStorage from "../../storage/usersStorage";
import {Grid, Header, Modal} from "semantic-ui-react";
import mappers from "../../shared/mappers";

class UserEdit extends React.Component {
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
        if (this.props.location.state) {
            if (this.props.location.state.user)
                this.setState({user: this.props.location.state.user});
        } else
            usersStorage.getUserByUserID(this.props.match.params.userId, this.serviceProviderHeaders)
                .then(user => {
                    if (user.response) {
                        if (user.response.status !== 200)
                            this.setState({
                                infoError: true,
                                infoErrorHeader: 'קרתה שגיאה בעת הבאת פרטי משתמש',
                                infoErrorContent: mappers.errorMapper(user.response)
                            });
                    } else
                        this.setState({user: user});
                })
    }

    handleSubmit(user) {
        return usersStorage.updateUserById(user, this.serviceProviderHeaders)
            .then((response) => {
                if (response.response) {
                    if (response.response.status !== 200)
                        return response;
                } else {
                    this.props.history.goBack();
                    this.props.history.goBack();
                    return response;
                }
            })
    }

    handleCancel(e) {
        e.preventDefault();

        // console.log('you have canceled');

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
                            <UserForm
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

export default UserEdit;