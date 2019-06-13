import React from 'react';
import './styles.css';

import moment from 'moment';
import {Button, Dropdown, Grid, Header, Icon, Input, Menu, Table} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import store from 'store';
import {Helmet} from 'react-helmet';
import times from 'lodash.times';
import _ from 'lodash';
import strings from "../../shared/strings";
import {Link, Route, Switch} from "react-router-dom";
import appointmentsStorage from "../../storage/appointmentsStorage";
import usersStorage from "../../storage/usersStorage";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants";
import mappers from "../../shared/mappers";
import helpers from "../../shared/helpers";
import ServiceProviderEdit from "../../components/serviceProvider/ServiceProviderEdit";
import AppointmentEdit from "../../components/appointment/AppointmentEdit";
import Datetime from 'react-datetime';
import {CSVLink} from "react-csv";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";


const TOTAL_PER_PAGE = 10;


class AppointmentsReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            page: 0,
            totalPages: 0,
            highlightTableRow: null,

            column: null,
            direction: null,
            filterColumnsAndTexts: {
                clientId: "",
                clientName: "",
                serviceProviderId: "",
                role: "",
                subject: "",
                status: "",
                date: "",
                startTime: "",
                endTime: "",
                remarks: "",
            },

            reportCSV: [],
        };

        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);

        this.serviceProviderHeaders = '';
        this.appointments = [];
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');

        this.getServiceProviderAppointments();

        connectToServerSocket(store.get('serviceProviderId'));

        WEB_SOCKET.on("getServiceProviderAppointments", this.getServiceProviderAppointments.bind(this));
    }

    componentWillUnmount() {
        WEB_SOCKET.off("getServiceProviderAppointments");
    }


    componentWillReceiveProps({location = {}}) {
        if (location.pathname === '/appointments/report' && location.pathname !== this.props.location.pathname) {
            this.setState({
                appointments: [],
                appointmentRequests: [],
            });
            this.getServiceProviderAppointments();
        }
    }

    getServiceProviderAppointments() {
        appointmentsStorage.getServiceProviderAppointments(this.serviceProviderId, this.serviceProviderHeaders)
            .then((response) => {
                if (response.response) {
                    if (response.response.status !== 200)
                        return;
                } else {
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
                                    if (user.response) {
                                        if (user.response.status !== 200)
                                            return;
                                    } else {
                                        appointment.clientName = user.fullname;

                                        let appointmentTableRecord = {
                                            appointmentId: appointment.appointmentId,
                                            clientId: appointment.AppointmentDetail.clientId,
                                            clientName: user.fullname,
                                            serviceProviderId: appointment.AppointmentDetail.serviceProviderId,
                                            role: strings.roles[appointment.AppointmentDetail.role],
                                            subject: JSON.parse(appointment.AppointmentDetail.subject).join(", "),
                                            status: mappers.appointmentStatusMapper(appointment.status),
                                            date: moment(appointment.startDateAndTime).format('DD/MM/YYYY'),
                                            startTime: moment(appointment.startDateAndTime).format('HH:mm'),
                                            endTime: moment(appointment.endDateAndTime).format('HH:mm'),
                                            remarks: appointment.remarks,
                                            appointmentResource: appointment,
                                        };

                                        let appointmentTableRecords = this.state.appointments;
                                        appointmentTableRecords.push(appointmentTableRecord);
                                        this.setState({
                                            appointments: appointmentTableRecords
                                        });

                                        this.appointments = appointmentTableRecords;
                                    }
                                });
                        });
                    this.appointments = appointments;

                    this.setState({
                        // appointments: appointments,
                        page: 0,
                        totalPages,
                    });
                }
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


    handleSort = clickedColumn => () => {
        const {column, appointments, direction} = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                appointments: _.sortBy(appointments, [clickedColumn]),
                direction: 'ascending',
            });

            return
        }

        this.setState({
            appointments: appointments.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    handleFilter = (clickedColumn, e) => {
        if (e === "") {
            let filterColumnsAndTexts = this.state.filterColumnsAndTexts;
            filterColumnsAndTexts[clickedColumn] = "";
            this.setState({
                filterColumnsAndTexts: filterColumnsAndTexts
            })
        } else if (clickedColumn === 'date') {
            let filterColumnsAndTexts = this.state.filterColumnsAndTexts;
            if (moment.isMoment(e)) {
                filterColumnsAndTexts[clickedColumn] = moment(e).format("DD/MM/YYYY");
                this.setState({
                    filterColumnsAndTexts: filterColumnsAndTexts,
                    monthFilterSelected: null,
                    dateFilterSelected: moment(e).format("DD/MM/YYYY"),
                })
            } else {
                filterColumnsAndTexts[clickedColumn] = e.value;
                this.setState({
                    filterColumnsAndTexts: filterColumnsAndTexts,
                    monthFilterSelected: e.text,
                    dateFilterSelected: "",
                })
            }
        } else if (clickedColumn.includes('Time')) {
            let filterColumnsAndTexts = this.state.filterColumnsAndTexts;
            filterColumnsAndTexts[clickedColumn] = moment(e).format("HH:mm");
            this.setState({
                filterColumnsAndTexts: filterColumnsAndTexts
            })
        } else if (e.target.value !== undefined) {
            let filterColumnsAndTexts = this.state.filterColumnsAndTexts;
            filterColumnsAndTexts[clickedColumn] = e.target.value;
            this.setState({
                filterColumnsAndTexts: filterColumnsAndTexts
            })
        }


        let filterColumnsAndTexts = _.omitBy(this.state.filterColumnsAndTexts, (att) => att === "");
        let appointments = _.filter(this.appointments,
            (o) =>
                Object.keys(filterColumnsAndTexts).every((col) => {
                    if (!filterColumnsAndTexts[col].length) {
                        return true;
                    }
                    if (col === 'date' && e.text && e.value)
                        return o[col].split("/")[1] === filterColumnsAndTexts[col];
                    else
                        return o[col].includes(filterColumnsAndTexts[col]);
                })
        );
        this.setState({
            appointments: appointments,
        });
    };

    pickUserAttributesForCSV = () => {
        return this.state.appointments.map(appointment => {
            return _.pick(appointment, ['clientId', "clientName", "role", "subject", "status", "date", "startTime", "endTime", "remarks"])
        });
    };

    getUsersForAppointmentForm = () => {
        let userOptions = {};

        usersStorage.getUsers(this.serviceProviderHeaders)
            .then(users => {
                if (users.response) {
                    if (users.response.status !== 200)
                        return;
                } else {
                    // console.log('users ', users);
                    if (Array.isArray(users))
                        userOptions = users.filter(u => u.active).map(item =>
                            ({
                                key: item.userId,
                                text: item.fullname,
                                value: item.fullname
                            })
                        );
                    this.setState({userOptions: userOptions})
                }
            });
    };

    getServiceProviderRoles = () => {
        let serviceProviderRoles = {};
        this.setState({serviceProviderRoles: {}});

        serviceProvidersStorage.getServiceProviderById(store.get("serviceProviderId"))
            .then(serviceProvidersFound => {
                if (serviceProvidersFound.response) {
                    if (serviceProvidersFound.response.status !== 200)
                        return;
                } else {
                    // console.log('serviceProvidersFound ', serviceProvidersFound);
                    if (Array.isArray(serviceProvidersFound)) {
                        serviceProviderRoles = serviceProvidersFound.filter(provider => provider.role.includes("appointments")).map((item) =>
                            item.role
                        );
                        this.setState({serviceProviderRoles: serviceProviderRoles})
                    }
                }
            });
    };

    render() {
        const {appointments, page, totalPages, column, direction} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;

        // console.log("AppointmentsReportPage appointments ", appointments);
        const reportCSVHeaders = [
            {label: strings.appointmentsPageStrings.CLIENT_ID, key: "clientId"},
            {label: strings.appointmentsPageStrings.CLIENT_NAME, key: "clientName"},
            {label: strings.appointmentsPageStrings.ROLE, key: "role"},
            {label: strings.appointmentsPageStrings.SUBJECT, key: "subject"},
            {label: strings.appointmentsPageStrings.STATUS, key: "status"},
            {label: strings.appointmentsPageStrings.DATE, key: "date"},
            {label: strings.appointmentsPageStrings.START_TIME, key: "startTime"},
            {label: strings.appointmentsPageStrings.END_TIME, key: "endTime"},
            {label: strings.appointmentsPageStrings.REMARKS, key: "remarks"},
        ];

        return (
            <div dir="rtl" className="k-rtl">
                <div>
                    <Helmet>
                        <title>Meshekle | Appointments Report</title>
                    </Helmet>
                    <Grid stretched padded id="divToPrint">
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
                        {/*<Link to='/appointments'>*/}
                        <Button positive icon onClick={() => this.props.history.goBack()}>
                            <Icon name="calendar alternate outline"/>
                            &nbsp;&nbsp;
                            {strings.mainPageStrings.BACK_TO_APPOINTMENTS_PAGE_TITLE}
                        </Button>
                        {/*</Link>*/}

                        <Button icon
                                onClick={() => helpers.exportToPDF('MeshekleAppointmentsReport', 'divToPrint', 'landscape')}>
                            <Icon name="file pdf outline"/>
                            &nbsp;&nbsp;
                            יצא לPDF
                        </Button>

                        <Button icon style={{width: 120}}>
                            <CSVLink style={{color: '#5a5a5a'}} data={this.state.reportCSV} headers={reportCSVHeaders}
                                     filename={"MeshekleAppointmentsReport.csv"}
                                     onClick={() => {
                                         this.setState({reportCSV: this.pickUserAttributesForCSV()});
                                     }}>
                                <Icon name="file excel outline"/>
                                &nbsp;&nbsp;
                                יצא לExcel
                            </CSVLink>
                        </Button>

                        <Grid.Row columns='equal'
                                  style={{
                                      minHeight: '210mm',
                                      width: '297mm',
                                      marginLeft: 'auto',
                                      marginRight: 'auto'
                                  }}
                        >
                            <Table celled striped textAlign='right' selectable sortable compact={"very"} collapsing
                            >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell></Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column === 'clientId' ? direction : null}
                                            onClick={this.handleSort('clientId')}
                                        >
                                            {strings.appointmentsPageStrings.CLIENT_ID}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column === 'clientName' ? direction : null}
                                            onClick={this.handleSort('clientName')}
                                        >
                                            {strings.appointmentsPageStrings.CLIENT_NAME}
                                        </Table.HeaderCell>
                                        {/*<Table.HeaderCell*/}
                                        {/*sorted={column === 'serviceProviderId' ? direction : null}*/}
                                        {/*onClick={this.handleSort('serviceProviderId')}*/}
                                        {/*>*/}
                                        {/*{strings.appointmentsPageStrings.SERVICE_PROVIDER_ID}*/}
                                        {/*</Table.HeaderCell>*/}
                                        <Table.HeaderCell
                                            sorted={column === 'role' ? direction : null}
                                            onClick={this.handleSort('role')}
                                        >
                                            {strings.appointmentsPageStrings.ROLE}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column === 'subject' ? direction : null}
                                            onClick={this.handleSort('subject')}
                                        >
                                            {strings.appointmentsPageStrings.SUBJECT}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column === 'status' ? direction : null}
                                            onClick={this.handleSort('status')}
                                        >
                                            {strings.appointmentsPageStrings.STATUS}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column === 'date' ? direction : null}
                                            onClick={this.handleSort('date')}
                                        >
                                            {strings.appointmentsPageStrings.DATE}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column === 'startTime' ? direction : null}
                                            onClick={this.handleSort('startTime')}
                                        >
                                            {strings.appointmentsPageStrings.START_TIME}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            sorted={column === 'endTime' ? direction : null}
                                            onClick={this.handleSort('endTime')}
                                        >
                                            {strings.appointmentsPageStrings.END_TIME}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            width={10}
                                            sorted={column === 'remarks' ? direction : null}
                                            onClick={this.handleSort('remarks')}
                                        >
                                            {strings.appointmentsPageStrings.REMARKS}
                                        </Table.HeaderCell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.HeaderCell></Table.HeaderCell>
                                        <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('clientId', e)}
                                            />
                                            <Input placeholder='סנן...' className={"filterInput"}
                                                   onChange={(e) => this.handleFilter('clientId', e)}
                                            />
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('clientName', e)}
                                            />
                                            <Input placeholder='סנן...' className={"filterInput"}
                                                   onChange={(e) => this.handleFilter('clientName', e)}
                                            />
                                        </Table.HeaderCell>
                                        {/* <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('serviceProviderId', e)}
                                            />
                                            <Input placeholder='סנן...' className={"filterInput"}
                                                   onChange={(e) => this.handleFilter('serviceProviderId', e)}
                                            />
                                        </Table.HeaderCell>*/}
                                        <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('role', e)}
                                            />
                                            <Input placeholder='סנן...' className={"filterInput"}
                                                   onChange={(e) => this.handleFilter('role', e)}
                                            />
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('subject', e)}
                                            />
                                            <Input placeholder='סנן...' className={"filterInput"}
                                                   onChange={(e) => this.handleFilter('subject', e)}
                                            />
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('status', e)}
                                            />
                                            <Input placeholder='סנן...' className={"filterInput"}
                                                   onChange={(e) => this.handleFilter('status', e)}
                                            />
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('date', e)}
                                            />
                                            <Icon link name='x'
                                                  onClick={(e) => {
                                                      let filterColumnsAndTexts = this.state.filterColumnsAndTexts;
                                                      filterColumnsAndTexts.date = "";
                                                      this.setState({
                                                          monthFilterSelected: null,
                                                          dateFilterSelected: "",
                                                          filterColumnsAndTexts: filterColumnsAndTexts,
                                                      });
                                                      this.handleFilter('', e);
                                                  }}
                                            />
                                            <Datetime
                                                inputProps={{style: {width: (100 + 'px')}}}
                                                locale={'he'}
                                                timeFormat={false}
                                                install
                                                onChange={(e) => this.handleFilter('date', e)}
                                                value={this.state.dateFilterSelected}
                                            />
                                            <Dropdown
                                                text={this.state.monthFilterSelected ? this.state.monthFilterSelected : 'חודש'}
                                                floating
                                                className={"filterInput"}
                                                labeled
                                                button
                                                multiple={false}
                                                fluid
                                            >
                                                <Dropdown.Menu>
                                                    {moment.months().map(month =>
                                                        <Dropdown.Item
                                                            // label={{empty: true, circular: true}}
                                                            text={month + " | " + moment().month(month).format("MM")}
                                                            onClick={(event, data) => this.handleFilter('date', data)}
                                                            value={moment().month(month).format("MM")}
                                                        />
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('startTime', e)}
                                            />
                                            <Datetime
                                                inputProps={{style: {width: (60 + 'px')}}}
                                                locale={'he'}
                                                dateFormat={false}
                                                install
                                                onChange={(e) => this.handleFilter('startTime', e)}
                                            />
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('endTime', e)}
                                            />
                                            <Datetime
                                                inputProps={{style: {width: (60 + 'px')}}}
                                                locale={'he'}
                                                dateFormat={false}
                                                install
                                                onChange={(e) => this.handleFilter('endTime', e)}
                                            />
                                        </Table.HeaderCell>
                                        <Table.HeaderCell width={10}>
                                            <Icon link name='filter'
                                                  onClick={(e) => this.handleFilter('remarks', e)}
                                            />
                                            <Input placeholder='סנן...' className={"filterInput"}
                                                   onChange={(e) => this.handleFilter('remarks', e)}
                                            />
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {appointments.slice(startIndex, startIndex + TOTAL_PER_PAGE).map((appointment, index) =>
                                        (<Table.Row key={appointment.appointmentId}
                                                    positive={this.state.highlightTableRow === appointment.appointmentId}>
                                            <Table.Cell>
                                                {index + 1}.
                                                <Icon link name='edit'
                                                      onClick={() => this.props.history.push(`${this.props.match.path}/${appointment.appointmentId}/edit`, {
                                                          appointment: appointment.appointmentResource,
                                                          openedFrom: "AppointmentsReportPage"
                                                      })}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>{appointment.clientId}</Table.Cell>
                                            <Table.Cell>{appointment.clientName}</Table.Cell>
                                            {/*<Table.Cell>{appointment.serviceProviderId}</Table.Cell>*/}
                                            <Table.Cell>{appointment.role}</Table.Cell>
                                            <Table.Cell>{appointment.subject}</Table.Cell>
                                            <Table.Cell>{appointment.status}</Table.Cell>
                                            <Table.Cell>{appointment.date}</Table.Cell>
                                            <Table.Cell>{appointment.startTime}</Table.Cell>
                                            <Table.Cell>{appointment.endTime}</Table.Cell>
                                            <Table.Cell>{appointment.remarks}</Table.Cell>
                                        </Table.Row>),
                                    )}
                                </Table.Body>
                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan={10}>
                                            <Menu floated="left" pagination>
                                                {page !== 0 &&
                                                <Menu.Item as="a" icon onClick={this.decrementPage}>
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
                        <Route exec path={`${this.props.match.path}/:appointmentId/edit`}
                               render={(props) => (
                                   <AppointmentEdit
                                       {...props}
                                       userOptions={this.state.userOptions}
                                       getUsersForAppointmentForm={this.getUsersForAppointmentForm}
                                       serviceProviderRoles={this.state.serviceProviderRoles}
                                       getServiceProviderRoles={this.getServiceProviderRoles}
                                   />
                               )}/>

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

