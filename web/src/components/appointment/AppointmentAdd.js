import React from 'react';
import {Helmet} from 'react-helmet';
import AppointmentForm from "./AppointmentForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import store from "store";
import mappers from "../../shared/mappers";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../storage/appointmentsStorage";

class AppointmentAdd extends React.Component {
    constructor(props) {
        super(props);

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
        var appointmentRequestEvent=this.state.appointmentRequestEvent;
        serviceProvidersStorage.getRolesOfServiceProvider(store.get('serviceProviderId'))
            .then(roles => {
                let serviceProviderRoles = roles.map(role => mappers.rolesMapper(role));

                appointmentsStorage.setAppointment(appointment, store.get('serviceProviderId'), serviceProviderRoles, this.serviceProviderHeaders)
                    .then((response) => {
                        console.log(response);

                        console.log('this.props ', this.props);
                        console.log('this.state ', this.state);
                        if (appointmentRequestEvent)
                            this.props.approveAppointmentRequest(appointmentRequestEvent);

                        this.props.history.goBack()
                    })


            });
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
                            appointmentRequestEvent={this.state.appointmentRequestEvent}
                        />
                    </Grid.Column>
                </Grid>
                {/*</Page>*/}
            </Modal>
        );
    }
}

export default AppointmentAdd;