import React from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Icon, Menu, Table, Image} from 'semantic-ui-react';
import {Link, Redirect, Route, Switch} from "react-router-dom";
import store from 'store';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import strings from "../../shared/strings";

import AnnouncementAdd from "../../components/announcement/AnnouncementAdd";
import announcementsStorage from "../../storage/announcementsStorage";

const TOTAL_PER_PAGE = 10;

class AnnouncementsManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            announcementsRequests: [],
            users: [],
            filteredAnnouncementsRequests: [],
            pageAnnouncementsRequests: 0,
            totalPagesAnnouncementsRequests: 0,
            announcements: [],
            filteredAnnouncements: [],
            pageAnnouncements: 0,
            totalPagesAnnouncements: 0,
            categories: []
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
        this.getUsers();
        this.getCategories();
        this.getAnnouncementsRequests();
        this.getAnnouncements();


    }

    componentWillReceiveProps({location = {}}) {
        if (location.pathname === '/chores' && location.pathname !== this.props.location.pathname) {
            this.getAnnouncementsRequests();
            this.getAnnouncements();
        }
    }

    getCategories(){
        announcementsStorage.getCategoriesByServiceProviderId(this.serviceProviderId,this.serviceProviderHeaders)
            .then(response => this.setState({categories: response.data}));
    };

    getUsers(){
        announcementsStorage.getUsers(this.serviceProviderHeaders)
            .then(response => this.setState({users: response.data}));
    };

    getAnnouncementsRequests() {
        announcementsStorage.getAnnouncementsRequests(this.serviceProviderId,this.serviceProviderHeaders)
            .then((response) => {
                console.log('response ', response);
                const announcementsReq = response.data;
                const totalPagesAnnouncementsRequests = Math.ceil(announcementsReq.length / TOTAL_PER_PAGE);

                this.setState({
                    announcementsRequests: announcementsReq,
                    filteredAnnouncementsRequests: announcementsReq,
                    pageAnnouncementsRequests: 0,
                    totalPagesAnnouncementsRequests: totalPagesAnnouncementsRequests,
                });
                if(this.refs.reqSearchInput) this.refs.reqSearchInput.value = "";
                if(this.refs.annSearchInput) this.refs.annSearchInput.value = "";
            });
    }

    getAnnouncements() {
        announcementsStorage.getAnnouncements(this.serviceProviderId,this.serviceProviderHeaders)
            .then((response) => {

                const announcements = response.data;
                const totalPagesAnnouncements = Math.ceil(announcements.length / TOTAL_PER_PAGE);

                this.setState({
                    announcements: announcements.filter(a => a.status !== "Requested"),
                    filteredAnnouncements: announcements.filter(a => a.status !== "Requested"),
                    pageAnnouncements: 0,
                    totalPagesAnnouncements,
                });
                if(this.refs.reqSearchInput)
                    this.refs.reqSearchInput.value = "";
                if(this.refs.annSearchInput)
                    this.refs.annSearchInput.value = "";
            });
    }

    blobToFile(theBlob, fileName){
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
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
            userId: this.userId,
            isUpdate: false
        });
    };

    handleUpdate = (announcement) => {

        announcement.categoryName = this.state.categories.filter(cat => cat.categoryId === announcement.categoryId)[0].categoryName;

        this.props.history.push(`${this.props.match.path}/updateAnnouncement`, {
            serviceProviderId: this.serviceProviderId,
            userId: this.userId,
            isUpdate: announcement
        });
    };

    handleApproveButton = (announcementId) => {
        var newAnnouncement = {status: "On air",
                                creationTime: new Date(),
                                serviceProviderId: this.serviceProviderId,
                                announcementId: announcementId};

        announcementsStorage.updateAnnouncement(newAnnouncement, this.serviceProviderHeaders)
            .then(response => {
                if(response.status === 200) {
                    var announcementToMove = this.state.announcementsRequests.filter(a => a.announcementId === announcementId)[0];
                    announcementToMove.status = "On air";
                    var newAnnouncements = this.state.announcements;
                    if(!newAnnouncements.includes(announcementToMove))
                        newAnnouncements.push(announcementToMove);
                    this.setState({
                        announcementsRequests: this.state.announcementsRequests.filter(a => a.announcementId !== announcementId),
                        filteredAnnouncementsRequests: this.state.announcementsRequests.filter(a => a.announcementId !== announcementId),
                        announcements: newAnnouncements,
                        filteredAnnouncements: newAnnouncements
                    });
                    this.refs.reqSearchInput.value = "";
                    this.refs.annSearchInput.value = "";
                }
            });

    };

    handleCancelButton = (announcementId) => {
        var newAnnouncement = {status: "Cancelled",
            serviceProviderId: this.serviceProviderId,
            announcementId: announcementId};

        announcementsStorage.updateAnnouncement(newAnnouncement, this.serviceProviderHeaders)
            .then(response => {
                if(response.status === 200) {
                    var announcementToMove = this.state.announcementsRequests.filter(a => a.announcementId === announcementId)[0];
                    announcementToMove.status = "Cancelled";
                    var newAnnouncements = this.state.announcements;
                    if(!newAnnouncements.includes(announcementToMove))
                        newAnnouncements.push(announcementToMove);
                    this.setState({
                        announcementsRequests: this.state.announcementsRequests.filter(a => a.announcementId !== announcementId),
                        filteredAnnouncementsRequests: this.state.announcementsRequests.filter(a => a.announcementId !== announcementId),
                        announcements: newAnnouncements,
                        filteredAnnouncements: newAnnouncements
                    });
                    this.refs.reqSearchInput.value = "";
                    this.refs.annSearchInput.value = "";
                }
            });

    };

    handleRemoveButton = (announcementId) => {

        announcementsStorage.removeAnnouncement(announcementId, this.serviceProviderHeaders)
            .then(response => {
                if(response.status === 200) {
                    this.setState({
                        announcements: this.state.announcements.filter(a => a.announcementId !== announcementId),
                        filteredAnnouncements: this.state.announcements.filter(a => a.announcementId !== announcementId),
                    });
                    this.refs.reqSearchInput.value = "";
                    this.refs.annSearchInput.value = "";
                }
            });

    };

    onChangeRequestsSearch = (event) => {
      this.setState({filteredAnnouncementsRequests : this.state.announcementsRequests.filter(a => a.title.toLowerCase().includes(event.target.value.toLowerCase()))})
    };

    onChangeAnnouncementsSearch = (event) => {
        this.setState({filteredAnnouncements : this.state.announcements.filter(a => a.title.toLowerCase().includes(event.target.value.toLowerCase()))})
    };

    render() {
        console.log('app props ', this.props);

        const {announcementsRequests,filteredAnnouncementsRequests, pageAnnouncementsRequests, totalPagesAnnouncementsRequests, announcements, filteredAnnouncements, pageAnnouncements, totalPagesAnnouncements, categories, users} = this.state;
        const startIndex = pageAnnouncementsRequests * TOTAL_PER_PAGE;
        const categoryNamesMap = categories.map(cat => ({id: cat.categoryId,name: cat.categoryName}));
        return (
            <div>
                <Page children={announcementsRequests} title={strings.announcementsPageStrings.ANNOUNCE_REQ_TITLE_TABLE}>
                    <Helmet>
                        <title>Meshekle | Announcements</title>
                    </Helmet>

                    <div className="ui icon input">
                        <i className="search icon"></i>
                        <input ref="reqSearchInput" onChange={this.onChangeRequestsSearch.bind(this)} type="text" placeholder="חיפוש לפי נושא..."/>
                    </div>

                    <Table celled striped textAlign='right' selectable sortable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_NUMBER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_USERNAME}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_CATEGORY}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_TITLE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_CONTENT}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_EXPR_DATE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_DATE_OF_EVENT}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_FILE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.OPERATION_OPTIONS}</Table.HeaderCell>
                                {/*<Table.HeaderCell>Image</Table.HeaderCell>*/}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filteredAnnouncementsRequests.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(announcementReq =>
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
                                    <Table.Cell>{users[0] ? users.filter(u => parseInt(u.userId) === announcementReq.userId)[0].fullname: ""}</Table.Cell>
                                    <Table.Cell>{categoryNamesMap[0] ? categoryNamesMap.filter(cat => cat.id === announcementReq.categoryId)[0].name : ""}</Table.Cell>
                                    <Table.Cell>{announcementReq.title}</Table.Cell>
                                    <Table.Cell>{announcementReq.content}</Table.Cell>
                                    <Table.Cell>{announcementReq.expirationTime.substring(0,announcementReq.expirationTime.indexOf('T'))}</Table.Cell>
                                    <Table.Cell>{announcementReq.dateOfEvent?announcementReq.dateOfEvent.substring(0,announcementReq.dateOfEvent.indexOf('T')):""}</Table.Cell>
                                    <Table.Cell><a className="btn btn-default" download={announcementReq.fileName}
                                                   href={announcementReq.file ? "data:application/octet-stream;base64,"+announcementReq.file.toString(): ""}>{announcementReq.fileName? announcementReq.fileName : "אין קובץ"}</a>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <button className="ui icon button" onClick={()=>this.handleApproveButton(announcementReq.announcementId)}>
                                            <i className="check icon"></i>
                                        </button>
                                        <button className="ui icon button" onClick={()=>this.handleCancelButton(announcementReq.announcementId)}>
                                            <i className="x icon"></i>
                                        </button>
                                    </Table.Cell>
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

                    <div className="ui icon input">
                        <i className="search icon"></i>
                        <input ref="annSearchInput" onChange={this.onChangeAnnouncementsSearch.bind(this)} type="text" placeholder="חיפוש לפי נושא..."/>
                    </div>

                    <Table celled striped textAlign='right' selectable sortable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_NUMBER}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_USERNAME}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_CATEGORY}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_TITLE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_CONTENT}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_EXPR_DATE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_DATE_OF_EVENT}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_STATUS}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.ANNOUNCE_FILE}</Table.HeaderCell>
                                <Table.HeaderCell>{strings.announcementsPageStrings.OPERATION_OPTIONS}</Table.HeaderCell>
                                {/*<Table.HeaderCell>Image</Table.HeaderCell>*/}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filteredAnnouncements.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(announcement =>
                                (<Table.Row key={announcement.announcementId}>
                                    <Table.Cell>{announcement.announcementId}</Table.Cell>
                                    <Table.Cell>{users[0] ? users.filter(u => parseInt(u.userId) === announcement.userId)[0].fullname : ""}</Table.Cell>
                                    <Table.Cell>{categoryNamesMap[0] ? categoryNamesMap.filter(cat => cat.id === announcement.categoryId)[0].name : ""}</Table.Cell>
                                    <Table.Cell>{announcement.title}</Table.Cell>
                                    <Table.Cell>{announcement.content}</Table.Cell>
                                    <Table.Cell>{announcement.expirationTime.substring(0,announcement.expirationTime.indexOf('T'))}</Table.Cell>
                                    <Table.Cell>{announcement.dateOfEvent?announcement.dateOfEvent.substring(0,announcement.dateOfEvent.indexOf('T')):""}</Table.Cell>
                                    <Table.Cell>{announcement.status}</Table.Cell>
                                    <Table.Cell><a className="btn btn-default" download={announcement.fileName}
                                                   href={announcement.file ? "data:application/octet-stream;base64,"+announcement.file: ""}>{announcement.fileName? announcement.fileName : "אין קובץ"}</a>
                                    </Table.Cell>
                                    <Table.Cell><button className="ui icon button" onClick={()=>this.handleUpdate(announcement)}>
                                        <i className="edit icon"></i>
                                    </button>
                                        <button className="ui icon button" onClick={()=>this.handleRemoveButton(announcement.announcementId)}>
                                            <i className="trash alternate icon"></i>
                                        </button>
                                    </Table.Cell>
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
                    {/*<Image src={announcements[2] ? this.blobToFile(announcements[2].image,"check.png"): ""}>*/}
                    {/*</Image>*/}
                    </Page>
                <div>
                    {/*<Router>*/}
                    <Switch>
                        <Route exec path={`${this.props.match.path}/addAnnouncement`} render={(props) => (
                            <AnnouncementAdd {...props}
                                getAnnouncements = {() => this.getAnnouncements()}
                            />
                        )}/>
                    </Switch>
                    <Switch>
                        <Route exec path={`${this.props.match.path}/updateAnnouncement`} render={(props) => (
                            <AnnouncementAdd {...props}
                                getAnnouncements = {() => this.getAnnouncements()}
                            />
                        )}/>
                    </Switch>
                    {/*</Router>*/}
                </div>
            </div>
        );
    }
}

export {AnnouncementsManagementPage}