import React from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Icon, Menu, Table} from 'semantic-ui-react';
import {Link, Redirect, Route, Switch} from "react-router-dom";
import store from 'store';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import strings from "../../shared/strings";

import AnnouncementAdd from "../../components/announcement/AnnouncementAdd";
import announcementsStorage from "../../storage/announcementsStorage";
import AppointmentAdd from "../appointmentsManagementPage/AppointmentsManagementPage";

const TOTAL_PER_PAGE = 10;

class AnnouncementsManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            announcementsRequests: [],
            pageAnnouncementsRequests: 0,
            totalPagesAnnouncementsRequests: 0,
            announcements: [],
            pageAnnouncements: 0,
            totalPagesAnnouncements: 0,

           };

        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);
        //this.handleDelete = this.handleDelete.bind(this);

        this.serviceProviderHeaders = '';

    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');

        this.getAnnouncementsRequests();
        this.getAnnouncements();
    }

    componentWillReceiveProps({location = {}}) {
        if (location.pathname === '/chores' && location.pathname !== this.props.location.pathname) {
            this.getAnnouncementsRequests();
            this.getAnnouncements();
        }
    }


    getAnnouncementsRequests() {
        announcementsStorage.getAnnouncementsRequests(this.serviceProviderId,this.serviceProviderHeaders)
            .then((response) => {
                console.log('response ', response);
                const announcementsReq = response.data;
                const totalPagesAnnouncementsRequests = Math.ceil(announcementsReq.length / TOTAL_PER_PAGE);

                this.setState({
                    announcementsRequests: announcementsReq,
                    pageAnnouncementsRequests: 0,
                    totalPagesAnnouncementsRequests: totalPagesAnnouncementsRequests,
                });
            });
    }

    getAnnouncements() {
        announcementsStorage.getAnnouncements(this.serviceProviderId,this.serviceProviderHeaders)
            .then((response) => {

                const announcements = response.data;
                const totalPagesAnnouncements = Math.ceil(announcements.length / TOTAL_PER_PAGE);

                this.setState({
                    announcements: announcements,
                    pageAnnouncements: 0,
                    totalPagesAnnouncements,
                });
            });
    }

    setPage(page) {
        return () => {
            this.setState({page});
        };
    }

    decrementPage() {
        const {pageAnnouncementsRequests} = this.state;

        this.setState({pageAnnouncementsRequests: pageAnnouncementsRequests - 1});
    }

    incrementPage() {
        const {pageAnnouncementsRequests} = this.state;

        this.setState({pageAnnouncementsRequests: pageAnnouncementsRequests + 1});
    }

    // handleDelete(userId) {
    //     const {users} = this.state;
    //
    //     this.setState({
    //         users: users.filter(u => u.id !== userId),
    //     });
    // }


    onClick = () => {

        this.props.history.push(`${this.props.match.path}/addAnnouncement`, {
            serviceProviderId: this.serviceProviderId,
            userId: this.userId
        });
    };



    render() {
        console.log('app props ', this.props);

        const {announcementsRequests, pageAnnouncementsRequests, totalPagesAnnouncementsRequests, announcements, pageAnnouncements, totalPagesAnnouncements} = this.state;
        const startIndex = pageAnnouncementsRequests * TOTAL_PER_PAGE;

        return (
            <div>
                <Page children={announcementsRequests} title={strings.announcementsPageStrings.ANNOUNCE_REQ_TITLE_TABLE}>
                    <Helmet>
                        <title>Meshekle | Announcements</title>
                    </Helmet>

                    <Table celled striped textAlign='right' selectable sortable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_NUMBER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_CATEGORY}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_TITLE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_CONTENT}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_EXPR_DATE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.OPERATION_OPTIONS}</Table.HeaderCell>
                                {/*<Table.HeaderCell>Image</Table.HeaderCell>*/}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {announcementsRequests.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(announcementReq =>
                                (<Table.Row key={announcementReq.announcementId}>
                                    {/*<Table.Cell>*/}
                                        {/*<Header as='h4' image>*/}
                                            {/*/!*<Image src='/images/avatar/small/lena.png' rounded size='mini' />*!/*/}
                                            {/*<Header.Content>*/}
                                                {/*<Link to={`${this.props.match.url}/announcements/${announcementReq.announcementId}`}>*/}
                                                    {/*{announcementReq.announcementId}*/}
                                                {/*</Link>*/}
                                                {/*/!*<Header.Subheader>Human Resources</Header.Subheader>*!/*/}
                                            {/*</Header.Content>*/}
                                        {/*</Header>*/}
                                    {/*</Table.Cell>*/}
                                    <Table.Cell>{announcementReq.announcementId}</Table.Cell>
                                    <Table.Cell>{announcementReq.categoryId}</Table.Cell>
                                    <Table.Cell>{announcementReq.title}</Table.Cell>
                                    <Table.Cell>{announcementReq.content}</Table.Cell>
                                    <Table.Cell>{announcementReq.expirationTime}</Table.Cell>
                                    <Table.Cell>Options</Table.Cell>
                                </Table.Row>),
                            )}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan={8}>
                                    <Menu floated="left" pagination>
                                        {pageAnnouncementsRequests!== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                            <Icon name="right chevron"/>
                                        </Menu.Item>}
                                        {times(totalPagesAnnouncementsRequests, n =>
                                            (<Menu.Item as="a" key={n} active={n === pageAnnouncementsRequests}
                                                        onClick={this.setPage(n)}>
                                                {n + 1}
                                            </Menu.Item>),
                                        )}
                                        {pageAnnouncementsRequests !== (totalPagesAnnouncementsRequests - 1) &&
                                        <Menu.Item as="a" icon onClick={this.incrementPage}>
                                            <Icon name="left chevron"/>
                                        </Menu.Item>}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    {/*<Button positive>{strings.phoneBookPageStrings.ADD_USER}</Button>*/}
                </Page>
                <Page children={announcements}
                      title={strings.announcementsPageStrings.ANNOUNCE_TITLE_TABLE}>
                    <Helmet>
                        <title>Meshekle | Announcements</title>
                    </Helmet>

                    <Table celled striped textAlign='right' selectable sortable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_NUMBER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_CATEGORY}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_TITLE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_CONTENT}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_EXPR_DATE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.OPERATION_OPTIONS}</Table.HeaderCell>
                                {/*<Table.HeaderCell>Image</Table.HeaderCell>*/}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {announcements.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(announcement =>
                                (<Table.Row key={announcement.announcementId}>
                                    <Table.Cell>{announcement.announcementId}</Table.Cell>
                                    <Table.Cell>{announcement.categoryId}</Table.Cell>
                                    <Table.Cell>{announcement.title}</Table.Cell>
                                    <Table.Cell>{announcement.content}</Table.Cell>
                                    <Table.Cell>{announcement.expirationTime}</Table.Cell>
                                    <Table.Cell>Options</Table.Cell>
                                </Table.Row>),
                            )}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan={8}>
                                    <Menu floated="left" pagination>
                                        {pageAnnouncements !== 0 &&
                                        <Menu.Item as="a" icon onClick={this.decrementPage}>
                                            <Icon name="right chevron"/>
                                        </Menu.Item>}
                                        {times(totalPagesAnnouncements, n =>
                                            (<Menu.Item as="a" key={n} active={n === pageAnnouncements}
                                                        onClick={this.setPage(n)}>
                                                {n + 1}
                                            </Menu.Item>),
                                        )}
                                        {pageAnnouncements !== (totalPagesAnnouncements - 1) &&
                                        <Menu.Item as="a" icon onClick={this.incrementPage}>
                                            <Icon name="left chevron"/>
                                        </Menu.Item>}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <Button positive
                            onClick={this.onClick.bind(this)}
                    >{strings.announcementsPageStrings.ADD_ANNOUNCEMENT}</Button>
                </Page>
                <div>
                    {/*<Router>*/}
                    <Switch>
                        <Route exec path={`${this.props.match.path}/addAnnouncement`} render={(props) => (
                            <AnnouncementAdd {...props}/>
                        )}/>
                    </Switch>
                    {/*</Router>*/}
                </div>
            </div>
        );
    }
}

export {AnnouncementsManagementPage}