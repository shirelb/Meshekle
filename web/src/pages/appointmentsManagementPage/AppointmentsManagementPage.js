import React from 'react';

import './styles.css';
import 'semantic-ui-css/semantic.min.css';
import {Card, Grid, Header, Icon, List} from 'semantic-ui-react';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import moment from 'moment';
import 'moment/locale/he';
import store from 'store';
import {Helmet} from 'react-helmet';
import strings from "../../shared/strings";
import AppointmentInfo from "../../components/appointment/AppointmentInfo";
import AppointmentEdit from "../../components/appointment/AppointmentEdit";
import {Redirect, Route, Switch} from "react-router-dom";
import AppointmentAdd from "../../components/appointment/AppointmentAdd";
import AppointmentRequestInfo from "../../components/appointmentRequest/AppointmentRequestInfo";
import appointmentsStorage from "../../storage/appointmentsStorage";
import usersStorage from "../../storage/usersStorage";
import DraggableResource from "../../components/dragableResource/DragableResource";
import AppointmentRequestListRender from "../../components/appointmentRequest/AppointmentRequestListRender";


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
            {/*{event.startDateAndTime && ':  ' + event.endDateAndTime}*/}
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

const customEventPropGetter = event => {
    let bgColor = event.appointmentRequestId || event.status === 'optional' ? '#b7d2ff' : '#4286f4';
    let opacity = event.appointmentRequestId || event.status === 'optional' ? 0.8 : 1;

    // console.log(date);
    // var backgroundColor = '#' + event.hexColor;
    var style = {
        // backgroundColor: bgColor,
        // borderRadius: '0px',
        opacity: opacity,
        // color: 'black',
        // border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
};

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
            highlightTableRow: null,
            calendarView: BigCalendar.Views.MONTH,
        };

        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.moveEvent = this.moveEvent.bind(this);
        this.resizeEvent = this.resizeEvent.bind(this);


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
        appointmentsStorage.getServiceProviderAppointmentRequests(this.serviceProviderId, this.serviceProviderHeaders)
            .then((response) => {
                const appointmentRequests = response.data;
                const totalPages = Math.ceil(appointmentRequests.length / TOTAL_PER_PAGE);
                console.log('appointmentRequests ', appointmentRequests);

                appointmentRequests.map((appointmentRequest, index) => {
                    usersStorage.getUserByUserID(appointmentRequest.AppointmentDetail.clientId, this.serviceProviderHeaders)
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


    componentWillReceiveProps({location = {}}) {
        console.log("componentWillReceiveProps !!!!!!!");
        if (location.pathname === '/appointments' && location.pathname !== this.props.location.pathname) {
            this.getServiceProviderAppointments();
            this.getServiceProviderAppointmentRequests();
        }
    }

    getServiceProviderAppointments() {
        appointmentsStorage.getServiceProviderAppointments(this.serviceProviderId, this.serviceProviderHeaders)
            .then((response) => {
                const appointments = response.data;
                const totalPages = Math.ceil(appointments.length / TOTAL_PER_PAGE);
                console.log('appointments ', appointments);

                appointments.map((appointment, index) => {
                    usersStorage.getUserByUserID(appointment.AppointmentDetail.clientId, this.serviceProviderHeaders)
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
        let shadowAppointments = [];
        if (Array.isArray(appointmentRequest.optionalTimes)) {
            appointmentRequest.optionalTimes.map(datesTimes => {
                datesTimes.hours.map(time => {
                    shadowAppointments.push(
                        {
                            appointmentRequestId: appointmentRequest.requestId,
                            clientId: appointmentRequest.AppointmentDetail.clientId,
                            clientName: appointmentRequest.clientName,
                            role: appointmentRequest.AppointmentDetail.role,
                            serviceProviderId: appointmentRequest.AppointmentDetail.serviceProviderId,
                            subject: appointmentRequest.AppointmentDetail.subject,
                            allDay: false,
                            startDateAndTime: moment(moment(datesTimes.date).format("YYYY-MM-DD") + ' ' + time.startHour).toDate(),
                            endDateAndTime: moment(moment(datesTimes.date).format("YYYY-MM-DD") + ' ' + time.endHour).toDate(),
                            remarks: appointmentRequest.notes,
                            status: "optional",
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
        let appointmentsWithoutOptional = this.state.appointments.filter(obj => obj.appointmentId !== appointmentRequest.appointmentRequestId || obj.status !== 'optional');
        this.setState({appointments: appointmentsWithoutOptional});
    };

    onDragStartAppointmentRequest = appointmentRequest => event => {
        // let fromBox = JSON.stringify({ id: appointmentRequest.id });
        event.dataTransfer.setData("dragContent", JSON.stringify(appointmentRequest));
    };

    onDragOverAppointmentRequest = appointmentRequest => event => {
        event.preventDefault(); // Necessary. Allows us to drop.
        return false;
    };

    onDropAppointmentRequest = appointmentRequest => event => {
        console.log("in onDropAppointmentRequest appointmentRequest ",appointmentRequest);

        event.preventDefault();

        // let fromBox = JSON.parse(event.dataTransfer.getData("dragContent"));
        // let toBox = { id: data.id };

        // this.swapBoxes(fromBox, toBox);
        return false;
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

    moveEvent({event, start, end, isAllDay: droppedOnAllDaySlot}) {
        console.log('in moveEvent ');
        const events = this.state.appointments;

        const idx = events.indexOf(event);
        let allDay = event.allDay;

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false
        }

        const updatedEvent = {...event, startDateAndTime: start, endDateAndTime: end, allDay};

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        this.updateAppointment(event, nextEvents);
    }

    resizeEvent({event, start, end}) {
        console.log('in resizeEvent ');
        const appointments = this.state.appointments;

        const nextEvents = appointments.map(existingAppointment => {
            return existingAppointment.appointmentId === event.appointmentId
                ? {...existingAppointment, startDateAndTime: start, endDateAndTime: end}
                : existingAppointment
        });

        this.updateAppointment(event, nextEvents);
    };

    updateAppointment = (event, nextEvents) => {
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

        // moment.locale('he');
        // const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

        const {openPopup, eventPopup} = this.state;

        return (
            <div>
                {/*<Page children={appointments} title={strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE} columns={1}>*/}
                <div>
                    <Helmet>
                        <title>Meshekle | Appointments</title>
                    </Helmet>
                    <Grid stretched padded>
                        <Grid.Row>
                            <Header as="h1"
                                    floated="right">{strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE}</Header>
                        </Grid.Row>
                        <Grid.Row columns='equal'>
                            <Grid.Column>
                                בקשות תורים:
                                <List animated selection divided verticalAlign='middle'>
                                    {this.state.appointmentRequests.map((appointmentRequest, i) =>
                                        (
                                            <List.Item
                                                // as={DraggableResource}
                                                key={appointmentRequest.requestId}
                                                onMouseEnter={this.hoverOnAppointmentRequest.bind(this, appointmentRequest)}
                                                onMouseLeave={this.hoverOffAppointmentRequest.bind(this, appointmentRequest)}
                                                // onDrop={this.onDropAppointmentRequest.bind(this, appointmentRequest)}
                                                onClick={() => this.props.history.push(`${this.props.match.path}/requests/${appointmentRequest.requestId}`, {
                                                    appointmentRequest: appointmentRequest
                                                })}
                                                draggable="true"
                                                onDragStart={this.onDragStartAppointmentRequest.bind(this, appointmentRequest) }
                                                onDragOver={this.onDragOverAppointmentRequest.bind(this, appointmentRequest) }
                                                onDrop={this.onDropAppointmentRequest.bind(this, appointmentRequest) }
                                                // onClickResource={() => this.props.history.push(`${this.props.match.path}/requests/${appointmentRequest.requestId}`, {
                                                //     appointmentRequest: appointmentRequest
                                                // })}
                                                // resource={appointmentRequest}
                                                // resourceRenderComponent={AppointmentRequestListRender}
                                                // cardHeader={appointmentRequest.clientName}
                                                // cardMeta={appointmentRequest.AppointmentDetail.role}
                                                // cardDescription={JSON.parse(appointmentRequest.AppointmentDetail.subject).join(", ")}
                                            >
                                                {/*<Image avatar src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />*/}
                                                {/* <List.Content>
                                                        <List.Header>{appointmentRequest.clientName}</List.Header>
                                                        <List.Description
                                                        as='a'>{appointmentRequest.AppointmentDetail.serviceProviderId}</List.Description>
                                                        <List.Description
                                                        as='a'>{appointmentRequest.AppointmentDetail.role}</List.Description>
                                                        <List.Description>{JSON.parse(appointmentRequest.AppointmentDetail.subject).join(", ")}</List.Description>
                                                        <List.Description>{appointmentRequest.notes}</List.Description>
                                                        <List.Description>
                                                        {Array.isArray(appointmentRequest.optionalTimes) &&
                                                        appointmentRequest.optionalTimes.map((datesTimes, j) =>
                                                            (
                                                                <List.Item key={j}>
                                                                    <List.Content>
                                                                        <List.Description>{moment(datesTimes.date).format('DD.MM.YYYY')}:</List.Description>
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
                                                    </List.Description>
                                                    </List.Content>*/}
                                                <List.Content
                                                    as={Card}
                                                    centered
                                                >
                                                    <Icon name='clipboard' />
                                                    <Card.Header>{appointmentRequest.clientName}</Card.Header>
                                                    {/*<Card.Meta>{this.props.cardMeta?this.props.cardMeta:null}</Card.Meta>*/}
                                                    <Card.Description>{JSON.parse(appointmentRequest.AppointmentDetail.subject).join(", ")}</Card.Description>
                                                    {/*<Icon name='clipboard' />*/}
                                                    {/*<ResourceRenderComponent resource={resource}/>*/}
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
                                        // tooltipAccessor={this.onHoverEvent.bind(this)}
                                        selectable
                                        onSelectEvent={this.onSelectEvent.bind(this)}
                                        onSelectSlot={this.onSelectSlot.bind(this)}
                                        popup
                                        // rtl
                                        // step={30}
                                        // timeslots={4}
                                        onEventDrop={this.moveEvent}
                                        draggableAccessor={event => true}
                                        resizable
                                        onEventResize={this.resizeEvent}
                                        view={this.state.calendarView}
                                        onView={(view) => this.setState({calendarView: view})}
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
                                        eventPropGetter={customEventPropGetter}
                                        components={{
                                            event: Event,
                                            agenda: {
                                                event: EventAgenda,
                                            },
                                        }}
                                        // min={am8}
                                        // max={pm8}
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