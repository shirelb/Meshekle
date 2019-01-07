import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Button, Icon, Menu, Table,Header} from 'semantic-ui-react';
import axios from 'axios';
import store from 'store';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import {SERVER_URL} from "../shared/constants";

const TOTAL_PER_PAGE = 10;

class PhoneBookManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            page: 0,
            totalPages: 0,
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
        this.getUsers();
    }

    componentWillReceiveProps({location = {}}) {
        if (location.pathname === '/users' && location.pathname !== this.props.location.pathname) {
            this.getUsers();
        }
    }

    getUsers() {
        axios.get(`${SERVER_URL}/api/users`,
            {headers: this.serviceProviderHeaders}
        )
            .then((response) => {

                const users = response.data;
                const totalPages = Math.ceil(users.length / TOTAL_PER_PAGE);

                this.setState({
                    users: users,
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

    handleDelete(userId) {
        const {users} = this.state;

        this.setState({
            users: users.filter(u => u.id !== userId),
        });
    }


    render() {
        const {users, page, totalPages} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;

        return (
            <Page title="Users">
                <Helmet>
                    <title>CMS | Users</title>
                </Helmet>

                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Fullname</Table.HeaderCell>
                            <Table.HeaderCell>Password</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Mailbox</Table.HeaderCell>
                            <Table.HeaderCell>Cellphone</Table.HeaderCell>
                            <Table.HeaderCell>Phone</Table.HeaderCell>
                            <Table.HeaderCell>BornDate</Table.HeaderCell>
                            <Table.HeaderCell>Active</Table.HeaderCell>
                            {/*<Table.HeaderCell>Image</Table.HeaderCell>*/}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {users.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(user =>
                            (<Table.Row key={user.userId}>
                                <Table.Cell>
                                    <Header as='h4' image>
                                        {/*<Image src='/images/avatar/small/lena.png' rounded size='mini' />*/}
                                        <Header.Content>
                                            {user.fullname}
                                            {/*<Header.Subheader>Human Resources</Header.Subheader>*/}
                                        </Header.Content>
                                    </Header>
                                </Table.Cell>
                                {/*<Table.Cell>{user.fullname}</Table.Cell>*/}
                                <Table.Cell>{user.password}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{user.mailbox}</Table.Cell>
                                <Table.Cell>{user.cellphone}</Table.Cell>
                                <Table.Cell>{user.phone}</Table.Cell>
                                <Table.Cell>{new Date(user.bornDate).toISOString().split('T')[0]}</Table.Cell>
                                <Table.Cell>{user.active? 'yes':'no'}</Table.Cell>
                                {/*<Table.Cell>{user.image}</Table.Cell>*/}
                            </Table.Row>),
                        )}
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan={8}>
                                <Menu floated="right" pagination>
                                    {page !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                        <Icon name="left chevron"/>
                                    </Menu.Item>}
                                    {times(totalPages, n =>
                                        (<Menu.Item as="a" key={n} active={n === page} onClick={this.setPage(n)}>
                                            {n + 1}
                                        </Menu.Item>),
                                    )}
                                    {page !== (totalPages - 1) && <Menu.Item as="a" icon onClick={this.incrementPage}>
                                        <Icon name="right chevron"/>
                                    </Menu.Item>}
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <Button positive>New User</Button>
            </Page>
        );
    }
}

export {PhoneBookManagementPage}