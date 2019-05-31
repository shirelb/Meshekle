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
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import CategoryAdd from "../../components/announcement/CategoryAdd";

const TOTAL_PER_PAGE = 10;

class AnnouncementsManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            announcementsRequests: [],
            serviceProviders: [],
            users: [],
            filteredAnnouncementsRequests: [],
            pageAnnouncementsRequests: 0,
            totalPagesAnnouncementsRequests: 0,
            announcements: [],
            filteredAnnouncements: [],
            pageAnnouncements: 0,
            totalPagesAnnouncements: 0,
            categories: [],

            categoriesToManage: [],
            pageCategories: 0,
            totalPagesCategories: 0,
           };

        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);
        //this.handleDelete = this.handleDelete.bind(this);

        this.serviceProviderHeaders = '';

    }

    componentWillMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
        this.getUsers();
        if(this.serviceProviderId === '1') {
            this.getAllServiceProviders();
            this.getAllCategories();
        }
        this.getCategories();
        this.getAnnouncementsRequests();
        this.getAnnouncements();

    }
    componentDidMount() {


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

    getAllServiceProviders(){
      serviceProvidersStorage.getServiceProviders(this.serviceProviderHeaders)
          .then(response => this.setState({serviceProviders: response}));
    };

    getAllCategories(){
        announcementsStorage.getCategories(this.serviceProviderHeaders)
            .then(response => {
                const categories = response.data;
                const totalPagesCategories = Math.ceil(categories.length / TOTAL_PER_PAGE);

                this.setState({
                    categoriesToManage: categories,
                    pageCategories: 0,
                    totalPagesCategories: totalPagesCategories,
                });
            });
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

    onAddCategoryClick = () => {

        this.props.history.push(`${this.props.match.path}/addCategory`, {
            serviceProviderId: this.serviceProviderId,
            userId: this.userId,
            serProvsWithNames: this.state.serviceProviders.map(item=> {return {serviceProviderId: item.serviceProviderId, userId: item.userId, name: this.state.users.filter(u=> u.userId === item.userId)[0].fullname}}),
            catNames: this.state.categoriesToManage.map(c=>c.categoryName),
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


    handleEditCategoryButton = (category,names) => {
        let serProvsWithNames = this.state.serviceProviders.map(item=> {return {serviceProviderId: item.serviceProviderId, userId: item.userId, name: this.state.users.filter(u=> u.userId === item.userId)[0].fullname}});
        this.props.history.push(`${this.props.match.path}/updateCategory`, {
            serviceProviderId: this.serviceProviderId,
            userId: this.userId,
            serProvsWithNames: serProvsWithNames,
            isUpdate: {categoryName:category.categoryName, managers: names.split(',').map(item=> serProvsWithNames.filter(s => s.name === item)[0] )},
            catNames: this.state.categoriesToManage.map(c=>c.categoryName),
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


    handleCancelCategoryButton = (categoryName) => {

        announcementsStorage.removeCategory(categoryName, this.serviceProviderHeaders)
            .then(response => {
                if(response.status === 200) {
                    this.getUsers();
                    if(this.serviceProviderId === '1') {
                        this.getAllServiceProviders();
                        this.getAllCategories();
                    }
                    this.getCategories();
                    this.getAnnouncementsRequests();
                    this.getAnnouncements();
                }
            });

    };




    onChangeRequestsSearch = (event) => {
      this.setState({filteredAnnouncementsRequests : this.state.announcementsRequests.filter(a => a.title.toLowerCase().includes(event.target.value.toLowerCase()))})
    };

    onChangeAnnouncementsSearch = (event) => {
        this.setState({filteredAnnouncements : this.state.announcements.filter(a => a.title.toLowerCase().includes(event.target.value.toLowerCase()))})
    };

    getUnique = cats => {
        let data = JSON.parse(JSON.stringify(cats));
        data = data.map(item => item.categoryName);
        data = data.filter((item, pos) => {
            return data.indexOf(item) === pos;
        });
        data = data.map(item => {
            return {categoryName: item, categoryId: cats.filter(a => a.categoryName === item)[0].categoryId}
        });
        return data;
    };

    getCategoryManagers = (name, providers,usersList) => {
      let serProvIds = this.state.categoriesToManage.filter(item => item.categoryName === name && !["1",1].includes(item.serviceProviderId)).map(item => item.serviceProviderId);
        serProvIds = serProvIds.map(item => {
            //let provs = this.state.serviceProviders;
            let userID = providers.filter(s => s.serviceProviderId === String(item))[0]?providers.filter(s => s.serviceProviderId === String(item))[0].userId:"";
            //let users = this.state.users;
            return usersList.filter(u => u.userId === userID)[0]?usersList.filter(u => u.userId === userID)[0].fullname: "";
        });

        let ans = serProvIds.reduce((acc,cur) => {return acc+","+cur}, "");
        return ans.substring(1);
    };

    render() {
        // console.log('app props ', this.props);

        const {serviceProviders ,categoriesToManage, announcementsRequests,filteredAnnouncementsRequests, pageAnnouncementsRequests, totalPagesAnnouncementsRequests, announcements, filteredAnnouncements, pageAnnouncements, totalPagesAnnouncements, categories, users,  pageCategories, totalPagesCategories} = this.state;
        const startIndexReq = pageAnnouncementsRequests * TOTAL_PER_PAGE;
        const startIndexAnn = pageAnnouncements * TOTAL_PER_PAGE;
        const startIndexCat = pageCategories * TOTAL_PER_PAGE;
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
                            {filteredAnnouncementsRequests.slice(startIndexReq, startIndexReq + TOTAL_PER_PAGE).map(announcementReq =>
                                (<Table.Row key={announcementReq.announcementId}>
                                    <Table.Cell>{announcementReq.announcementId}</Table.Cell>
                                    <Table.Cell>{users[0] ? users.filter(u => parseInt(u.userId) === announcementReq.userId)[0].fullname: ""}</Table.Cell>
                                    <Table.Cell>{categoryNamesMap.filter(cat => cat.id === announcementReq.categoryId)[0] ? categoryNamesMap.filter(cat => cat.id === announcementReq.categoryId)[0].name : ""}</Table.Cell>
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
                            {filteredAnnouncements.slice(startIndexAnn, startIndexAnn + TOTAL_PER_PAGE).map(announcement =>
                                (<Table.Row key={announcement.announcementId}>
                                    <Table.Cell>{announcement.announcementId}</Table.Cell>
                                    <Table.Cell>{users[0] ? users.filter(u => parseInt(u.userId) === announcement.userId)[0].fullname : ""}</Table.Cell>
                                    <Table.Cell>{categoryNamesMap.filter(cat => cat.id === announcement.categoryId)[0] ? categoryNamesMap.filter(cat => cat.id === announcement.categoryId)[0].name : ""}</Table.Cell>
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

                    {this.serviceProviderId === '1' ?
                        <div>
                        <Page children={categoriesToManage} title={strings.announcementsPageStrings.ANNOUNCE_CATEGORIES_TABLE}>
                            <Helmet>
                                <title>Meshekle | Announcements</title>
                            </Helmet>

                            <Table celled striped textAlign='right' selectable sortable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>{strings.announcementsPageStrings.CATEGORY_ID}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.announcementsPageStrings.CATEGORY_NAME}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.announcementsPageStrings.CATEGORY_MANGERS}</Table.HeaderCell>
                                        <Table.HeaderCell>{strings.announcementsPageStrings.OPERATION_OPTIONS}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.getUnique(categoriesToManage).slice(startIndexCat, startIndexCat + TOTAL_PER_PAGE).map(cat =>
                                        (<Table.Row key={cat.categoryId}>

                                            <Table.Cell>{cat.categoryId}</Table.Cell>
                                            <Table.Cell>{cat.categoryName}</Table.Cell>
                                            <Table.Cell>{this.getCategoryManagers(cat.categoryName,JSON.parse(JSON.stringify(serviceProviders)),JSON.parse(JSON.stringify(users)))}</Table.Cell>
                                            <Table.Cell>
                                                <button className="ui icon button" onClick={()=>this.handleEditCategoryButton(cat,this.getCategoryManagers(cat.categoryName,JSON.parse(JSON.stringify(serviceProviders)),JSON.parse(JSON.stringify(users))))}>
                                                    <i className="edit icon"></i>
                                                </button>
                                                <button className="ui icon button" onClick={()=>this.handleCancelCategoryButton(cat.categoryName)}>
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
                                                {pageCategories!== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                                    <Icon name="right chevron"/>
                                                </Menu.Item>}
                                                {times(totalPagesCategories, n =>
                                                    (<Menu.Item as="a" key={n} active={n === pageCategories}
                                                                onClick={this.setPage(n)}>
                                                        {n + 1}
                                                    </Menu.Item>),
                                                )}
                                                {pageCategories !== (totalPagesCategories - 1) &&
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
                        <Button positive onClick={this.onAddCategoryClick.bind(this)}
                    >{strings.announcementsPageStrings.ADD_CATEGORY}</Button>
                        </div>
                            : null}
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
                    <Switch>
                        <Route exec path={`${this.props.match.path}/addCategory`} render={(props) => (
                            <CategoryAdd {...props}
                                getAnnouncements = {() => this.getAnnouncements()}
                                getAnnouncementsRequests = {() => this.getAnnouncementsRequests()}
                                getCategories = {() => this.getCategories()}
                                getAllCategories = {() => this.getAllCategories()}
                            />
                        )}/>
                    </Switch>
                    <Switch>
                        <Route exec path={`${this.props.match.path}/updateCategory`} render={(props) => (
                            <CategoryAdd {...props}
                                         getAnnouncements = {() => this.getAnnouncements()}
                                         getAnnouncementsRequests = {() => this.getAnnouncementsRequests()}
                                         getCategories = {() => this.getCategories()}
                                         getAllCategories = {() => this.getAllCategories()}
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