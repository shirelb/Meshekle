import React from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Accordion, Button, Header, Icon, Menu, Table} from 'semantic-ui-react';
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
import AppointmentAdd from "../../components/appointment/AppointmentAdd";

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
        this.loadUsers();
        this.loadServiceProviders();
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

    render() {
        // console.log('app props ', this.props);

        const {users, pageUsers, totalPagesUsers, serviceProviders, pageServiceProviders, totalPagesServiceProviders, activeIndex} = this.state;
        const startIndex = pageUsers * TOTAL_PER_PAGE;

        return (
            <div>
                <Page children={users} title={strings.mainPageStrings.PHONE_BOOK_PAGE_USERS_TITLE}>
                    <Helmet>
                        <title>Meshekle | Phone Book</title>
                    </Helmet>

                    <Table celled striped textAlign='right' selectable sortable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.USER_ID_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.FULLNAME_HEADER}</Table.HeaderCell>
                                {/*<Table.HeaderCell>{strings.phoneBookPageStrings.PASSWORD_HEADER}</Table.HeaderCell>*/}
                                <Table.HeaderCell>{strings.phoneBookPageStrings.EMAIL_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.MAILBOX_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.CELLPHONE_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.PHONE_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.BORN_DATE_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.phoneBookPageStrings.ACTIVE_HEADER}</Table.HeaderCell>
                                {/*<Table.HeaderCell>Image</Table.HeaderCell>*/}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(user =>
                                (<Table.Row key={user.userId}>
                                    <Table.Cell>{user.userId}</Table.Cell>
                                    <Table.Cell>
                                        <Header as='h4' image>
                                            {/*<Image src='/images/avatar/small/lena.png' rounded size='mini' />*/}
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
                                    {/*<Table.Cell>{user.image}</Table.Cell>*/}
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
                      title={strings.mainPageStrings.PHONE_BOOK_PAGE_SERVICE_PROVIDERS_TITLE}>
                    <Helmet>
                        <title>Meshekle | ServiceProviders</title>
                    </Helmet>

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
                                            {/*<Image src='/images/avatar/small/lena.png' rounded size='mini' />*/}
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
                                    <Table.Cell>{serviceProvider.fullname}</Table.Cell>
                                    <Table.Cell>{mappers.rolesMapper(serviceProvider.role)}</Table.Cell>
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