import React from 'react';
import {get, patch} from 'axios';
import {Helmet} from 'react-helmet';
import getAppointmentByAppointmentID from "../../shared/helpers";
import store from "store";
import AppointmentForm from "./AppointmentForm";
import {Grid, Header, Modal} from "semantic-ui-react";

class UserEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {appointment: this.props.location.state.appointment};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state.appointment)
            this.setState({appointment: this.props.location.state.appointment});
        else
            getAppointmentByAppointmentID(store.get('serviceProviderId'), this.props.match.params, this.serviceProviderHeaders)
                .then(({data: appointment}) => {
                    this.setState({appointment});
                });
    }

    handleSubmit(user) {
        patch(`/api/users/${user.id}`, user)
            .then(() => {
                this.setState({user});

                console.log('updated:', user);
            });
    }

    handleCancel(e) {
        e.preventDefault();

        console.log('you have canceled');

        this.props.history.push(`${this.props.match.path}`);
    }

    render() {
        const {appointment} = this.state;

        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                {/*<Page title="ערוך תור" columns={3}>*/}
                <Helmet>
                    <title>Meshekle | ערוך תור מס {appointment.appointmentId.toString()}</title>
                </Helmet>

                <Grid padded>
                    <Grid.Column>

                        <Header as="h1" floated="right">תור חדש</Header>

                        <AppointmentForm
                            submitText="עדכן"
                            handleSubmit={this.handleSubmit}
                            handleCancel={this.handleCancel}
                            // slotInfo={}
                            appointment={appointment}
                        />

                    </Grid.Column>
                </Grid>

                {/*</Page>*/}
            </Modal>
        );
    }
}

export default UserEdit;