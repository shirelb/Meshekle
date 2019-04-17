import React from 'react';
import './styles.css';

import moment from 'moment';

import {Button, Grid, Header, Icon, Menu, Table} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import store from 'store';
import {Helmet} from 'react-helmet';
import times from 'lodash.times';
import strings from "../../shared/strings";
import AppointmentInfo from "../../components/appointment/AppointmentInfo";
import AppointmentEdit from "../../components/appointment/AppointmentEdit";
import {Link, Route, Switch} from "react-router-dom";
import AppointmentAdd from "../../components/appointment/AppointmentAdd";
import AppointmentRequestInfo from "../../components/appointmentRequest/AppointmentRequestInfo";
import appointmentsStorage from "../../storage/appointmentsStorage";
import usersStorage from "../../storage/usersStorage";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants";
import ServiceProviderEdit from "../../components/serviceProvider/ServiceProviderEdit";

const TOTAL_PER_PAGE = 10;


class AppointmentsReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            appointmentRequests: [],
            calendarEvents: [],
            page: 0,
            totalPages: 0,
            openPopup: false,
            eventPopup: {},
            highlightTableRow: null,
            appointmentRequestHoovering: {requestId: -1},
        };

        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.updateAfterMoveOrResizeEvent = this.updateAfterMoveOrResizeEvent.bind(this);

        this.serviceProviderHeaders = '';
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');

        this.getServiceProviderAppointments();
        this.getServiceProviderAppointmentRequests();

        connectToServerSocket(store.get('serviceProviderId'));

        WEB_SOCKET.on("getServiceProviderAppointmentRequests", this.getServiceProviderAppointmentRequests.bind(this));
    }

    componentWillUnmount() {
        WEB_SOCKET.off("getServiceProviderAppointmentRequests");
    }

    getServiceProviderAppointmentRequests() {
        this.setState({
            appointmentRequests: [],
        });

        appointmentsStorage.getServiceProviderAppointmentRequests(this.serviceProviderId, this.serviceProviderHeaders)
            .then((response) => {
                const appointmentRequests = response.data;
                const totalPages = Math.ceil(appointmentRequests.length / TOTAL_PER_PAGE);

                if (appointmentRequests.length === 0) {
                    this.setState({
                        appointmentRequests: appointmentRequests,
                    });
                } else
                    appointmentRequests.map((appointmentRequest, index) => {
                        usersStorage.getUserByUserID(appointmentRequest.AppointmentDetail.clientId, this.serviceProviderHeaders)
                            .then(user => {
                                appointmentRequest.clientName = user.fullname;
                                appointmentRequest.optionalTimes = JSON.parse(appointmentRequest.optionalTimes);

                                let appointmentRequestEvent = {
                                    id: appointmentRequest.requestId,
                                    title: appointmentRequest.clientName,
                                    allDay: false,
                                    start: null,
                                    end: null,
                                    appointmentRequest: appointmentRequest,
                                    // color:'#b7d2ff',
                                    backgroundColor: '#45b0d9',
                                };

                                let appointmentRequestsEvents = this.state.appointmentRequests;
                                if (appointmentRequestsEvents.filter(item => item.id === appointmentRequest.requestId).length === 0) {
                                    appointmentRequestsEvents.push(appointmentRequestEvent);
                                    this.setState({
                                        appointmentRequests: appointmentRequestsEvents
                                    });
                                }

                            });
                    });

                this.setState({
                    page: 0,
                    totalPages,
                });
            });
    }


    componentWillReceiveProps({location = {}}) {
        if (location.pathname === '/appointments' && location.pathname !== this.props.location.pathname) {
            this.setState({
                appointments: [],
                appointmentRequests: [],
            });
            this.getServiceProviderAppointments();
            this.getServiceProviderAppointmentRequests();
        }
    }

    getServiceProviderAppointments() {
        appointmentsStorage.getServiceProviderAppointments(this.serviceProviderId, this.serviceProviderHeaders)
            .then((response) => {
                this.setState({appointments: []});

                const appointments = response.data;
                const totalPages = Math.ceil(appointments.length / TOTAL_PER_PAGE);

                if (appointments.length === 0) {
                    this.setState({
                        appointments: appointments,
                    });
                } else
                    appointments.map((appointment, index) => {
                        usersStorage.getUserByUserID(appointment.AppointmentDetail.clientId, this.serviceProviderHeaders)
                            .then(user => {
                                let appointmentEvent = {};
                                appointment.clientName = user.fullname;

                                appointmentEvent.id = appointment.appointmentId;
                                appointmentEvent.title = user.fullname;
                                appointmentEvent.allDay = false;
                                appointmentEvent.start = moment(appointment.startDateAndTime);
                                appointmentEvent.end = moment(appointment.endDateAndTime);
                                appointmentEvent.appointment = appointment;

                                let appointmentsEvents = this.state.appointments;
                                appointmentsEvents.push(appointmentEvent);
                                this.setState({
                                    appointments: appointmentsEvents
                                });
                            });
                    });

                this.setState({
                    page: 0,
                    totalPages,
                });

            });
    }

    setPage(page) {
        return () => {
            this.setState({page});
        };
    }

    decrementPage() {
        const {page} = this.state;

        this.setState({page: page - 1});
    }

    incrementPage() {
        const {page} = this.state;

        this.setState({page: page + 1});
    }

    handleDelete(appointmentId) {
        const {appointments} = this.state;

        this.setState({
            appointments: appointments.filter(a => a.id !== appointmentId),
        });
    }

    hoverOnAppointmentRequest = (appointmentRequest) => {
        let isAppointmentsWithOptional = this.state.appointments.filter(obj => obj.id === appointmentRequest.requestId && obj.status === 'optional');
        if (isAppointmentsWithOptional.length > 0)
            return;

        this.setState({appointmentRequestHoovering: appointmentRequest});
        let shadowAppointments = [];
        if (Array.isArray(appointmentRequest.optionalTimes)) {
            appointmentRequest.optionalTimes.map(datesTimes => {
                datesTimes.hours.map(time => {
                    shadowAppointments.push(
                        {
                            id: appointmentRequest.requestId,
                            title: appointmentRequest.clientName,
                            allDay: false,
                            start: moment(moment(datesTimes.date).format("YYYY-MM-DD") + ' ' + time.startHour).toDate(),
                            end: moment(moment(datesTimes.date).format("YYYY-MM-DD") + ' ' + time.endHour).toDate(),
                            appointmentRequest: appointmentRequest,
                            status: "optional",
                            // color:'#b7d2ff',
                            backgroundColor: '#45b0d9',
                        }
                    )
                })
            });
            shadowAppointments.push.apply(shadowAppointments, this.state.appointments);
            if (Array.isArray(shadowAppointments)) {
                this.setState({appointments: shadowAppointments});
            }
        }
    };

    hoverOffAppointmentRequest = (appointmentRequest) => {
        let appointmentsWithoutOptional = this.state.appointments.filter(obj => obj.id !== appointmentRequest.requestId || obj.status !== 'optional');
        this.setState({appointments: appointmentsWithoutOptional});
    };

    onSelectEvent = event => {
        console.log('onSelectEvent=event  ', event);
        // if (event.appointmentId === this.state.highlightTableRow)
        //     this.setState({highlightTableRow: null});
        // else {
        //     this.setState({highlightTableRow: event.appointmentId});
        //
        // }
        /*this.props.history.push(`${this.props.match.path}/${event.appointment.appointmentId}`, {
            appointment: event.appointment
        });*/
    };

    onSelectSlot = (start, end) => {
        let slotInfo = {start: start, end: end};

        /*this.props.history.push(`${this.props.match.path}/set`, {
            slotInfo: slotInfo,
        });*/
    };

    approveAppointmentRequest = (appointmentRequestEventDropped) => {
        var appointmentRequests = this.state.appointmentRequests;
        appointmentsStorage.approveAppointmentRequestById(appointmentRequestEventDropped.appointmentRequest, this.serviceProviderHeaders)
            .then(response => {
                console.log('appointmentRequest approved ', response);

                let updatedAppointmentsRequests = appointmentRequests.filter(function (obj) {
                    return obj.appointmentRequest.requestId !== appointmentRequestEventDropped.appointmentRequest.requestId;
                });
                this.setState({appointmentRequests: updatedAppointmentsRequests})
            });
    };

    onDropAppointmentRequest = (appointmentRequestEvent) => {
        let appointmentRequestDropped = {
            id: appointmentRequestEvent.id,
            title: appointmentRequestEvent.title,
            start: appointmentRequestEvent.start,
            end: moment(appointmentRequestEvent.start).add(2, 'h'),
            allDay: appointmentRequestEvent.allDay,
            appointmentRequest: appointmentRequestEvent.appointmentRequest,
        };
        /*this.props.history.push(`${this.props.match.path}/set`, {
            appointmentRequestDropped: appointmentRequestDropped,
        });*/
    };

    updateAfterMoveOrResizeEvent(event) {
        let events = this.state.appointments;

        let appointment = event.appointment;
        appointment.startDateAndTime = moment(event.start).format();
        appointment.endDateAndTime = moment(event.end).format();

        const idx = events.indexOf(event);

        const updatedEvent = {...event, appointment: appointment};

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        this.updateAppointment(appointment, nextEvents);
    }

    updateAppointment = (appointment, nextEvents) => {
        let event = {
            appointmentId: appointment.appointmentId,
            date: moment(appointment.startDateAndTime).format('YYYY-MM-DD'),
            startTime: moment(appointment.startDateAndTime).format('HH:mm'),
            endTime: moment(appointment.endDateAndTime).format('HH:mm'),
            remarks: appointment.remarks,
            subject: appointment.subject,
            clientId: appointment.clientId,
        };

        appointmentsStorage.updateAppointment(event, this.serviceProviderHeaders)
            .then((response) => {
                this.setState({
                    appointments: nextEvents,
                })
            })
    };


    render() {
        const {appointments, page, totalPages} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;

        console.log("AppointmentsReportPage appointments ", appointments);

        return (
            <div>
                <div>
                    <Helmet>
                        <title>Meshekle | Appointments Report</title>
                    </Helmet>
                    <Grid stretched padded>
                        <Grid.Row>
                            <Header as="h1"
                                    floated="right">{strings.mainPageStrings.REPORT_PAGE_TITLE}</Header>
                        </Grid.Row>

                        <Link to={{
                            pathname: `${this.props.match.url}/serviceProvider/settings`,
                            state: {serviceProviderId: this.serviceProviderId, users: []}
                        }}>
                            <Button positive icon>
                                <Icon name="settings"/>
                                &nbsp;&nbsp;
                                {strings.mainPageStrings.SETTINGS_PAGE_TITLE}
                            </Button>
                        </Link>
                        <Link to='/appointments'>
                            <Button positive icon>
                                <Icon name="calendar"/>
                                &nbsp;&nbsp;
                                {strings.mainPageStrings.BACK_TO_APPOINTMENTS_PAGE_TITLE}
                            </Button>
                        </Link>

                        <Grid.Row columns='equal'>
                            <Table celled striped textAlign='right' selectable sortable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell></Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.CLIENT_ID}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.SERVICE_PROVIDER_ID}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.ROLE}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.SUBJECT}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.STATUS}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.DATE}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.START_TIME}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.END_TIME}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.appointmentsPageStrings.REMARKS}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {appointments.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(appointmentEvent =>
                                        (<Table.Row key={appointmentEvent.appointment.appointmentId}
                                                    positive={this.state.highlightTableRow === appointmentEvent.appointment.appointmentId}>
                                            <Table.Cell>
                                                <Icon link name='edit'
                                                      onClick={() => this.props.history.push(`${this.props.match.path}/${appointmentEvent.appointment.appointmentId}/edit`, {
                                                          appointment: appointmentEvent.appointment,
                                                          openedFrom: "AppointmentsReportPage"
                                                      })}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>{appointmentEvent.appointment.AppointmentDetail.clientId}</Table.Cell>
                                            <Table.Cell>{appointmentEvent.appointment.AppointmentDetail.serviceProviderId}</Table.Cell>
                                            <Table.Cell>{appointmentEvent.appointment.AppointmentDetail.role}</Table.Cell>
                                            <Table.Cell>{JSON.parse(appointmentEvent.appointment.AppointmentDetail.subject).join(", ")}</Table.Cell>
                                            <Table.Cell>{appointmentEvent.appointment.status}</Table.Cell>
                                            <Table.Cell>{new Date(appointmentEvent.appointment.startDateAndTime).toISOString().split('T')[0]}</Table.Cell>
                                            <Table.Cell>{new Date(appointmentEvent.appointment.startDateAndTime).toISOString().split('T')[1].split('.')[0].slice(0, -3)}</Table.Cell>
                                            <Table.Cell>{new Date(appointmentEvent.appointment.endDateAndTime).toISOString().split('T')[1].split('.')[0].slice(0, -3)}</Table.Cell>
                                            <Table.Cell>{appointmentEvent.appointment.remarks}</Table.Cell>
                                        </Table.Row>),
                                    )}
                                </Table.Body>
                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan={10}>
                                            <Menu floated="left" pagination>
                                                {page !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                                    <Icon name="right chevron"/>
                                                </Menu.Item>}
                                                {times(totalPages, n =>
                                                    (<Menu.Item as="a" key={n} active={n === page}
                                                                onClick={this.setPage(n)}>
                                                        {n + 1}
                                                    </Menu.Item>),
                                                )}
                                                {page !== (totalPages - 1) &&
                                                <Menu.Item as="a" icon onClick={this.incrementPage}>
                                                    <Icon name="left chevron"/>
                                                </Menu.Item>}
                                            </Menu>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>

                        </Grid.Row>
                    </Grid>
                </div>


                <div>
                    <Switch>
                        <Route exec path={`${this.props.match.url}/serviceProvider/settings`}
                               component={ServiceProviderEdit}/>
                        <Route exec path={`${this.props.match.path}/requests/:appointmentRequestId`}
                               component={AppointmentRequestInfo}/>
                        <Route exec path={`${this.props.match.path}/set`} render={(props) => (
                            <AppointmentAdd {...props}
                                            approveAppointmentRequest={(appointmentRequestEvent) => this.approveAppointmentRequest(appointmentRequestEvent)}/>
                        )}/>
                        <Route exec path={`${this.props.match.path}/:appointmentId`}
                               component={AppointmentInfo}/>
                        <Route exec path={`${this.props.match.path}/:appointmentId/edit`}
                               component={AppointmentEdit}/>

                        {/*{*/}
                        {/*(this.props.location.pathname === window.location.pathname) ?*/}
                        {/*<Redirect to={`${this.props.match.path}`}/>*/}
                        {/*: null}*/}
                        {/*}*/}
                    </Switch>
                </div>
            </div>
            // </Grid>*/
        );
    }
}

export default AppointmentsReportPage

