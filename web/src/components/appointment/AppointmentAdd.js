import React from 'react';
import {Helmet} from 'react-helmet';
import AppointmentForm from "./AppointmentForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import store from "store";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../storage/appointmentsStorage";

class AppointmentAdd extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.userOptions === undefined)
            this.props.getUsersForAppointmentForm();
        if (this.props.serviceProviderRoles === undefined)
            this.props.getServiceProviderRoles();
        if (this.props.location.state.slotInfo)
            this.state = {
                slotInfo: this.props.location.state.slotInfo
            };
        if (this.props.location.state.appointmentRequestDropped)
            this.state = {
                appointmentRequestEvent: this.props.location.state.appointmentRequestDropped
            };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
    }

    handleSubmit(appointment) {
        var appointmentRequestEvent = this.state.appointmentRequestEvent;
        return serviceProvidersStorage.getRolesOfServiceProvider(store.get('serviceProviderId'), this.serviceProviderHeaders)
            .then(roles => {
                if (roles.response) {
                    if (roles.response.status !== 200)
                        return roles;
                } else
                    return appointmentsStorage.setAppointment(appointment, store.get('serviceProviderId'), roles, this.serviceProviderHeaders)
                        .then((response) => {
                            // console.log(response);
                            if (response.response) {
                                if (response.response.status !== 200)
                                    return response;
                            } else {
                                if (appointmentRequestEvent)
                                    this.props.approveAppointmentRequest(appointmentRequestEvent);

                                this.props.history.goBack();
                                return response;
                            }
                        })
            })
    }

    handleCancel(e) {
        e.preventDefault();

        this.props.history.goBack()
    }

    render() {

        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
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
                            appointmentRequestEvent={this.state.appointmentRequestEvent}
                            userOptions={this.props.userOptions}
                            serviceProviderRoles={this.props.serviceProviderRoles}
                        />
                    </Grid.Column>
                </Grid>
            </Modal>
        );
    }
}

export default AppointmentAdd;