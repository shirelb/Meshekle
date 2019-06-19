import React from 'react';
import {Helmet} from 'react-helmet';
import store from "store";
import AppointmentForm from "./AppointmentForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import appointmentsStorage from "../../storage/appointmentsStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import mappers from "../../shared/mappers";
import usersStorage from "../../storage/usersStorage";


class AppointmentEdit extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.userOptions === undefined)
            this.props.getUsersForAppointmentForm();
        if (this.props.serviceProviderRoles === undefined)
            this.props.getServiceProviderRoles();

        this.state = {appointment: this.props.location.state ? this.props.location.state.appointment : {}};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
    }

    componentDidMount() {
        if (this.props.location.state) {
            if (this.props.location.state.appointment)
                this.setState({appointment: this.props.location.state.appointment});
        } else
            appointmentsStorage.getAppointmentByAppointmentID(store.get('serviceProviderId'), this.props.match.params.appointmentId, this.serviceProviderHeaders)
                .then((appointment) => {
                    if (appointment.response) {
                        if (appointment.response.status !== 200)
                            this.setState({
                                infoError: true,
                                infoErrorHeader: 'קרתה שגיאה בעת הבאת פרטי התור',
                                infoErrorContent: mappers.errorMapper(appointment.response)
                            });
                    } else {
                        usersStorage.getUserByUserID(appointment.AppointmentDetail.clientId, this.serviceProviderHeaders)
                            .then(user => {
                                if (user.response) {
                                    if (user.response.status !== 200)
                                        this.setState({
                                            infoError: true,
                                            infoErrorHeader: 'קרתה שגיאה בעת הבאת פרטי התור',
                                            infoErrorContent: mappers.errorMapper(user.response)
                                        });
                                } else {
                                    appointment.clientName = user.fullname;
                                    this.setState({appointment: appointment});
                                }
                            });
                    }
                });
    }

    handleSubmit(appointment) {
        return serviceProvidersStorage.getRolesOfServiceProvider(store.get('serviceProviderId'), this.serviceProviderHeaders)
            .then(roles => {
                if (roles.response) {
                    if (roles.response.status !== 200)
                        return roles;
                } else {
                    appointment.appointmentId = this.state.appointment.appointmentId;
                    return appointmentsStorage.updateAppointment(appointment, this.serviceProviderHeaders)
                        .then((response) => {
                            if (response.response) {
                                if (response.response.status !== 200)
                                    return response;
                            } else {
                                this.props.history.goBack();
                                if (this.props.location.state.openedFrom === "AppointmentInfo")
                                    this.props.history.goBack();
                            }
                        })
                }
            })
    }

    handleCancel(e) {
        e.preventDefault();

        // console.log('you have canceled');

        this.props.history.goBack();
    }

    render() {
        const {appointment} = this.state;

        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | ערוך תור
                        מס {appointment ? appointment.appointmentId ? appointment.appointmentId.toString() : '' : ""}</title>
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
                            userOptions={this.props.userOptions}
                            serviceProviderRoles={this.props.serviceProviderRoles}
                        />

                    </Grid.Column>
                </Grid>
            </Modal>
        );
    }
}

export default AppointmentEdit;