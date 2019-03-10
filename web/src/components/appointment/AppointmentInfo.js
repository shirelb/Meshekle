import React from 'react';
import '../styles.css';
import {Modal,Button} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import strings from "../../shared/strings";
import store from "store";
import AppointmentEdit from "./AppointmentEdit";
import appointmentsStorage from "../../storage/appointmentsStorage";
import moment from 'moment';
import {Redirect, Route, Switch} from "react-router-dom";


class AppointmentInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {appointment: this.props.location.state.appointment};

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

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

    handleDelete() {
        console.log('appointment handleDelete ', this.serviceProviderHeaders);
        appointmentsStorage.cancelAppointmentById(this.state.appointment.appointmentId, this.serviceProviderHeaders)
            .then((response) => {
                console.log('appointment handleDelete ', response.data);
            });

        this.props.history.goBack();
    }

    handleEdit() {
        this.props.history.push(`${this.props.match.url}/edit`, {
            appointment: this.state.appointment
        });
    }

    render() {
        const {appointment} = this.state;

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
                            <p>{strings.appointmentsPageStrings.SUBJECT}: {JSON.parse(appointment.AppointmentDetail.subject).join(", ")}</p>
                            <p>{strings.appointmentsPageStrings.STATUS}: {appointment.status}</p>
                            <p>{strings.appointmentsPageStrings.DATE}: {moment(appointment.startDateAndTime).format('DD.MM.YYYY')}</p>
                            <p>{strings.appointmentsPageStrings.START_TIME}: {moment(appointment.startDateAndTime).format("HH:mm")} </p>
                            <p>{strings.appointmentsPageStrings.END_TIME}: {moment(appointment.endDateAndTime).format("HH:mm")}</p>
                            <p>{strings.appointmentsPageStrings.REMARKS}: {appointment.remarks}</p>
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