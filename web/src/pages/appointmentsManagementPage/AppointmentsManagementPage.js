import React from 'react';
import './styles.css';

import moment from 'moment';

import {Button, Grid, Header, Icon, Label} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import AppointmentCalendar from "../../components/calendars/AppointmentCalendar";
import store from 'store';
import {Helmet} from 'react-helmet';
import strings from "../../shared/strings";
import AppointmentInfo from "../../components/appointment/AppointmentInfo";
import AppointmentEdit from "../../components/appointment/AppointmentEdit";
import {Link, Route, Switch} from "react-router-dom";
import AppointmentAdd from "../../components/appointment/AppointmentAdd";
import AppointmentRequestInfo from "../../components/appointmentRequest/AppointmentRequestInfo";
import DraggableAppointmentRequest from "../../components/appointmentRequest/DraggableAppointmentRequest";
import appointmentsStorage from "../../storage/appointmentsStorage";
import usersStorage from "../../storage/usersStorage";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants";
import ServiceProviderEdit from "../../components/serviceProvider/ServiceProviderEdit";
import helpers from "../../shared/helpers";

const TOTAL_PER_PAGE = 10;

const colorEventByRole = {
    appointmentsHairDresser: "#3a87ad",
    appointmentsDentist: "#378006",
};


const hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

class AppointmentsManagementPage extends React.Component {
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
            appointmentByRoleCount: {appointmentsHairDresser: 0, appointmentsDentist: 0}
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
                                    backgroundColor: hex2rgba(colorEventByRole[appointmentRequest.AppointmentDetail.role], 0.5),
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
                this.setState({
                    appointments: [],
                    appointmentByRoleCount: {appointmentsHairDresser: 0, appointmentsDentist: 0}
                });

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
                                appointmentEvent.backgroundColor = colorEventByRole[appointment.AppointmentDetail.role];

                                let appointmentsEvents = this.state.appointments;
                                appointmentsEvents.push(appointmentEvent);
                                this.setState({
                                    appointments: appointmentsEvents
                                });

                                let appointmentByRoleCount = this.state.appointmentByRoleCount;
                                appointmentByRoleCount[appointment.AppointmentDetail.role] = appointmentByRoleCount[appointment.AppointmentDetail.role] + 1;
                                this.setState({
                                    appointmentByRoleCount: appointmentByRoleCount
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
                            backgroundColor: hex2rgba(colorEventByRole[appointmentRequest.AppointmentDetail.role], 0.5),
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
        this.props.history.push(`${this.props.match.path}/${event.appointment.appointmentId}`, {
            appointment: event.appointment
        });
    };

    onSelectSlot = (start, end) => {
        let slotInfo = {start: start, end: end};

        this.props.history.push(`${this.props.match.path}/set`, {
            slotInfo: slotInfo,
        });
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
        this.props.history.push(`${this.props.match.path}/set`, {
            appointmentRequestDropped: appointmentRequestDropped,
        });
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
        const {appointments, appointmentByRoleCount} = this.state;


        return (
            <div style={{marginBottom: 150}}>
                <div>
                    <Helmet>
                        <title>Meshekle | Appointments</title>
                    </Helmet>
                    <Grid stretched padded id={'divToPrint'}>
                        <Grid.Row>
                            <Header as="h1"
                                    floated="right">{strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE}</Header>
                        </Grid.Row>

                        <div className={"left floated five"}>
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
                            <Link to={`${this.props.match.url}/report`}>
                                <Button positive icon>
                                    <Icon name="columns"/>
                                    &nbsp;&nbsp;
                                    {strings.mainPageStrings.REPORT_PAGE_TITLE}
                                </Button>
                            </Link>

                            <Button icon
                                    onClick={() => helpers.exportToPDF('MeshekleAppointmentsCalendar', 'divToPrint', 'landscape')}>
                                <Icon name="file pdf outline"/>
                                &nbsp;&nbsp;
                                יצא לPDF
                            </Button>
                        </div>

                        <Grid.Column width={3}></Grid.Column>

                        <div className={"right floated five"}>
                            {Object.keys(colorEventByRole).map(role => {
                                return <Label style={{
                                    color: "white",
                                    backgroundColor: `${colorEventByRole[role]}`,
                                    marginLeft: 10
                                }}>
                                    {strings.roles[role]}
                                    &nbsp;&nbsp;
                                    <Label.Detail>{appointmentByRoleCount[role]}</Label.Detail>
                                </Label>
                            })
                            }
                        </div>

                        <Grid.Row columns='equal'>
                            <Grid.Column>
                                <Header as={'h3'} style={{'display': 'contents'}}> בקשות תורים:</Header>
                                {this.state.appointmentRequests.length === 0 ?
                                    <Header as={'h4'}> אין לך בקשות לתורים </Header>
                                    :
                                    <DraggableAppointmentRequest
                                        appointmentRequests={this.state.appointmentRequests}
                                        hoverOnAppointmentRequest={(appointmentRequest) => this.hoverOnAppointmentRequest.bind(this, appointmentRequest)}
                                        hoverOffAppointmentRequest={(appointmentRequest) => this.hoverOffAppointmentRequest.bind(this, appointmentRequest)}
                                        onClick={(appointmentRequest) => this.props.history.push(`${this.props.match.path}/requests/${appointmentRequest.requestId}`, {
                                            appointmentRequest: appointmentRequest
                                        })}
                                        colorEventByRole={colorEventByRole}
                                    />
                                }
                            </Grid.Column>
                            <Grid.Column width={13}>
                                <div style={{height: 500}}>
                                    <AppointmentCalendar
                                        events={Array.isArray(appointments) ? appointments : []}

                                        onSelectEvent={this.onSelectEvent.bind(this)}
                                        onSelectSlot={this.onSelectSlot.bind(this)}
                                        onDropAppointmentRequest={this.onDropAppointmentRequest.bind(this)}
                                        approveAppointmentRequest={(appointmentRequestDropped) => this.approveAppointmentRequest.bind(this, appointmentRequestDropped)}
                                        updateAfterMoveOrResizeEvent={this.updateAfterMoveOrResizeEvent}
                                    />
                                </div>
                            </Grid.Column>
                            {/*<Grid.Column>

                            </Grid.Column>*/}
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

                        {/*{
                            (this.props.location.pathname === window.location.pathname) ?
                            <Redirect to={`${this.props.match.path}`}/>
                            : null}
                        }*/}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default AppointmentsManagementPage

