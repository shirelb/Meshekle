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

const TOTAL_PER_PAGE = 10;

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
            }
        };

        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.serviceProviderHeaders = '';
        this.users = [];
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

                this.setState({
                    users: users,
                    pageUsers: 0,
                    totalPagesUsers,
                });

                this.users = users;
            });
    }

    loadServiceProviders() {
        serviceProvidersStorage.getServiceProviders()
            .then(serviceProviders => {

                // const serviceProviders = response.data;
                const totalPagesServiceProviders = Math.ceil(serviceProviders.length / TOTAL_PER_PAGE);

                this.setState({
                    serviceProviders: serviceProviders,
                    pageServiceProviders: 0,
                    totalPagesServiceProviders,
                });


                serviceProviders.forEach(provider => {
                    serviceProvidersStorage.getServiceProviderUserDetails(provider.serviceProviderId)
                        .then(userDetails => {
                            provider.fullname = userDetails.data.fullname;
                            provider.image = userDetails.data.image;
                            this.setState({
                                serviceProviders: serviceProviders
                            })
                        })
                })
            });
    }


    setPage(page) {
        return () => {
            this.setState({page});
        };
    }

    decrementPage() {
        const {pageUsers} = this.state;

        this.setState({pageUsers: pageUsers - 1});
    }

    incrementPage() {
        const {pageUsers} = this.state;

        this.setState({pageUsers: pageUsers + 1});
    }

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

    handleSort = clickedColumn => () => {
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
        })
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

    render() {
        // console.log('app props ', this.props);

        const {usersColumn, usersDirection, users, pageUsers, totalPagesUsers, serviceProviders, pageServiceProviders, totalPagesServiceProviders, activeIndex} = this.state;
        const startIndex = pageUsers * TOTAL_PER_PAGE;

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

                    <Table celled striped textAlign='right' selectable sortable compact={"very"} collapsing>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'userId' ? usersDirection : null}
                                    onClick={this.handleSort('userId')}
                                >
                                    {strings.phoneBookPageStrings.USER_ID_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'fullname' ? usersDirection : null}
                                    onClick={this.handleSort('fullname')}
                                >
                                    {strings.phoneBookPageStrings.FULLNAME_HEADER}
                                </Table.HeaderCell>
                                {/*<Table.HeaderCell
                                sorted={usersColumn === 'clientId' ? usersDirection : null}
                                            onClick={this.handleSort('clientId')}
                                            >
                                            {strings.phoneBookPageStrings.PASSWORD_HEADER}
                                            </Table.HeaderCell>*/}
                                <Table.HeaderCell
                                    sorted={usersColumn === 'email' ? usersDirection : null}
                                    onClick={this.handleSort('email')}
                                >
                                    {strings.phoneBookPageStrings.EMAIL_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'mailbox' ? usersDirection : null}
                                    onClick={this.handleSort('mailbox')}
                                >
                                    {strings.phoneBookPageStrings.MAILBOX_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'cellphone' ? usersDirection : null}
                                    onClick={this.handleSort('cellphone')}
                                >
                                    {strings.phoneBookPageStrings.CELLPHONE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'phone' ? usersDirection : null}
                                    onClick={this.handleSort('phone')}
                                >
                                    {strings.phoneBookPageStrings.PHONE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'bornDate' ? usersDirection : null}
                                    onClick={this.handleSort('bornDate')}
                                >
                                    {strings.phoneBookPageStrings.BORN_DATE_HEADER}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={usersColumn === 'active' ? usersDirection : null}
                                    onClick={this.handleSort('active')}
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
                            {users.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(user =>
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
                                        {pageUsers !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                            <Icon name="right chevron"/>
                                        </Menu.Item>}
                                        {times(totalPagesUsers, n =>
                                            (<Menu.Item as="a" key={n} active={n === pageUsers}
                                                        onClick={this.setPage(n)}>
                                                {n + 1}
                                            </Menu.Item>),
                                        )}
                                        {pageUsers !== (totalPagesUsers - 1) &&
                                        <Menu.Item as="a" icon onClick={this.incrementPage}>
                                            <Icon name="left chevron"/>
                                        </Menu.Item>}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <Link to={{pathname: `${this.props.match.url}/user/add`}}>
                        <Button positive>{strings.phoneBookPageStrings.ADD_USER}</Button>
                    </Link>
                </Page>

                <Page children={serviceProviders}
                      title={strings.mainPageStrings.PHONE_BOOK_PAGE_SERVICE_PROVIDERS_TITLE}
                      divId={'divServiceProvidersToPrint'}>
                    <Helmet>
                        <title>Meshekle | ServiceProviders</title>
                    </Helmet>

                    <Button icon
                            onClick={() => helpers.exportToPDF('MesheklePhoneBookServiceProviders', 'divServiceProvidersToPrint', 'landscape')}>
                        <Icon name="file pdf outline"/>
                        &nbsp;&nbsp;
                        יצא לPDF
                    </Button>

                    <Table celled striped textAlign='right' selectable sortable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.SERVICE_PROVIDER_ID_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.FULLNAME_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.SERVICE_PROVIDER_ROLE_HEADER}</Table.HeaderCell>
                                {/*<Table.HeaderCell>{strings.phoneBookPageStrings.SERVICE_PROVIDER_USER_ID_HEADER}</Table.HeaderCell>*/}
                                <Table.HeaderCell>{strings.phoneBookPageStrings.SERVICE_PROVIDER_OPERATION_TIME_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.PHONE_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.SERVICE_PROVIDER_APPOINTMENT_WAY_TYPE_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.ACTIVE_HEADER}</Table.HeaderCell>
                                {/*<Table.HeaderCell>Image</Table.HeaderCell>*/}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {serviceProviders.slice(startIndex, startIndex + TOTAL_PER_PAGE).map((serviceProvider, index) =>
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
                                                {/*<Header.Subheader>Human Resources</Header.Subheader>*/}
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
                                    {/*<Table.Cell>{serviceProvider.image}</Table.Cell>*/}
                                </Table.Row>),
                            )}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan={8}>
                                    <Menu floated="left" pagination>
                                        {pageServiceProviders !== 0 &&
                                        <Menu.Item as="a" icon onClick={this.decrementPage}>
                                            <Icon name="right chevron"/>
                                        </Menu.Item>}
                                        {times(totalPagesServiceProviders, n =>
                                            (<Menu.Item as="a" key={n} active={n === pageServiceProviders}
                                                        onClick={this.setPage(n)}>
                                                {n + 1}
                                            </Menu.Item>),
                                        )}
                                        {pageServiceProviders !== (totalPagesServiceProviders - 1) &&
                                        <Menu.Item as="a" icon onClick={this.incrementPage}>
                                            <Icon name="left chevron"/>
                                        </Menu.Item>}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <Link to={{pathname: `${this.props.match.url}/serviceProvider/add`, state: {users: users}}}>
                        <Button positive>{strings.phoneBookPageStrings.ADD_SERVICE_PROVIDER}</Button>
                    </Link>
                </Page>

                <div>
                    {/*<Router>*/}
                    <Switch>
                        <Route exec path={`${this.props.match.path}/user/add`}
                               component={UserAdd}/>
                        <Route exec path={`${this.props.match.path}/user/:userId`}
                               component={UserInfo}/>
                        <Route exec path={`${this.props.match.path}/user/:userId/edit`}
                               component={UserEdit}/>

                        <Route exec path={`${this.props.match.path}/serviceProvider/add`}
                               component={ServiceProviderAdd}/>
                        <Route exec path={`${this.props.match.path}/serviceProvider/:serviceProviderId`}
                               component={ServiceProviderInfo}/>
                        <Route exec path={`${this.props.match.path}/serviceProvider/:serviceProviderId/edit`}
                               component={ServiceProviderEdit}/>
                        {/*<Redirect to={`${this.props.match.path}`}/>*/}
                    </Switch>
                    {/*</Router>*/}
                </div>
            </div>
        );
    }
}

export {PhoneBookManagementPage}