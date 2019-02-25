import React from 'react';
import '../styles.css';
import {Button, Modal} from 'semantic-ui-react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import strings from "../../shared/strings";
import store from "store";
import AppointmentEdit from "./AppointmentEdit";
import appointmentsStorage from "../../storage/appointmentsStorage";


class AppointmentInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {appointment: this.props.location.state.appointment};

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };

        console.log('apponmnt info this.props ', this.props);
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

    handleDelete() {
        console.log('appointment handleDelete ', this.serviceProviderHeaders);
        appointmentsStorage.cancelAppointmentById(this.state.appointment.appointmentId, this.serviceProviderHeaders)
            .then((response) => {
                console.log('appointment handleDelete ', response.data);
            });

        this.props.history.goBack();
    }

    handleEdit() {
        // console.log('ppp  ', this.props.match.path);
        this.props.history.push(`${this.props.match.url}/edit`, {
            // this.props.history.push(`/appointments/${this.state.appointment.appointmentId}/edit`, {
            // this.props.history.push(`${this.props.match.path}/edit`, {
            appointment: this.state.appointment
        });
        // return <Route exec path={`${this.props.match.path}/edit`}
        //        component={AppointmentEdit}/>
    }

    render() {
        const {appointment} = this.state;
        console.log('resder apponmnt info appointment ', appointment);

        return (
            <div>
                <Modal open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                    <Helmet>
                        <title>Meshekle | {appointment.clientName}</title>
                    </Helmet>

                    <Modal.Header>{appointment.clientName}</Modal.Header>
                    <Modal.Content image>
                        {/*<Image wrapped size="small" src={`https://api.adorable.io/avatars/250/${user.email}`}/>*/}
                        <Modal.Description>
                            <p>{strings.appointmentsPageStrings.APPOINTMENT_ID}: {appointment.appointmentId}</p>
                            <p>{strings.appointmentsPageStrings.CLIENT_NAME}: {appointment.clientName}</p>
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
                        <Button positive onClick={this.handleEdit}>ערוך</Button>
                        <Button negative onClick={this.handleDelete}>מחק</Button>
                        {/*<Button positive onClick={() => this.props.history.goBack()}>השאר</Button>*/}
                    </Modal.Actions>
                </Modal>

                <div>
                    <Switch>
                        <Route exec path={`${this.props.match.url}/edit`}
                               component={AppointmentEdit}/>
                        <Redirect to={`${this.props.match.path}`}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default AppointmentInfo;