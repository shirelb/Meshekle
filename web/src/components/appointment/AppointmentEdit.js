import React from 'react';
import {Helmet} from 'react-helmet';
import store from "store";
import AppointmentForm from "./AppointmentForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import appointmentsStorage from "../../storage/appointmentsStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";


class AppointmentEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {appointment: this.props.location.state.appointment};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
    }

    componentDidMount() {
        if (this.props.location.state.appointment)
            this.setState({appointment: this.props.location.state.appointment});
        else
            appointmentsStorage.getAppointmentByAppointmentID(store.get('serviceProviderId'), this.props.match.params, this.serviceProviderHeaders)
                .then(({data: appointment}) => {
                    this.setState({appointment});
                });
    }

    handleSubmit(appointment) {
        serviceProvidersStorage.getRolesOfServiceProvider(store.get('serviceProviderId'))
            .then(roles => {
                appointment.appointmentId = this.state.appointment.appointmentId;
                appointmentsStorage.updateAppointment(appointment, this.serviceProviderHeaders)
                    .then((response) => {
                        this.props.history.goBack();
                        if (this.props.location.state.openedFrom === "AppointmentInfo")
                            this.props.history.goBack();
                    })
            })
    }

    handleCancel(e) {
        e.preventDefault();

        console.log('you have canceled');

        this.props.history.goBack();
    }

    render() {
        const {appointment} = this.state;

        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | ערוך תור מס {appointment.appointmentId.toString()}</title>
                </Helmet>

                <Grid padded>
                    <Grid.Column>

                        <Header as="h1" floated="right">ערוך תור</Header>

                        <AppointmentForm
                            submitText="עדכן"
                            handleSubmit={this.handleSubmit}
                            handleCancel={this.handleCancel}
                            // slotInfo={}
                            appointment={appointment}
                        />

                    </Grid.Column>
                </Grid>
            </Modal>
        );
    }
}

export default AppointmentEdit;