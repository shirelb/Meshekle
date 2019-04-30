import React from 'react';
import '../styles.css';
import {Button, List, Modal} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import strings from "../../shared/strings";
import store from "store";
import appointmentsStorage from "../../storage/appointmentsStorage";
import mappers from "../../shared/mappers";


class AppointmentRequestInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {appointmentRequest: this.props.location.state.appointmentRequest};

        this.handleDelete = this.handleDelete.bind(this);

        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
    }

    componentDidMount() {
        if (this.props.location.state.appointmentRequest)
            this.setState({appointmentRequest: this.props.location.state.appointmentRequest});
        else {
            appointmentsStorage.getAppointmentRequestByAppointmentRequestID(store.get('serviceProviderId'), this.props.match.params, this.serviceProviderHeaders)
                .then(({data: appointmentRequest}) => {
                    this.setState({appointmentRequest});
                });
        }
    }

    handleDelete() {
        appointmentsStorage.rejectAppointmentRequestById(this.state.appointmentRequest, this.serviceProviderHeaders)
            .then((response) => {
                console.log('appointmentRequest handleDelete ', response);
            });

    }

    render() {
        const {appointmentRequest} = this.state;

        return (
            <Modal open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | {appointmentRequest.clientName}</title>
                </Helmet>

                <Modal.Header>{appointmentRequest.clientName}</Modal.Header>
                <Modal.Content image>
                    {/*<Image wrapped size="small" src={`https://api.adorable.io/avatars/250/${user.email}`}/>*/}
                    <Modal.Description>
                        <p>{strings.appointmentsPageStrings.APPOINTMENT_ID}: {appointmentRequest.requestId}</p>
                        <p>{strings.appointmentsPageStrings.CLIENT_NAME}: {appointmentRequest.clientName}</p>
                        <p>{strings.appointmentsPageStrings.SERVICE_PROVIDER_ID}: {appointmentRequest.AppointmentDetail.serviceProviderId}</p>
                        <p>{strings.appointmentsPageStrings.ROLE}: {strings.roles[appointmentRequest.AppointmentDetail.role]}</p>
                        <p>{strings.appointmentsPageStrings.SUBJECT}: {JSON.parse(appointmentRequest.AppointmentDetail.subject).join(", ")}</p>
                        <p>{strings.appointmentsPageStrings.STATUS}: {mappers.appointmentRequestStatusMapper(appointmentRequest.status)}</p>
                        <p>{strings.appointmentsPageStrings.REMARKS}: {appointmentRequest.notes}                         </p>
                        <div>
                            <p>{strings.appointmentsPageStrings.OPTIONAL_TIMES}: </p>
                            <List>
                                {Array.isArray(appointmentRequest.optionalTimes) &&
                                appointmentRequest.optionalTimes.map((datesTimes, j) =>
                                    (
                                        <List.Item key={j}>
                                            <List.Content>
                                                <List.Description>{datesTimes.date}</List.Description>
                                                <List.Description>
                                                    {Array.isArray(datesTimes.hours) &&
                                                    datesTimes.hours.map((time, k) =>
                                                        (
                                                            <List.Item key={k}>
                                                                <List.Content>
                                                                    <List.Description>      {time.startHour}-{time.endHour}</List.Description>
                                                                </List.Content>
                                                            </List.Item>
                                                        ),
                                                    )}
                                                </List.Description>
                                            </List.Content>
                                        </List.Item>
                                    ),
                                )}
                            </List>
                        </div>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions className='alignLeft'>
                    <Button negative onClick={this.handleDelete}>Delete</Button>
                    <Button positive onClick={() => this.props.history.goBack()}>OK</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default AppointmentRequestInfo;