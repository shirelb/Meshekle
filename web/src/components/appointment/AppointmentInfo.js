import React from 'react';
import '../styles.css';
import {Button, Container, Message, Modal} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import strings from "../../shared/strings";
import store from "store";
import AppointmentEdit from "./AppointmentEdit";
import appointmentsStorage from "../../storage/appointmentsStorage";
import moment from 'moment';
import {Route, Switch} from "react-router-dom";
import mappers from "../../shared/mappers";
import usersStorage from "../../storage/usersStorage";


class AppointmentInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // appointment: this.props.location.state ? this.props.location.state.appointment : {},
            infoError: false,
            infoErrorHeader: '',
            infoErrorContent: ''
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

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

    handleDelete() {
        // console.log('appointment handleDelete ', this.serviceProviderHeaders);
        appointmentsStorage.cancelAppointmentById(this.state.appointment, this.serviceProviderHeaders)
            .then((response) => {
                // console.log('appointment handleDelete ', response.data);
                if (response.response) {
                    if (response.response.status !== 200)
                        this.setState({
                            infoError: true,
                            infoErrorHeader: 'קרתה שגיאה בעת מחיקת התור',
                            infoErrorContent: mappers.errorMapper(response.response)
                        });
                } else
                    this.props.history.goBack();
            });
    }

    handleEdit() {
        this.props.history.push(`${this.props.match.url}/edit`, {
            appointment: this.state.appointment,
            openedFrom: "AppointmentInfo"
        });
    }

    render() {
        const {appointment, infoError, infoErrorHeader, infoErrorContent} = this.state;

        return (
            <div>
                <Modal open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                    <Helmet>
                        <title>Meshekle | פרטי תור {appointment ? appointment.clientName ? appointment.clientName : appointment.AppointmentDetail.clientId : ""}</title>
                    </Helmet>

                    <Modal.Header>{appointment ? appointment.clientName ? appointment.clientName : appointment.AppointmentDetail.clientId : ""}</Modal.Header>
                    <Modal.Content image>
                        {/*<Image wrapped size="small" src={`https://api.adorable.io/avatars/250/${user.email}`}/>*/}
                        {appointment ?
                            <Modal.Description>
                                <Container text>
                                    <p>{strings.appointmentsPageStrings.APPOINTMENT_ID}: {appointment.appointmentId}</p>
                                    <p>{strings.appointmentsPageStrings.CLIENT_NAME}: {appointment.clientName}</p>
                                    <p>{strings.appointmentsPageStrings.SERVICE_PROVIDER_ID}: {appointment.AppointmentDetail.serviceProviderId}</p>
                                    <p>{strings.appointmentsPageStrings.ROLE}: {strings.roles[appointment.AppointmentDetail.role]}</p>
                                    <p>{strings.appointmentsPageStrings.SUBJECT}: {JSON.parse(appointment.AppointmentDetail.subject).join(", ")}</p>
                                    <p>{strings.appointmentsPageStrings.STATUS}: {mappers.appointmentStatusMapper(appointment.status)}</p>
                                    <p>{strings.appointmentsPageStrings.DATE}: {moment(appointment.startDateAndTime).format('DD.MM.YYYY')}</p>
                                    <p>{strings.appointmentsPageStrings.START_TIME}: {moment(appointment.startDateAndTime).format("HH:mm")} </p>
                                    <p>{strings.appointmentsPageStrings.END_TIME}: {moment(appointment.endDateAndTime).format("HH:mm")}</p>
                                    <p>{strings.appointmentsPageStrings.REMARKS}: {appointment.remarks}</p>

                                    {infoError ?
                                        <Message
                                            error
                                            header={infoErrorHeader}
                                            content={infoErrorContent}
                                        />
                                        : null
                                    }
                                </Container>
                            </Modal.Description> :
                            <Modal.Description/>
                        }
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
                               render={(props) => (
                                   <AppointmentEdit
                                       {...props}
                                       userOptions={this.props.userOptions}
                                       getUsersForAppointmentForm={this.props.getUsersForAppointmentForm}
                                       serviceProviderRoles={this.props.serviceProviderRoles}
                                       getServiceProviderRoles={this.props.getServiceProviderRoles}
                                   />
                               )}/>
                        {/*<Redirect to={`${this.props.match.path}`}/>*/}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default AppointmentInfo;