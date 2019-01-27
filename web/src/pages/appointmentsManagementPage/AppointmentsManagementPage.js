import React from 'react';
import './styles.css';
import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Icon, Menu, Table} from 'semantic-ui-react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/he';
import axios from 'axios';
import store from 'store';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import {SERVER_URL} from "../../shared/constants";
import strings from "../../shared/strings";
import helpers from "../../shared/helpers";
import AppointmentInfo from "../../components/AppointmentInfo";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import AppointmentAdd from "../../components/AppointmentAdd";
import {Grid} from "semantic-ui-react/dist/commonjs/collections/Grid";


const TOTAL_PER_PAGE = 10;

class AppointmentsManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appointments: [],
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

        this.serviceProviderHeaders = '';
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
        this.getServiceProviderAppointments();
    }

    show = (dimmer, openModel) => this.setState({dimmer, openModel: true});
    close = (openModel) => this.setState({openModel: false});

    componentWillReceiveProps({location = {}}) {
        console.log("componentWillReceiveProps !!!!!!!");
        if (location.pathname === '/appointments' && location.pathname !== this.props.location.pathname) {
            this.getServiceProviderAppointments();
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
                            appointment.id = appointment.appointmentId;
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

                this.createEvents();
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
            // event: event,
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

    render() {
        const {t} = this.props;
        const {appointments, page, totalPages} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;

        // moment.locale("he", {
        //     week: {
        //         dow: 1 //Monday is the first day of the week.
        //     }
        // });
        moment.locale('he');
        const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
        const {calendarEvents} = this.state;

        const {open, dimmer, openSetNewAppointment, openPopup, eventPopup} = this.state;

        return (
            /*<BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
            />*/
            <div>
                {/*<Page children={appointments} title={strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE} columns={1}>*/}
                <div>
                    <Grid columns={3} padded>
                        <Grid.Row>
                            {title && <Header as="h1" floated="right">{title}</Header>}
                        </Grid.Row>
                        <Grid.Column>
                            {children}
                        </Grid.Column>
                        <Grid.Column>
                            {children}
                        </Grid.Column>
                        <Grid.Column>
                            {children}
                        </Grid.Column>
                    </Grid>
                </div>
                    <Helmet>
                        <title>Meshekle | Appointments</title>
                    </Helmet>

                    <BigCalendar
                        localizer={localizer}
                        events={appointments}
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


                    <Table celled striped textAlign='right' selectable sortable>
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
                </Page>


                <div>
                    <Switch>
                        <Route exec path={`${this.props.match.path}/set`}
                               component={AppointmentAdd}/>
                        <Route exec path={`${this.props.match.path}/requests/:appointmentRequestId`}
                               component={AppointmentInfo}/>
                        <Route exec path={`${this.props.match.path}/:appointmentId`}
                               component={AppointmentInfo}/>
                        <Redirect to={`${this.props.match.path}`}/>
                    </Switch>
                </div>
            </div>
            // </Grid>*/
        );
    }
}

export {AppointmentsManagementPage}