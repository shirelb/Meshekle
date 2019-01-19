import React from 'react';
import axios, {post} from 'axios';
import {Helmet} from 'react-helmet';
import AppointmentForm from "./AppointmentForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import store from "store";
import helpers from "../shared/helpers";
import mappers from "../shared/mappers";
import {SERVER_URL} from "../shared/constants";

class AppointmentAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {slotInfo: this.props.location.state.slotInfo};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
    }

    handleSubmit(appointment) {
        let appointmentToSend = {
            userId: appointment.clientId,
            serviceProviderId: store.get('serviceProviderId'),
            // role: 'Driver',
            date: appointment.date,
            startHour: appointment.startTime,
            endHour: appointment.endTime,
            notes: appointment.remarks,
            subject: appointment.subject
        };

        let serviceProviderRoles;
        helpers.getRolesOfServiceProvider(store.get('serviceProviderId'))
            .then(roles => {
                serviceProviderRoles = roles.map(role => mappers.rolesMapper(role));

                appointmentToSend.role = serviceProviderRoles[0];

                axios.post(`${SERVER_URL}/api/users/appointments/set`,
                    {
                        data: appointmentToSend,
                        headers: this.serviceProviderHeaders
                    }
                )
                    .then((response) => {
                        console.log('add appointment ', response);
                    })
                    .catch((error) => {
                        console.log('add appointment ', error);
                    });
            })
            .catch(error => console.log('error ', error));


        /*post('/api/appointments', appointment)
            .then(() => {
                console.log('added:', appointment);
            });*/
        console.log('appoitment ', appointment)
    }

    handleCancel(e) {
        e.preventDefault();

        this.props.history.goBack()
    }

    render() {
        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                {/*<Page title="Add Appointment" columns={3}>*/}
                <Helmet>
                    <title>Meshekle | Add Appointment</title>
                </Helmet>

                <Grid padded>
                    <Grid.Column>

                        <Header as="h1" floated="right">תור חדש</Header>

                        <AppointmentForm
                            handleSubmit={this.handleSubmit}
                            handleCancel={this.handleCancel}
                            slotInfo={this.state.slotInfo}
                        />
                    </Grid.Column>
                </Grid>
                {/*</Page>*/}
            </Modal>
        );
    }
}

export default AppointmentAdd;