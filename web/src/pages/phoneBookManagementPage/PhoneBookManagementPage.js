import React from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Accordion, Button, Checkbox, Dropdown, Header, Icon, Image, Input, Menu, Table} from 'semantic-ui-react';
import {Link, Route, Switch} from "react-router-dom";
import store from 'store';
import moment from 'moment';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import strings from "../../shared/strings";
import UserInfo from "../../components/user/UserInfo";
import UserAdd from "../../components/user/UserAdd";
import usersStorage from "../../storage/usersStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import UserEdit from "../../components/user/UserEdit";
import ServiceProviderAdd from "../../components/serviceProvider/ServiceProviderAdd";
import ServiceProviderInfo from "../../components/serviceProvider/ServiceProviderInfo";
import ServiceProviderEdit from "../../components/serviceProvider/ServiceProviderEdit";
import mappers from "../../shared/mappers";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants";
import _ from "lodash";
import Datetime from 'react-datetime';
import helpers from "../../shared/helpers";
import {CSVLink} from "react-csv";


const TOTAL_PER_PAGE = 40;

class PhoneBookManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            pageUsers: 0,
            totalPagesUsers: 0,
            serviceProviders: [],
            pageServiceProviders: 0,
            totalPagesServiceProviders: 0,

            activeIndex: -1,
            usersColumn: null,
            usersDirection: null,
            usersFilterColumnsAndTexts: {
                userId: "",
                fullname: "",
                email: "",
                mailbox: "",
                cellphone: "",
                phone: "",
                bornDate: "",
                active: "",
            },
            serviceProvidersColumn: null,
            serviceProvidersDirection: null,
            serviceProvidersFilterColumnsAndTexts: {
                serviceProviderId: "",
                fullname: "",
                role: "",
                operationTime: "",
                phone: "",
                appointmentWayType: "",
                active: "",
            },

            usersCSV: [],
            serviceProvidersCSV: [],
        };

        this.handleDelete = this.handleDelete.bind(this);

        this.serviceProviderHeaders = '';
        this.users = [];
        this.serviceProviders = [];
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
        this.loadUsers();
        this.loadServiceProviders();

        connectToServerSocket(store.get('serviceProviderId'));

        WEB_SOCKET.on("getUsers", this.loadUsers.bind(this));
        WEB_SOCKET.on("getServiceProviders", this.loadServiceProviders.bind(this));
    }

    componentWillUnmount() {
        WEB_SOCKET.off("getUsers");
        WEB_SOCKET.off("getServiceProviders");
    }

    componentWillReceiveProps({location = {}}) {
        if (location.pathname === '/phoneBook' && location.pathname !== this.props.location.pathname) {
            this.loadUsers();
            this.loadServiceProviders();
        }
    }

    loadUsers() {
        usersStorage.getUsers()
            .then((response) => {
                console.log('response ', response);
                const users = response;
                const totalPagesUsers = Math.ceil(users.length / TOTAL_PER_PAGE);

                this.serviceProviders.forEach(provider => {
                    users.forEach(user => {
                        if (user.userId === provider.userId) {
                            provider.fullname = user.fullname;
                            provider.image = user.image;
                        }
                    })
                });

                this.setState({
                    users: users,
                    pageUsers: 0,
                    totalPagesUsers,
                    serviceProviders: this.serviceProviders,
                });

                this.users = users;
            });
    }

    pickUserAttributesForCSV = () => {
        return this.state.users.map(user => {
            user.bornDate = user.bornDate.length > 10 ? moment(user.bornDate).format("DD/MM/YYYY") : user.bornDate;
            user.active = typeof user.active === 'boolean' ?
                user.active ?
                    strings.phoneBookPageStrings.ACTIVE_ANSWER_YES
                    : strings.phoneBookPageStrings.ACTIVE_ANSWER_NO
                : user.active;
            return _.pick(user, ['userId', 'fullname', 'email', 'mailbox', 'cellphone', 'phone', 'bornDate', 'active'])
        });
    };

    loadServiceProviders() {
        let users = this.users;
        serviceProvidersStorage.getServiceProviders()
            .then(serviceProviders => {
                // const serviceProviders = response.data;
                const totalPagesServiceProviders = Math.ceil(serviceProviders.length / TOTAL_PER_PAGE);

                serviceProviders.forEach(provider => {
                    users.forEach(user => {
                        if (user.userId === provider.userId) {
                            provider.fullname = user.fullname;
                            provider.image = user.image;
                        }
                    })
                });

                this.setState({
                    serviceProviders: serviceProviders,
                    pageServiceProviders: 0,
                    totalPagesServiceProviders,
                });

                this.serviceProviders = serviceProviders;
            })
    }

    pickServiceProviderAttributesForCSV = () => {
        let serviceProviders = JSON.parse(JSON.stringify(this.state.serviceProviders));
        return serviceProviders.map(provider => {
            provider.role = provider.role.length > 0 ?
                strings.roles[provider.role] === undefined ?
                    provider.role :
                    strings.roles[provider.role]
                : provider.role;
            provider.appointmentWayType = provider.appointmentWayType.length > 0 ?
                strings.appointmentsWayType[provider.appointmentWayType] === undefined ?
                    provider.appointmentWayType :
                    strings.appointmentsWayType[provider.appointmentWayType]
                : provider.appointmentWayType;
            provider.subjects = provider.subjects.length > 0 ?
                JSON.parse(provider.subjects).join("; ").toString()
                : provider.subjects;
            provider.operationTime = provider.operationTime.length > 0 ?
                provider.operationTime.replace(/,/g, ';')
                : provider.operationTime;
            provider.active = typeof provider.active === 'boolean' ?
                provider.active ?
                    strings.phoneBookPageStrings.ACTIVE_ANSWER_YES
                    : strings.phoneBookPageStrings.ACTIVE_ANSWER_NO
                : provider.active;
            return _.pick(provider, ['serviceProviderId', 'fullname', 'role', 'subjects', 'operationTime', 'phoneNumber', 'appointmentWayType', 'active'])
        });
    };


    setPageUsers = (page) => {
        return () => {
            this.setState({pageUsers: page});
        };
    };

    setPageServiceProviders = (page) => {
        return () => {
            this.setState({pageServiceProviders: page});
        };
    };


    decrementPageUsers = () => {
        const {pageUsers} = this.state;

        this.setState({pageUsers: pageUsers - 1});
    };

    decrementPageServiceProviders = () => {
        const {pageServiceProviders} = this.state;

        this.setState({pageServiceProviders: pageServiceProviders - 1});
    };

    incrementPageUsers = () => {
        const {pageUsers} = this.state;

        this.setState({pageUsers: pageUsers + 1});
    };

    incrementPageServiceProviders = () => {
        const {pageServiceProviders} = this.state;

        this.setState({pageServiceProviders: pageServiceProviders + 1});
    };

    handleDelete(userId) {
        const {users} = this.state;

        this.setState({
            users: users.filter(u => u.id !== userId),
        });
    }

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex})
    };

    getFullNameOfServiceProvider = (serviceProvider) => {
        if (this.state.users.length === 0)
            return;
        let serviceProviders = this.state.serviceProviders;
        let serviceProviderUpdate = serviceProviders.filter(provider => provider.serviceProviderId === serviceProvider.serviceProviderId)[0];
        serviceProviderUpdate.fullname = this.state.users.filter(user => user.userId === serviceProvider.userId)[0].fullname;
        this.setState({
            serviceProviders: serviceProviders
        })
    };

    handleUsersSort = clickedColumn => () => {
        const {usersColumn, users, usersDirection} = this.state;

        if (usersColumn !== clickedColumn) {
            this.setState({
                usersColumn: clickedColumn,
                users: _.sortBy(users, [clickedColumn]),
                usersDirection: 'ascending',
            });

            return
        }

        this.setState({
            users: users.reverse(),
            usersDirection: usersDirection === 'ascending' ? 'descending' : 'ascending',
        });
    };

    handleFilter = (clickedColumn, e) => {
        if (e === "") {
            let usersFilterColumnsAndTexts = this.state.usersFilterColumnsAndTexts;
            usersFilterColumnsAndTexts[clickedColumn] = "";
            this.setState({
                usersFilterColumnsAndTexts: usersFilterColumnsAndTexts
            })
        } else if (clickedColumn === 'bornDate') {
            let usersFilterColumnsAndTexts = this.state.usersFilterColumnsAndTexts;
            if (moment.isMoment(e)) {
                usersFilterColumnsAndTexts[clickedColumn] = moment(e).format("YYYY-MM-DD");
                this.setState({
                    usersFilterColumnsAndTexts: usersFilterColumnsAndTexts,
                    monthFilterSelected: null,
                    dateFilterSelected: moment(e).format("DD/MM/YYYY"),
                })
            } else {
                usersFilterColumnsAndTexts[clickedColumn] = e.value;
                this.setState({
                    usersFilterColumnsAndTexts: usersFilterColumnsAndTexts,
                    monthFilterSelected: e.text,
                    dateFilterSelected: "",
                })
            }
        } else if (clickedColumn === 'active') {
            let usersFilterColumnsAndTexts = this.state.usersFilterColumnsAndTexts;
            usersFilterColumnsAndTexts[clickedColumn] = e.checked;
            this.setState({
                activeSelected: e.checked,
                usersFilterColumnsAndTexts: usersFilterColumnsAndTexts,
            })
        } else if (e.target.value !== undefined) {
            let usersFilterColumnsAndTexts = this.state.usersFilterColumnsAndTexts;
            usersFilterColumnsAndTexts[clickedColumn] = e.target.value;
            this.setState({
                usersFilterColumnsAndTexts: usersFilterColumnsAndTexts
            })
        }

        let usersFilterColumnsAndTexts = _.omitBy(this.state.usersFilterColumnsAndTexts, (att) => att === "");
        let users = _.filter(this.users,
            (o) =>
                Object.keys(usersFilterColumnsAndTexts).every((col) => {
                    if (col === 'bornDate')
                        if (e.text && e.value)
                            return o[col].split("-")[1] === usersFilterColumnsAndTexts[col];
                        else
                            return o[col].split("T")[0].includes(usersFilterColumnsAndTexts[col]);
                    else if (_.isNumber(o[col]))
                        return o[col] === parseInt(usersFilterColumnsAndTexts[col]);
                    else if (_.isBoolean(o[col]))
                        return o[col].toString() === usersFilterColumnsAndTexts[col].toString();
                    else
                        return o[col].includes(usersFilterColumnsAndTexts[col]);
                })
        );
        this.setState({
            users: users,
        });
    };

    handleServiceProvidersSort = clickedColumn => () => {
        const {serviceProvidersColumn, serviceProviders, serviceProvidersDirection} = this.state;

        if (serviceProvidersColumn !== clickedColumn) {
            this.setState({
                serviceProvidersColumn: clickedColumn,
                serviceProviders: _.sortBy(serviceProviders, [clickedColumn]),
                serviceProvidersDirection: 'ascending',
            });

            return
        }

        this.setState({
            serviceProviders: serviceProviders.reverse(),
            serviceProvidersDirection: serviceProvidersDirection === 'ascending' ? 'descending' : 'ascending',
        });
    };

    handleServiceProviderFilter = (clickedColumn, e) => {
        if (e === "") {
            let serviceProvidersFilterColumnsAndTexts = this.state.serviceProvidersFilterColumnsAndTexts;
            serviceProvidersFilterColumnsAndTexts[clickedColumn] = "";
            this.setState({
                serviceProvidersFilterColumnsAndTexts: serviceProvidersFilterColumnsAndTexts
            })
        } else if (clickedColumn === 'operationTime') {
            let serviceProvidersFilterColumnsAndTexts = this.state.serviceProvidersFilterColumnsAndTexts;
            serviceProvidersFilterColumnsAndTexts[clickedColumn] = e.value;
            this.setState({
                serviceProvidersFilterColumnsAndTexts: serviceProvidersFilterColumnsAndTexts,
                dayFilterSelected: e.text,
            })
        } else if (clickedColumn === 'active') {
            let serviceProvidersFilterColumnsAndTexts = this.state.serviceProvidersFilterColumnsAndTexts;
            serviceProvidersFilterColumnsAndTexts[clickedColumn] = e.checked;
            this.setState({
                activeServiceProviderSelected: e.checked,
                serviceProvidersFilterColumnsAndTexts: serviceProvidersFilterColumnsAndTexts,
            })
        } else if (e.target.value !== undefined) {
            let serviceProvidersFilterColumnsAndTexts = this.state.serviceProvidersFilterColumnsAndTexts;
            serviceProvidersFilterColumnsAndTexts[clickedColumn] = e.target.value;
            this.setState({
                serviceProvidersFilterColumnsAndTexts: serviceProvidersFilterColumnsAndTexts
            })
        }

        let serviceProvidersFilterColumnsAndTexts = _.omitBy(this.state.serviceProvidersFilterColumnsAndTexts, (att) => att === "");
        let serviceProviders = _.filter(this.serviceProviders,
            (o) =>
                Object.keys(serviceProvidersFilterColumnsAndTexts).every((col) => {
                    if (col === 'operationTime') {
                        let found = false;
                        JSON.parse(o[col]).forEach(dayTime => {
                            if (dayTime.day === serviceProvidersFilterColumnsAndTexts[col])
                                found = true;
                        });
                        return found;
                    } else if (col === 'appointmentWayType') {
                        if (o[col] === null)
                            return false;
                        return strings.appointmentsWayType[o[col]] ? strings.appointmentsWayType[o[col]].includes(serviceProvidersFilterColumnsAndTexts[col]) : false;
                    } else if (col === 'role')
                        return strings.roles[o[col]].includes(serviceProvidersFilterColumnsAndTexts[col]);
                    else if (_.isBoolean(o[col]))
                        return o[col].toString() === serviceProvidersFilterColumnsAndTexts[col].toString();
                    else
                        return o[col].includes(serviceProvidersFilterColumnsAndTexts[col]);
                })
        );
        this.setState({
            serviceProviders: serviceProviders,
        });
    };

    render() {
        // console.log('dayyyyyy app props ', moment().day('שני').format("e"));

        const {usersColumn, usersDirection, users, pageUsers, totalPagesUsers, serviceProvidersColumn, serviceProvidersDirection, serviceProviders, pageServiceProviders, totalPagesServiceProviders, activeIndex} = this.state;
        const startIndexUsers = pageUsers * TOTAL_PER_PAGE;
        const startIndexServiceProvider = pageServiceProviders * TOTAL_PER_PAGE;
        const usersCSVHeaders = [
            {label: strings.phoneBookPageStrings.USER_ID_HEADER, key: "userId"},
            {label: strings.phoneBookPageStrings.FULLNAME_HEADER, key: "fullname"},
            {label: strings.phoneBookPageStrings.EMAIL_HEADER, key: "email"},
            {label: strings.phoneBookPageStrings.MAILBOX_HEADER, key: "mailbox"},
            {label: strings.phoneBookPageStrings.CELLPHONE_HEADER, key: "cellphone"},
            {label: strings.phoneBookPageStrings.PHONE_HEADER, key: "phone"},
            {label: strings.phoneBookPageStrings.BORN_DATE_HEADER, key: "bornDate"},
            {label: strings.phoneBookPageStrings.ACTIVE_HEADER, key: "active"},
        ];
        const serviceProvidersCSVHeaders = [
            {label: strings.phoneBookPageStrings.SERVICE_PROVIDER_ID_HEADER, key: "serviceProviderId"},
            {label: strings.phoneBookPageStrings.FULLNAME_HEADER, key: "fullname"},
            {label: strings.phoneBookPageStrings.SERVICE_PROVIDER_ROLE_HEADER, key: "role"},
            {label: strings.phoneBookPageStrings.SERVICE_PROVIDER_SUBJECTS_HEADER, key: "subjects"},
            {label: strings.phoneBookPageStrings.SERVICE_PROVIDER_OPERATION_TIME_HEADER, key: "operationTime"},
            {label: strings.phoneBookPageStrings.PHONE_HEADER, key: "phone"},
            {
                label: strings.phoneBookPageStrings.SERVICE_PROVIDER_APPOINTMENT_WAY_TYPE_HEADER,
                key: "appointmentWayType"
            },
            {label: strings.phoneBookPageStrings.ACTIVE_HEADER, key: "active"},
        ];

        return (
            <div>
                <Page children={users} title={strings.mainPageStrings.PHONE_BOOK_PAGE_USERS_TITLE}
                      divId={'divUsersToPrint'}>
                    <Helmet>
                        <title>Meshekle | Phone Book</title>
                    </Helmet>

                    <Button icon
                            onClick={() => helpers.exportToPDF('MesheklePhoneBookUsers', 'divUsersToPrint', 'landscape')}>
                        <Icon name="file pdf outline"/>
                        &nbsp;&nbsp;
                        יצא לPDF
                    </Button>

                    <Button icon style={{width: 120}}>
                        <CSVLink style={{color: '#5a5a5a'}} data={this.state.usersCSV} headers={usersCSVHeaders}
                                 filename={"MesheklePhoneBookUsers.csv"}
                                 onClick={() => {
                                     this.setState({usersCSV: this.pickUserAttributesForCSV()});
                                 }}>
                            <Icon name="file excel outline"/>
                            &nbsp;&nbsp;
                            יצא לExcel
                        </CSVLink>
                    </Button>


                    <Table celled striped textAlign='right' selectable sortable compact={"very"} collapsing>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'userId' ? usersDirection : null}
                                    onClick={this.handleUsersSort('userId')}
                                >
                                    {strings.phoneBookPageStrings.USER_ID_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'fullname' ? usersDirection : null}
                                    onClick={this.handleUsersSort('fullname')}
                                >
                                    {strings.phoneBookPageStrings.FULLNAME_HEADER}
                                </Table.HeaderCell>
                                {/*<Table.HeaderCell
                                sorted={usersColumn === 'clientId' ? usersDirection : null}
                                            onClick={this.handleUsersSort('clientId')}
                                            >
                                            {strings.phoneBookPageStrings.PASSWORD_HEADER}
                                            </Table.HeaderCell>*/}
                                <Table.HeaderCell
                                    sorted={usersColumn === 'email' ? usersDirection : null}
                                    onClick={this.handleUsersSort('email')}
                                >
                                    {strings.phoneBookPageStrings.EMAIL_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'mailbox' ? usersDirection : null}
                                    onClick={this.handleUsersSort('mailbox')}
                                >
                                    {strings.phoneBookPageStrings.MAILBOX_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'cellphone' ? usersDirection : null}
                                    onClick={this.handleUsersSort('cellphone')}
                                >
                                    {strings.phoneBookPageStrings.CELLPHONE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'phone' ? usersDirection : null}
                                    onClick={this.handleUsersSort('phone')}
                                >
                                    {strings.phoneBookPageStrings.PHONE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'bornDate' ? usersDirection : null}
                                    onClick={this.handleUsersSort('bornDate')}
                                >
                                    {strings.phoneBookPageStrings.BORN_DATE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'active' ? usersDirection : null}
                                    onClick={this.handleUsersSort('active')}
                                >
                                    {strings.phoneBookPageStrings.ACTIVE_HEADER}
                                </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('userId', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleFilter('userId', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('fullname', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleFilter('fullname', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('email', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleFilter('email', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('mailbox', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleFilter('mailbox', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('cellphone', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleFilter('cellphone', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('phone', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleFilter('phone', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('bornDate', e)}
                                    />
                                    <Icon link name='x'
                                          onClick={(e) => {
                                              let usersFilterColumnsAndTexts = this.state.usersFilterColumnsAndTexts;
                                              usersFilterColumnsAndTexts.bornDate = "";
                                              this.setState({
                                                  monthFilterSelected: null,
                                                  dateFilterSelected: "",
                                                  usersFilterColumnsAndTexts: usersFilterColumnsAndTexts,
                                              });
                                              this.handleFilter('', e);
                                          }}
                                    />
                                    <Datetime
                                        inputProps={{style: {width: (100 + 'px')}}}
                                        locale={'he'}
                                        timeFormat={false}
                                        install
                                        onChange={(e) => this.handleFilter('bornDate', e)}
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
                                                    onClick={(event, data) => this.handleFilter('bornDate', data)}
                                                    value={moment().month(month).format("MM")}
                                                />
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('active', e)}
                                    />
                                    <Icon link name='x'
                                          onClick={(e) => {
                                              let usersFilterColumnsAndTexts = this.state.usersFilterColumnsAndTexts;
                                              usersFilterColumnsAndTexts.active = "";
                                              this.setState({
                                                  activeSelected: false,
                                                  usersFilterColumnsAndTexts: usersFilterColumnsAndTexts,
                                              });
                                              this.handleFilter('', e);
                                          }}
                                    />
                                    <Checkbox
                                        name="active"
                                        toggle
                                        checked={this.state.activeSelected}
                                        onChange={(event, data) => this.handleFilter('active', data)}
                                    />
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.slice(startIndexUsers, startIndexUsers + TOTAL_PER_PAGE).map(user =>
                                (<Table.Row key={user.userId}>
                                    <Table.Cell>{user.userId}</Table.Cell>
                                    <Table.Cell>
                                        <Header as='h4' image>
                                            <Image
                                                src={user.image}
                                                rounded size='mini'
                                            />
                                            <Header.Content>
                                                <Link to={{
                                                    pathname: `${this.props.match.url}/user/${user.userId}`,
                                                    state: {user: user}
                                                }}>
                                                    {user.fullname}
                                                </Link>
                                                {/*<Header.Subheader>Human Resources</Header.Subheader>*/}
                                            </Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    {/*<Table.Cell>{user.password}</Table.Cell>*/}
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.mailbox}</Table.Cell>
                                    <Table.Cell>{user.cellphone}</Table.Cell>
                                    <Table.Cell>{user.phone}</Table.Cell>
                                    <Table.Cell>{moment(user.bornDate).format("DD/MM/YYYY")}</Table.Cell>
                                    <Table.Cell>{user.active ? strings.phoneBookPageStrings.ACTIVE_ANSWER_YES : strings.phoneBookPageStrings.ACTIVE_ANSWER_NO}</Table.Cell>
                                </Table.Row>),
                            )}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan={8}>
                                    <Menu floated="left" pagination>
                                        {pageUsers !== 0 &&
                                        <Menu.Item as="a" icon onClick={this.decrementPageUsers}>
                                            <Icon name="right chevron"/>
                                        </Menu.Item>}
                                        {times(totalPagesUsers, n =>
                                            (<Menu.Item as="a" key={n} active={n === pageUsers}
                                                        onClick={this.setPageUsers(n)}>
                                                {n + 1}
                                            </Menu.Item>),
                                        )}
                                        {pageUsers !== (totalPagesUsers - 1) &&
                                        <Menu.Item as="a" icon onClick={this.incrementPageUsers}>
                                            <Icon name="left chevron"/>
                                        </Menu.Item>}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    {this.props.hasPhoneBookPermissions ?
                        <Link to={{pathname: `${this.props.match.url}/user/add`}}>
                            <Button positive>{strings.phoneBookPageStrings.ADD_USER}</Button>
                        </Link>
                        : null
                    }
                </Page>

                <Page children={serviceProviders}
                      title={strings.mainPageStrings.PHONE_BOOK_PAGE_SERVICE_PROVIDERS_TITLE}
                      divId={'divServiceProvidersToPrint'}>

                    <Button icon
                            onClick={() => helpers.exportToPDF('MesheklePhoneBookServiceProviders', 'divServiceProvidersToPrint', 'landscape')}>
                        <Icon name="file pdf outline"/>
                        &nbsp;&nbsp;
                        יצא לPDF
                    </Button>

                    <Button icon style={{width: 120}}>
                        <CSVLink style={{color: '#5a5a5a'}} data={this.state.serviceProvidersCSV}
                                 headers={serviceProvidersCSVHeaders}
                                 filename={"MesheklePhoneBookServiceProviders.csv"}
                                 onClick={() => {
                                     this.setState({serviceProvidersCSV: this.pickServiceProviderAttributesForCSV()});
                                 }}>
                            <Icon name="file excel outline"/>
                            &nbsp;&nbsp;
                            יצא לExcel
                        </CSVLink>
                    </Button>


                    <Table celled striped textAlign='right' selectable sortable compact={"very"}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={serviceProvidersColumn === 'serviceProviderId' ? serviceProvidersDirection : null}
                                    onClick={this.handleServiceProvidersSort('serviceProviderId')}
                                >
                                    {strings.phoneBookPageStrings.SERVICE_PROVIDER_ID_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={serviceProvidersColumn === 'fullname' ? serviceProvidersDirection : null}
                                    onClick={this.handleServiceProvidersSort('fullname')}
                                >
                                    {strings.phoneBookPageStrings.FULLNAME_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={serviceProvidersColumn === 'role' ? serviceProvidersDirection : null}
                                    onClick={this.handleServiceProvidersSort('role')}
                                >
                                    {strings.phoneBookPageStrings.SERVICE_PROVIDER_ROLE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={serviceProvidersColumn === 'subjects' ? serviceProvidersDirection : null}
                                    onClick={this.handleServiceProvidersSort('subjects')}
                                >
                                    {strings.phoneBookPageStrings.SERVICE_PROVIDER_SUBJECTS_HEADER}
                                </Table.HeaderCell>
                                {/*<Table.HeaderCell
                                sorted=serviceProviderssColumn === 'userId' ?serviceProviderssDirection : null}
                                    onClick={this.handlServiceProviderssSort('userId')}
                                >
                                {strings.phoneBookPageStrings.SERVICE_PROVIDER_USER_ID_HEADER}</
                                Table.HeaderCell>*/}
                                <Table.HeaderCell
                                    sorted={serviceProvidersColumn === 'operationTime' ? serviceProvidersDirection : null}
                                    onClick={this.handleServiceProvidersSort('operationTime')}
                                >
                                    {strings.phoneBookPageStrings.SERVICE_PROVIDER_OPERATION_TIME_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={serviceProvidersColumn === 'phoneNumber' ? serviceProvidersDirection : null}
                                    onClick={this.handleServiceProvidersSort('phoneNumber')}
                                >
                                    {strings.phoneBookPageStrings.PHONE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={serviceProvidersColumn === 'appointmentWayType' ? serviceProvidersDirection : null}
                                    onClick={this.handleServiceProvidersSort('appointmentWayType')}
                                >
                                    {strings.phoneBookPageStrings.SERVICE_PROVIDER_APPOINTMENT_WAY_TYPE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={serviceProvidersColumn === 'active' ? serviceProvidersDirection : null}
                                    onClick={this.handleServiceProvidersSort('active')}
                                >
                                    {strings.phoneBookPageStrings.ACTIVE_HEADER}
                                </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleServiceProviderFilter('serviceProviderId', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleServiceProviderFilter('serviceProviderId', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleServiceProviderFilter('fullname', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleServiceProviderFilter('fullname', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleServiceProviderFilter('role', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleServiceProviderFilter('role', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleServiceProviderFilter('subjects', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleServiceProviderFilter('subjects', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleServiceProviderFilter('operationTime', e)}
                                    />
                                    <Icon link name='x'
                                          onClick={(e) => {
                                              let serviceProvidersFilterColumnsAndTexts = this.state.serviceProvidersFilterColumnsAndTexts;
                                              serviceProvidersFilterColumnsAndTexts.operationTime = "";
                                              this.setState({
                                                  dayFilterSelected: "",
                                                  serviceProvidersFilterColumnsAndTexts: serviceProvidersFilterColumnsAndTexts,
                                              });
                                              this.handleServiceProviderFilter('', e);
                                          }}
                                    />
                                    <Dropdown
                                        text={this.state.dayFilterSelected ? this.state.dayFilterSelected : 'יום'}
                                        floating
                                        className={"filterInput"}
                                        labeled
                                        button
                                        multiple={false}
                                        fluid
                                    >
                                        <Dropdown.Menu>
                                            {moment.weekdays().map(day =>
                                                <Dropdown.Item
                                                    // label={{empty: true, circular: true}}
                                                    text={day}
                                                    onClick={(event, data) => this.handleServiceProviderFilter('operationTime', data)}
                                                    value={moment.localeData('en').weekdays()[moment().day(day).format("e")]}
                                                />
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleServiceProviderFilter('phoneNumber', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleServiceProviderFilter('phoneNumber', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleServiceProviderFilter('appointmentWayType', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleServiceProviderFilter('appointmentWayType', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleServiceProviderFilter('active', e)}
                                    />
                                    <Icon link name='x'
                                          onClick={(e) => {
                                              let serviceProvidersFilterColumnsAndTexts = this.state.serviceProvidersFilterColumnsAndTexts;
                                              serviceProvidersFilterColumnsAndTexts.active = "";
                                              this.setState({
                                                  activeServiceProviderSelected: false,
                                                  serviceProvidersFilterColumnsAndTexts: serviceProvidersFilterColumnsAndTexts,
                                              });
                                              this.handleServiceProviderFilter('', e);
                                          }}
                                    />
                                    <Checkbox
                                        name="active"
                                        toggle
                                        checked={this.state.activeServiceProviderSelected}
                                        onChange={(event, data) => this.handleServiceProviderFilter('active', data)}
                                    />
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {serviceProviders.slice(startIndexServiceProvider, startIndexServiceProvider + TOTAL_PER_PAGE).map((serviceProvider, index) =>
                                (<Table.Row key={index}>
                                    <Table.Cell>
                                        <Header as='h4' image>
                                            <Header.Content>
                                                <Link to={{
                                                    pathname: `${this.props.match.url}/serviceProvider/${serviceProvider.serviceProviderId}`,
                                                    state: {serviceProvider: serviceProvider, users: {users}}
                                                }}>
                                                    {serviceProvider.serviceProviderId}
                                                </Link>
                                            </Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Header as='h5' image>
                                            <Image
                                                src={serviceProvider.image}
                                                rounded size='mini'
                                            />
                                            <Header.Content>
                                                {serviceProvider.fullname}
                                            </Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>{strings.roles[serviceProvider.role]}</Table.Cell>
                                    <Table.Cell>{serviceProvider.subjects.length === 0 ? serviceProvider.subjects : JSON.parse(serviceProvider.subjects).join(", ")}</Table.Cell>
                                    {/*<Table.Cell>{serviceProvider.userId}</Table.Cell>*/}
                                    <Table.Cell>
                                        {
                                            JSON.parse(serviceProvider.operationTime).map((dayTime, index) => {
                                                return <Accordion key={index}>
                                                    <Accordion.Title
                                                        active={activeIndex === (serviceProvider.serviceProviderId + "-" + index)}
                                                        index={serviceProvider.serviceProviderId + "-" + index}
                                                        onClick={this.handleClick}>
                                                        <Icon name='dropdown'/>
                                                        {mappers.daysMapper(dayTime.day)}
                                                    </Accordion.Title>
                                                    {
                                                        dayTime.hours.map((hour, j) => {
                                                            return <Accordion.Content
                                                                active={activeIndex === (serviceProvider.serviceProviderId + "-" + index)}
                                                                key={j}>
                                                                {hour.startHour} - {hour.endHour}
                                                            </Accordion.Content>
                                                        })
                                                    }
                                                </Accordion>
                                            })
                                        }
                                    </Table.Cell>
                                    <Table.Cell>{serviceProvider.phoneNumber}</Table.Cell>
                                    <Table.Cell>{strings.appointmentsWayType[serviceProvider.appointmentWayType]}</Table.Cell>
                                    <Table.Cell>{serviceProvider.active ? strings.phoneBookPageStrings.ACTIVE_ANSWER_YES : strings.phoneBookPageStrings.ACTIVE_ANSWER_NO}</Table.Cell>
                                </Table.Row>),
                            )}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan={9}>
                                    <Menu floated="left" pagination>
                                        {pageServiceProviders !== 0 &&
                                        <Menu.Item as="a" icon onClick={this.decrementPageServiceProviders}>
                                            <Icon name="right chevron"/>
                                        </Menu.Item>}
                                        {times(totalPagesServiceProviders, n =>
                                            (<Menu.Item as="a" key={n} active={n === pageServiceProviders}
                                                        onClick={this.setPageServiceProviders(n)}>
                                                {n + 1}
                                            </Menu.Item>),
                                        )}
                                        {pageServiceProviders !== (totalPagesServiceProviders - 1) &&
                                        <Menu.Item as="a" icon onClick={this.incrementPageServiceProviders}>
                                            <Icon name="left chevron"/>
                                        </Menu.Item>}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    {this.props.hasPhoneBookPermissions ?
                        <Link to={{pathname: `${this.props.match.url}/serviceProvider/add`, state: {users: users}}}>
                            <Button positive>{strings.phoneBookPageStrings.ADD_SERVICE_PROVIDER}</Button>
                        </Link>
                        : null
                    }
                </Page>

                <div>
                    <Switch>
                        <Route exec path={`${this.props.match.path}/user/add`}
                               component={UserAdd}/>
                        <Route exec path={`${this.props.match.path}/user/:userId`}
                               render={props => <UserInfo {...props}
                                                          hasPhoneBookPermissions={this.props.hasPhoneBookPermissions}/>}/>
                        <Route exec path={`${this.props.match.path}/user/:userId/edit`}
                               component={UserEdit}/>

                        <Route exec path={`${this.props.match.path}/serviceProvider/add`}
                               component={ServiceProviderAdd}/>
                        <Route exec path={`${this.props.match.path}/serviceProvider/:serviceProviderId`}
                               render={props => <ServiceProviderInfo {...props}
                                                                     hasPhoneBookPermissions={this.props.hasPhoneBookPermissions}/>}/>
                        <Route exec path={`${this.props.match.path}/serviceProvider/:serviceProviderId/edit`}
                               component={ServiceProviderEdit}/>
                        {/*<Redirect to={`${this.props.match.path}`}/>*/}
                    </Switch>
                </div>
            </div>
        );
    }
}

export {
    PhoneBookManagementPage
}