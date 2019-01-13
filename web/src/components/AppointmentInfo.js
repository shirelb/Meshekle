import React from 'react';
import './styles.css';
import {Button, Modal} from 'semantic-ui-react';
import axios from 'axios';
import {Helmet} from 'react-helmet';
import {Table} from "semantic-ui-react/dist/commonjs/collections/Table";
import strings from "../shared/strings";
import getAppointmentByAppointmentID from "../shared/helpers";
import store from "store";


class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {event: this.props.location.state.event, appointment: this.props.location.state.appointment};

        this.handleDelete = this.handleDelete.bind(this);
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
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

    handleDelete() {
        axios.delete('/api/users/1')
            .then(() => {
                console.log('user deleted');
            });
    }

    render() {
        const {event, appointment} = this.state;
        console.log('resder apponmnt info appointment ', appointment);

        return (
            <Modal open dimmer="blurring" closeIcon onClose={()=>this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | {event.title}</title>
                </Helmet>

                <Modal.Header>{event.title}</Modal.Header>
                <Modal.Content image>
                    {/*<Image wrapped size="small" src={`https://api.adorable.io/avatars/250/${user.email}`}/>*/}
                    <Modal.Description>
                        <p>{strings.appointmentsPageStrings.APPOINTMENT_ID}: {appointment.appointmentId}</p>
                        <p>{strings.appointmentsPageStrings.CLIENT_NAME}: {event.title}</p>
                        <p>{strings.appointmentsPageStrings.SERVICE_PROVIDER_ID}: {appointment.AppointmentDetail.serviceProviderId}</p>
                        <p>{strings.appointmentsPageStrings.ROLE}: {appointment.AppointmentDetail.role}</p>
                        <p>{strings.appointmentsPageStrings.SUBJECT}: {appointment.AppointmentDetail.subject}</p>
                        <p>{strings.appointmentsPageStrings.STATUS}: {appointment.status}</p>
                        <p>{strings.appointmentsPageStrings.DATE}: {new Date(appointment.startDateAndTime).toISOString().split('T')[0]}                         </p>
                        <p>{strings.appointmentsPageStrings.START_TIME}: {new Date(appointment.startDateAndTime).toISOString().split('T')[1].split('.')[0].slice(0, -3)}                         </p>
                        <p>{strings.appointmentsPageStrings.END_TIME}: {new Date(appointment.endDateAndTime).toISOString().split('T')[1].split('.')[0].slice(0, -3)}                         </p>
                        <p>{strings.appointmentsPageStrings.REMARKS}: {appointment.remarks}                         </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions className='alignLeft'>
                    {/*<Button positive>Edit</Button>*/}
                    <Button negative onClick={this.handleDelete}>Delete</Button>
                    <Button positive onClick={()=>this.props.history.goBack()}>OK</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default UserInfo;