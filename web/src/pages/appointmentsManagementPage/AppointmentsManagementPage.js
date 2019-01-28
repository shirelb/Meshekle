import React from 'react';
import './styles.css';
import 'semantic-ui-css/semantic.min.css';
import {Grid, Header, List} from 'semantic-ui-react';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import moment from 'moment';
import 'moment/locale/he';
import axios from 'axios';
import store from 'store';
import {Helmet} from 'react-helmet';
import {SERVER_URL} from "../../shared/constants";
import strings from "../../shared/strings";
import helpers from "../../shared/helpers";
import AppointmentInfo from "../../components/appointment/AppointmentInfo";
import AppointmentEdit from "../../components/appointment/AppointmentEdit";
import {Redirect, Route, Switch} from "react-router-dom";
import AppointmentAdd from "../../components/appointment/AppointmentAdd";
import AppointmentRequestInfo from "../../components/appointmentRequest/AppointmentRequestInfo";


const TOTAL_PER_PAGE = 10;

moment.locale('he');
const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
// BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
// const DragAndDropCalendar = withDragAndDrop(BigCalendar, {backend: false});
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

function Event({event}) {
    return (
        <span>
      <strong>{event.clientName}</strong>
            {event.desc && ':  ' + event.desc}
    </span>
    )
}

function EventAgenda({event}) {
    return (
        <span>
      <em style={{color: 'magenta'}}>{event.clientName}</em>
      <p>{event.desc}</p>
    </span>
    )
}

const customDayPropGetter = date => {
    if (date.getDate() === 7 || date.getDate() === 15)
        return {
            className: 'special-day',
            style: {
                border: 'solid 3px ' + (date.getDate() === 7 ? '#faa' : '#afa'),
            },
        }
    else return {}
}

const customSlotPropGetter = date => {
    if (date.getDate() === 7 || date.getDate() === 15)
        return {
            className: 'special-day',
        }
    else return {}
}

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
            eventModal: null,
            highlightTableRow: null,
            open: false,
            openSetNewAppointment: false,
        };

        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.moveEvent = this.moveEvent.bind(this);


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
    }

    getServiceProviderAppointmentRequests() {
        axios.get(`${SERVER_URL}/api/serviceProviders/appointmentRequests/serviceProviderId/${this.serviceProviderId}`,
            {
                headers: this.serviceProviderHeaders,
                params: {
                    status: 'requested'
                },
            }
        )
            .then((response) => {
                const appointmentRequests = response.data;
                const totalPages = Math.ceil(appointmentRequests.length / TOTAL_PER_PAGE);
                console.log('appointmentRequests ', appointmentRequests);

                appointmentRequests.map((appointmentRequest, index) => {
                    helpers.getUserByUserID(appointmentRequest.AppointmentDetail.clientId, this.serviceProviderHeaders)
                        .then(user => {
                            appointmentRequest.clientName = user.fullname;
                            appointmentRequest.optionalTimes = JSON.parse(appointmentRequest.optionalTimes);
                            // let optionalTimes = JSON.parse(appointmentRequest.optionalTimes);
                            // let formattedOptionalTimes=[];
                            // optionalTimes.map(daysTimes => {
                            //     formattedOptionalTimes.push(daysTimes.day);
                            //     formattedOptionalTimes[daysTimes.day]=[];
                            //     daysTimes.hours.map(time=>{
                            //         formattedOptionalTimes[daysTimes.day].push({startHour:time.startHour,endHour:time.endHour})
                            //     })
                            // });
                            // appointmentRequest.optionalTimes = formattedOptionalTimes;
                            // console.log('ppp  ', appointmentRequest.optionalTimes.map(m=>m.day+' '+m.hours.map(k=>k.startHour+'-'+k.endHour)));
                            this.setState({
                                appointmentRequests: appointmentRequests
                            })
                        });
                });

                this.setState({
                    appointmentRequests: appointmentRequests,
                    page: 0,
                    totalPages,
                });
            });
    }

    show = (dimmer, openModel) => this.setState({dimmer, openModel: true});
    close = (openModel) => this.setState({openModel: false});

    componentWillReceiveProps({location = {}}) {
        console.log("componentWillReceiveProps !!!!!!!");
        if (location.pathname === '/appointments' && location.pathname !== this.props.location.pathname) {
            this.getServiceProviderAppointments();
            this.getServiceProviderAppointmentRequests();
        }
    }

    getServiceProviderAppointments() {
        axios.get(`${SERVER_URL}/api/serviceProviders/appointments/serviceProviderId/${this.serviceProviderId}`,
            {
                headers: this.serviceProviderHeaders,
                params: {
                    status: 'set'
                },
            }
        )
            .then((response) => {
                const appointments = response.data;
                const totalPages = Math.ceil(appointments.length / TOTAL_PER_PAGE);
                console.log('appointments ', appointments);

                appointments.map((appointment, index) => {
                    helpers.getUserByUserID(appointment.AppointmentDetail.clientId, this.serviceProviderHeaders)
                        .then(user => {
                            appointment.clientName = user.fullname;
                            // appointment.id = appointment.appointmentId;
                            appointment.allDay = false;
                            appointment.startDateAndTime = new Date(appointment.startDateAndTime);
                            appointment.endDateAndTime = new Date(appointment.endDateAndTime);
                            this.setState({
                                appointments: appointments
                            })
                        });
                });

                this.setState({
                    appointments: appointments,
                    page: 0,
                    totalPages,
                });

                // this.createEvents();
            });
    }

    createEvents() {
        let calendarEvents = [];

        axios.all(this.state.appointments.map((appointment, index) => {
            helpers.getUserByUserID(appointment.AppointmentDetail.clientId, this.serviceProviderHeaders)
                .then(user => {
                    calendarEvents.push({
                        id: appointment.appointmentId,
                        title: user.fullname,
                        subject: appointment.AppointmentDetail.subject,
                        start: appointment.startDateAndTime,
                        end: appointment.endDateAndTime,
                        allDay: false,
                        resource: appointment
                    })
                })
        }))
            .then(() => {
                console.log("in create events ", calendarEvents);
                this.setState({calendarEvents: calendarEvents});
                this.forceUpdate();
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

    getAllDatesOfMonthByDay = (day) => {
        let dayEnum = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let datesArray = [];
        let dateByDay = moment()
            .startOf('month')
            .day(dayEnum.indexOf(day));
        if (dateByDay.date() > 7) dateByDay.add(7, 'd');
        let month = dateByDay.month();
        while (month === dateByDay.month()) {
            datesArray.push(dateByDay.toDate());
            dateByDay.add(7, 'd');
        }
        return datesArray;
    };

    hoverOnAppointmentRequest = (appointmentRequest) => {
        let shadowAppointments = [];
        if (appointmentRequest.optionalTimes)
            appointmentRequest.optionalTimes.map(daysTimes => {
                daysTimes.hours.map(time => {
                    this.getAllDatesOfMonthByDay(daysTimes.day).map(date => {
                        shadowAppointments.push(
                            {
                                appointmentRequestId: appointmentRequest.requestId,
                                clientId: appointmentRequest.AppointmentDetail.clientId,
                                clientName: appointmentRequest.clientName,
                                role: appointmentRequest.AppointmentDetail.role,
                                serviceProviderId: appointmentRequest.AppointmentDetail.serviceProviderId,
                                subject: appointmentRequest.AppointmentDetail.subject,
                                allDay: false,
                                startDateAndTime: moment(date.toLocaleString().substring(0, 10) + ' ' + time.startHour).toDate(),
                                endDateAndTime: moment(date.toLocaleString().substring(0, 10) + ' ' + time.endHour).toDate(),
                                remarks: appointmentRequest.notes,
                                status: "optional",
                            }
                        )
                    });
                })
            });
        shadowAppointments.push.apply(shadowAppointments, this.state.appointments);
        if (Array.isArray(shadowAppointments)) {
            this.setState({appointments: shadowAppointments});
        }
    };

    hoverOffAppointmentRequest = (appointmentRequest) => {
        let appointmentsWithoutOptional = this.state.appointments.filter(obj => obj.appointmentId !== appointmentRequest.appointmentRequestId || obj.status !== 'optional');
        this.setState({appointments: appointmentsWithoutOptional});
    };

    onHoverEvent = event =>
        //     this.setState({eventPopup: event, openPopup: true});
        // };
        // console.log('hoover ', event);
        `title: ${event}`;
    // };

    onSelectEvent = event => {
        // this.setState({openPopup: true, eventPopup: event});
        console.log('onSelectEvent=event  ', event);
        if (event.appointmentId === this.state.highlightTableRow)
            this.setState({highlightTableRow: null});
        else {
            this.setState({highlightTableRow: event.appointmentId});

        }
        // console.log('onSelectEvent before state ', this.state);
        // this.show('blurring');
        // this.setState({eventModal: event});
        // console.log('onSelectEvent after state ', this.state);
        this.props.history.push(`${this.props.match.path}/${event.appointmentId}`, {
            appointment: event
        });

        // alert(event);
    };

    onSelectSlot = slotInfo => {
        console.log('onSelectSlot = slotInfo  ', slotInfo);

        this.props.history.push(`${this.props.match.path}/set`, {
            slotInfo: slotInfo
        });

    };

    // moveEvent({event, start, end}) {
    moveEvent({event, startDateAndTime, endDateAndTime, isAllDay: droppedOnAllDaySlot}) {

        const events = this.state.appointments;

        console.log('in moveEvent');

        const idx = events.indexOf(event);
        let allDay = event.allDay;

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false
        }

        const updatedEvent = {...event, startDateAndTime, endDateAndTime, allDay};

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        this.setState({
            appointments: nextEvents,
        })

        /*const idx = events.indexOf(event);
        let updatedEvent = {...event, start, end};
        const nextEvents = [...events];
        if (idx > -1) {
            nextEvents.splice(idx, 1, updatedEvent);
            UpdateEvents(event.id).update({start, end}).then(
                this.setState({
                    events: nextEvents,
                })
            ).catch(error => {
                console.error('Update error', error);
            });
        }
        else {
            const newEventId = uuidV4();
            updatedEvent = {...updatedEvent, id: newEventId, ownerId: this.props.uid};
            console.log(updatedEvent);
            nextEvents.push(updatedEvent);
            UpdateEvents(newEventId).set(updatedEvent).then(
                this.setState({
                    events: nextEvents,
                })
            ).catch(error => {
                console.error('Create New Event error', error);
            });
        }*/
    }

    // resizeEvent = (resizeType, {event, start, end}) => {
    resizeEvent = ({appointment, startDateAndTime, endDateAndTime}) => {

        const appointments = this.state.appointments;

        console.log('in resizeEvent');

        const nextEvents = appointments.map(existingAppointment => {
            console.log('existingAppointment  ', existingAppointment);
            if (existingAppointment.appointmentId === appointment.appointmentId) {
                console.log('existingAppointment 33 ', existingAppointment);
                return {...existingAppointment, startDateAndTime, endDateAndTime}
            } else
                return existingAppointment;
        });

        this.setState({
            appointments: nextEvents,
        })

        /*const nextEvents = appointments.map(existingEvent => {
            return existingEvent.id === appointment.id
                ? {...existingEvent, start, end}
                : existingEvent
        });

        UpdateEvents(appointment.id).update({start, end}).then(
            this.setState({
                appointments: nextEvents,
            })
        ).catch(error => {
            console.error('Update error', error);
        });*/
    };


    render() {
        const {t} = this.props;
        const {appointments, page, totalPages} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;

        // moment.locale("he", {
        //     week: {
        //         dow: 1 //Monday is the first day of the week.
        //     }
        // });
        // moment.locale('he');
        // const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
        const {calendarEvents} = this.state;

        const {open, dimmer, openSetNewAppointment, openPopup, eventPopup} = this.state;
        // console.log("aaaa ", this.state.appointmentRequests[0] ?
        //     this.state.appointmentRequests[0].optionalTimes.forEach(v=> console.log(v.day+v.hours))
        //     : '');

        return (
            <div>
                {/*<Page children={appointments} title={strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE} columns={1}>*/}
                <div>
                    <Helmet>
                        <title>Meshekle | Appointments</title>
                    </Helmet>
                    <Grid stretched padded>
                        <Grid.Row>
                            <Header as="h1" floated="right">{strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE}</Header>
                        </Grid.Row>
                        <Grid.Row columns='equal'>
                            <Grid.Column>
                                בקשות תורים:
                                <List animated selection divided verticalAlign='middle'>
                                    {this.state.appointmentRequests.map((appointmentRequest, i) =>
                                        (
                                            <List.Item key={appointmentRequest.requestId}
                                                       onMouseEnter={this.hoverOnAppointmentRequest.bind(this, appointmentRequest)}
                                                       onMouseLeave={this.hoverOffAppointmentRequest.bind(this, appointmentRequest)}
                                                       onClick={() => this.props.history.push(`${this.props.match.path}/requests/${appointmentRequest.requestId}`, {
                                                           appointmentRequest: appointmentRequest
                                                       })}
                                            >
                                                {/*<Image avatar src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />*/}
                                                <List.Content>
                                                    <List.Header>{appointmentRequest.clientName}</List.Header>
                                                    {/*<List.Description*/}
                                                    {/*as='a'>{appointmentRequest.AppointmentDetail.serviceProviderId}</List.Description>*/}
                                                    {/*<List.Description*/}
                                                    {/*as='a'>{appointmentRequest.AppointmentDetail.role}</List.Description>*/}
                                                    <List.Description
                                                        as='a'>{appointmentRequest.AppointmentDetail.subject}</List.Description>
                                                    <List.Description
                                                        as='a'>{appointmentRequest.notes}</List.Description>
                                                    <List.Description>
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
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        ),
                                    )}
                                </List>
                            </Grid.Column>
                            <Grid.Column width={13}>
                                <div style={{height: 600}}>
                                    <DragAndDropCalendar
                                        localizer={localizer}
                                        events={Array.isArray(appointments) ? appointments : []}
                                        titleAccessor='clientName'
                                        startAccessor="startDateAndTime"
                                        endAccessor="endDateAndTime"
                                        tooltipAccessor={this.onHoverEvent.bind(this)}
                                        selectable
                                        onSelectEvent={this.onSelectEvent.bind(this)}
                                        onSelectSlot={this.onSelectSlot.bind(this)}
                                        popup
                                        rtl
                                        // step={30}
                                        // timeslots={4}
                                        onEventDrop={this.moveEvent}
                                        // draggableAccessor={event => true}
                                        resizable
                                        onEventResize={this.resizeEvent}
                                        messages={{
                                            date: 'תאריך',
                                            time: 'זמן',
                                            event: 'תור',
                                            allDay: 'כל היום',
                                            week: 'שבועי',
                                            day: 'יומי',
                                            month: 'חודשי',
                                            previous: 'הקודם',
                                            next: 'הבא',
                                            yesterday: 'אתמול',
                                            tomorrow: 'מחר',
                                            today: 'היום',
                                            agenda: 'יומן',
                                        }}
                                        culture="he-IL"
                                        dayPropGetter={customDayPropGetter}
                                        slotPropGetter={customSlotPropGetter}
                                        components={{
                                            event: Event,
                                            agenda: {
                                                event: EventAgenda,
                                            },
                                        }}
                                        // eventPropGetter={(event,start,end,isSelected)=>{
                                        //     return {
                                        //         style: {
                                        //             backgroundColor:'transparent',
                                        //             // color: Colors.primary,
                                        //             borderRadius:0,
                                        //             border: 'none',
                                        //             whiteSpace: 'pre-wrap',
                                        //             overflowY: 'auto'
                                        //         }
                                        //     }
                                        // }}
                                    />
                                </div>
                            </Grid.Column>
                            {/*<Grid.Column>

                            </Grid.Column>*/}
                        </Grid.Row>
                    </Grid>
                </div>


                {/*// openPopup && eventPopup ?*/}
                {/*{if(eventPopup){*/}
                {/*<Popup
                        // key={eventPopup.appointmentId}
                        trigger={openPopup}
                        // open={openPopup}
                        header={eventPopup.clientName}
                        content={eventPopup}
                        // hideOnScroll
                        // closeOnPortalMouseLeave
                        // closeOnTriggerMouseLeave
                        // defaultOpen={false}
                    />*/}
                {/*: null*/}
                {/*}}*/}


                {/*<Table celled striped textAlign='right' selectable sortable>
                        <Table.Header>
                            <Table.Row>
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
                            {appointments.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(appointment =>
                                (<Table.Row key={appointment.appointmentId}
                                            positive={this.state.highlightTableRow === appointment.appointmentId}>
                                    <Table.Cell>{appointment.AppointmentDetail.clientId}</Table.Cell>
                                    <Table.Cell>{appointment.AppointmentDetail.serviceProviderId}</Table.Cell>
                                    <Table.Cell>{appointment.AppointmentDetail.role}</Table.Cell>
                                    <Table.Cell>{appointment.AppointmentDetail.subject}</Table.Cell>
                                    <Table.Cell>{appointment.status}</Table.Cell>
                                    <Table.Cell>{new Date(appointment.startDateAndTime).toISOString().split('T')[0]}</Table.Cell>
                                    <Table.Cell>{new Date(appointment.startDateAndTime).toISOString().split('T')[1].split('.')[0].slice(0, -3)}</Table.Cell>
                                    <Table.Cell>{new Date(appointment.endDateAndTime).toISOString().split('T')[1].split('.')[0].slice(0, -3)}</Table.Cell>
                                    <Table.Cell>{appointment.remarks}</Table.Cell>
                                </Table.Row>),
                            )}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan={9}>
                                    <Menu floated="left" pagination>
                                        {page !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                            <Icon name="right chevron"/>
                                        </Menu.Item>}
                                        {times(totalPages, n =>
                                            (<Menu.Item as="a" key={n} active={n === page} onClick={this.setPage(n)}>
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

                    <Button as={Link} to={`${this.props.match.path}/set`}
                            positive>{strings.appointmentsPageStrings.ADD_APPOINTMENT}</Button>
*/}
                {/* <Modal dimmer={dimmer} open={openSetNewAppointment} onClose={this.close}>
                        <Modal.Header>Select a Photo</Modal.Header>
                        <Modal.Content>
                            <Image wrapped size='medium'
                               src='https://react.semantic-ui.com/images/avatar/large/rachel.png'/>
                        <Modal.Description>
                            <Header>Default Profile Image</Header>
                            <p>We've found the following gravatar image associated with your e-mail address.</p>
                            <p>Is it okay to use this photo?</p>
                        </Modal.Description>
                            <UserInfo/>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.close}>
                                Nope
                            </Button>
                            <Button
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="Yep, that's me"
                                onClick={this.close}
                            />
                        </Modal.Actions>
                    </Modal>*/}

                {/* <Modal dimmer={dimmer} open={open} onClose={this.close}>
                        <Modal.Header>Select a Photo</Modal.Header>
                        <Modal.Content>
                            <Image wrapped size='medium'
                               src='https://react.semantic-ui.com/images/avatar/large/rachel.png'/>
                        <Modal.Description>
                            <Header>Default Profile Image</Header>
                            <p>We've found the following gravatar image associated with your e-mail address.</p>
                            <p>Is it okay to use this photo?</p>
                        </Modal.Description>
                            <UserInfo/>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.close}>
                                Nope
                            </Button>
                            <Button
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="Yep, that's me"
                                onClick={this.close}
                            />
                        </Modal.Actions>
                    </Modal>*/}
                {/*</Page>*/}


                <div>
                    <Switch>
                        <Route exec path={`${this.props.match.path}/requests/:appointmentRequestId`}
                               component={AppointmentRequestInfo}/>
                        <Route exec path={`${this.props.match.path}/set`}
                               component={AppointmentAdd}/>
                        <Route exec path={`${this.props.match.path}/:appointmentId`}
                               component={AppointmentInfo}/>
                        <Route exec path={`${this.props.match.path}/:appointmentId/edit`}
                               component={AppointmentEdit}/>
                        <Redirect to={`${this.props.match.path}`}/>
                    </Switch>
                </div>
            </div>
            // </Grid>*/
        );
    }
}

export default DragDropContext(HTML5Backend)(AppointmentsManagementPage)