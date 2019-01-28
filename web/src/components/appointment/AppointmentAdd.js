import React from 'react';
import axios, {post} from 'axios';
import {Helmet} from 'react-helmet';
import AppointmentForm from "./AppointmentForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import store from "store";
import moment from 'moment';
import helpers from "../../shared/helpers";
import mappers from "../../shared/mappers";
import {SERVER_URL} from "../../shared/constants";

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
        helpers.getRolesOfServiceProvider(store.get('serviceProviderId'))
            .then(roles => {
                let serviceProviderRoles = roles.map(role => mappers.rolesMapper(role));

                axios.post(`${SERVER_URL}/api/serviceProviders/appointments/set`,
                    {
                        userId: appointment.clientId,
                        serviceProviderId: store.get('serviceProviderId'),
                        role: serviceProviderRoles[0],
                        date: moment.isMoment(appointment.date) ? appointment.date.format('YYYY-MM-DD') : appointment.date,
                        startHour: moment.isMoment(appointment.startTime) ? appointment.startTime.format("HH:mm") : appointment.startTime,
                        endHour: moment.isMoment(appointment.endTime) ? appointment.endTime.format("HH:mm") : appointment.endTime,
                        notes: appointment.remarks ? appointment.remarks : '',
                        subject: JSON.stringify(appointment.subject)
                    },
                    {
                        headers: this.serviceProviderHeaders
                    }
                )
                    .then((response) => {
                        console.log('add appointment ', response);
                        this.props.history.goBack()
                    })
                    .catch((error) => {
                        console.log('add appointment ', error);
                    });
            })
            .catch(error => console.log('error ', error));
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
                            submitText="קבע"
                            handleSubmit={this.handleSubmit}
                            handleCancel={this.handleCancel}
                            slotInfo={this.state.slotInfo}
                            // appointment={}
                        />
                    </Grid.Column>
                </Grid>
                {/*</Page>*/}
            </Modal>
        );
    }
}

export default AppointmentAdd;