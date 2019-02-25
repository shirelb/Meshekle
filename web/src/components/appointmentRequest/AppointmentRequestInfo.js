import React from 'react';
import '../styles.css';
import {Button, List, Modal} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import strings from "../../shared/strings";
import store from "store";
import appointmentsStorage from "../../storage/appointmentsStorage";


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
        console.log('mvmvvm ', this.props.location.state.appointmentRequest);

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
        console.log('appointmentRequest handleDelete ', this.serviceProviderHeaders);
        appointmentsStorage.rejectAppointmentRequestById(this.state.appointmentRequest.appointmentRequestId, this.serviceProviderHeaders)
            .then((response) => {
                console.log('appointmentRequest handleDelete ', response.data);
            });

        this.props.history.goBack();
    }

    render() {
        const {appointmentRequest} = this.state;
        console.log('resder apponmnt info appointmentRequest ', appointmentRequest);

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
                        <p>{strings.appointmentsPageStrings.ROLE}: {appointmentRequest.AppointmentDetail.role}</p>
                        <p>{strings.appointmentsPageStrings.SUBJECT}: {appointmentRequest.AppointmentDetail.subject}</p>
                        <p>{strings.appointmentsPageStrings.STATUS}: {appointmentRequest.status}</p>
                        <p>{strings.appointmentsPageStrings.REMARKS}: {appointmentRequest.notes}                         </p>
                        <p>{strings.appointmentsPageStrings.OPTIONAL_TIMES}:
                            <List>
                                {Array.isArray(appointmentRequest.optionalTimes) &&
                                appointmentRequest.optionalTimes.map((daysTimes, j) =>
                                    (
                                        <List.Item key={j}>
                                            <List.Content>
                                                <List.Description>{daysTimes.day}</List.Description>
                                                <List.Description>
                                                    {Array.isArray(daysTimes.hours) &&
                                                    daysTimes.hours.map((time, k) =>
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
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions className='alignLeft'>
                    {/*<Button positive>Edit</Button>*/}
                    <Button negative onClick={this.handleDelete}>Delete</Button>
                    <Button positive onClick={() => this.props.history.goBack()}>OK</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default AppointmentRequestInfo;