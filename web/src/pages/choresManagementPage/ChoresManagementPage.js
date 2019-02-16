import React from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Icon, Menu, Table} from 'semantic-ui-react';
import store from 'store';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import strings from "../../shared/strings";
import usersStorage from "../../storage/usersStorage";

const TOTAL_PER_PAGE = 10;

class ChoresManagementPage extends React.Component {
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
        if (location.pathname === '/phoneBook' && location.pathname !== this.props.location.pathname) {
            this.getUsers();
        }
    }

    getUsers() {
        usersStorage.getUsers()
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

    getUserByUserID(userId) {
        usersStorage.getUserByUserID(userId, this.serviceProviderHeaders)
            .then((response) => {
                let user = response.data[0];
                console.log('getUserByUserID ', userId, ' ', user);
                this.props.history.push(`/users/${userId}`);
            })
    }


    render() {
        const {users, page, totalPages} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;

        return (
            <Page children={users} title={strings.mainPageStrings.CHORES_PAGE_TITLE}>
                <Helmet>
                    <title>Meshekle | Users</title>
                </Helmet>

                <Table celled striped textAlign='right' selectable sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{strings.phoneBookPageStrings.FULLNAME_HEADER}</Table.HeaderCell>
                            <Table.HeaderCell>{strings.phoneBookPageStrings.PASSWORD_HEADER}</Table.HeaderCell>
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
                                <Table.Cell>
                                    <Header as='h4' image>
                                        {/*<Image src='/images/avatar/small/lena.png' rounded size='mini' />*/}
                                        <Header.Content as="a" onClick={this.getUserByUserID.bind(this, user.userId)}>
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
                                <Table.Cell>{user.active ? strings.phoneBookPageStrings.ACTIVE_ANSWER_YES : strings.phoneBookPageStrings.ACTIVE_ANSWER_NO}</Table.Cell>
                                {/*<Table.Cell>{user.image}</Table.Cell>*/}
                            </Table.Row>),
                        )}
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan={8}>
                                <Menu floated="left" pagination>
                                    {page !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                        <Icon name="right chevron"/>
                                    </Menu.Item>}
                                    {times(totalPages, n =>
                                        (<Menu.Item as="a" key={n} active={n === page} onClick={this.setPage(n)}>
                                            {n + 1}
                                        </Menu.Item>),
                                    )}
                                    {page !== (totalPages - 1) && <Menu.Item as="a" icon onClick={this.incrementPage}>
                                        <Icon name="left chevron"/>
                                    </Menu.Item>}
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <Button positive>{strings.phoneBookPageStrings.ADD_USER}</Button>
            </Page>
        );
    }
}

export {ChoresManagementPage}