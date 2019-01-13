import React from 'react';
import './styles.css';
import 'semantic-ui-css/semantic.min.css';
import {Button, Icon, Menu, Modal, Table} from 'semantic-ui-react';
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
import UserInfo from "../../components/UserInfo";
import AppointmentInfo from "../../components/AppointmentInfo";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import UserAdd from "../../components/UserAdd";
import AppointmentAdd from "../../components/AppointmentAdd";


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
            eventModal: null,
            highlightTableRow: null,
            open: false,
            openSetNewAppointment:false,
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

    show = (dimmer,openModel) => this.setState({dimmer, openModel: true});
    close = (openModel) => this.setState({openModel: false});

    componentWillReceiveProps({location = {}}) {
        if (location.pathname === '/appointments' && location.pathname !== this.props.location.pathname) {
            this.getServiceProviderAppointments();
        }
    }

    getServiceProviderAppointments() {
        axios.get(`${SERVER_URL}/api/serviceProviders/appointments/serviceProviderId/${this.serviceProviderId}`,
            {headers: this.serviceProviderHeaders}
        )
            .then((response) => {
                const appointments = response.data;
                const totalPages = Math.ceil(appointments.length / TOTAL_PER_PAGE);
                console.log('appointments ', appointments);

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
        this.state.appointments.forEach((appointment) => {
            helpers.getUserByUserID(appointment.AppointmentDetail.clientId, this.serviceProviderHeaders)
                .then(user => {
                    console.log('createEvents user ', user);
                    calendarEvents.push({
                        title: user.fullname,
                        subject: appointment.AppointmentDetail.subject,
                        start: appointment.startDateAndTime,
                        end: appointment.endDateAndTime,
                        allDay: false,
                        resource: appointment
                    })
                })
        });
        this.setState({calendarEvents: calendarEvents});
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

    getUserByUserID(userId) {
        axios.get(`${SERVER_URL}/api/users/userId/${userId}`,
            {headers: this.serviceProviderHeaders}
        )
            .then((response) => {
                let user = response.data[0];
                console.log('getUserByUserID ', userId, ' ', user);
                this.props.history.push(`/users/${userId}`);
            })
            .catch((error) => {
                console.log('getUserByUserID ', userId, ' ', error);
            });
    }

    onSelectEvent = event => {
        if (event.resource.appointmentId === this.state.highlightTableRow)
            this.setState({highlightTableRow: null});
        else
            this.setState({highlightTableRow: event.resource.appointmentId});

        // this.setState({openPopup: true, eventPopup: event});
        // console.log('onSelectEvent before state ', this.state);
        // this.show('blurring');
        // this.setState({eventModal: event});
        console.log('onSelectEvent=event  ', event);
        // console.log('onSelectEvent after state ', this.state);
        this.props.history.push(`${this.props.match.path}/${event.resource.appointmentId}`, {
            event: event,
            appointment: event.resource
        });

        // alert(event);
    };

    onSelectSlot = slotInfo => {
        console.log('onSelectSlot = slotInfo  ', slotInfo);

        this.props.history.push(`${this.props.match.path}/set`, {
            slotInfo: slotInfo
        });

       /* action: "click"
        end: Tue Jan 15 2019 00:00:00 GMT+0200 (Israel Standard Time) {}
        slots: [Tue Jan 15 2019 00:00:00 GMT+0200 (Israel Standard Time)]
        start: Tue Jan 15 2019 00:00:00 GMT+0200 (Israel Standard Time) {}

        slotInfo: {
            start: Date,
                end: Date,
                slots: Array<Date>,
                action: "select" | "click" | "doubleClick",
                bounds: ?{ // For "select" action
                x: number,
                y: number,
                top: number,
                right: number,
                left: number,
                bottom: number,
            },
                box: ?{ // For "click" or "doubleClick" actions
                clientX: number,
                clientY: number,
                x: number,
                y: number,
            },
        }*/
    };

    render() {
        const {appointments, page, totalPages} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;

        // moment.locale("he", {
        //     week: {
        //         dow: 1 //Monday is the first day of the week.
        //     }
        // });
        moment.locale('he');
        // BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
        const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
        const {calendarEvents} = this.state;

        const {open, dimmer, openSetNewAppointment} = this.state;

        return (
            /*<BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
            />*/
            <div>
                <Page children={appointments} title={strings.mainPageStrings.APPOINTMENTS_PAGE_TITLE} columns={1}>
                    <Helmet>
                        <title>Meshekle | Users</title>
                    </Helmet>

                    <BigCalendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        selectable
                        onSelectEvent={this.onSelectEvent.bind(this)}
                        onSelectSlot={this.onSelectSlot.bind(this)}
                        popup
                        rtl
                        messages={{
                            next: "הבא",
                            previous: "הקודם",
                            today: "היום",
                            month: 'חודשי',
                            week: 'שבועי',
                            day: 'יומי',
                            agenda: 'יומן'
                        }}
                    />


                    {/*{this.state.openPopup &&
                <Popup
                    key={this.state.eventPopup.title}
                    trigger={this.state.openPopup}
                    header={this.state.eventPopup.title}
                    content={this.state.eventPopup}
                    hideOnScroll
                />}*/}

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