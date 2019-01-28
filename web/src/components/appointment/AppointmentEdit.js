import React from 'react';
import axios from 'axios';
import {Helmet} from 'react-helmet';
import getAppointmentByAppointmentID from "../../shared/helpers";
import store from "store";
import AppointmentForm from "./AppointmentForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import mappers from "../../shared/mappers";
import {SERVER_URL} from "../../shared/constants";
import moment from "./AppointmentAdd";
import helpers from "../../shared/helpers";


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

    handleSubmit(appointment) {
        //todo complete this with axios put
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