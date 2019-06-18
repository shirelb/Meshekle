import React from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Button, Dropdown, Header, Icon, Label, Modal, Select} from 'semantic-ui-react';
import store from 'store';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import choresStorage from "../../storage/choresStorage";
import usersStorage from "../../storage/usersStorage";
import ChoreSettings from "../../components/chores/ChoreSettings";
import CreateNewChoreType from "../../components/chores/CreateNewChoreType";
import {Redirect, Route, Switch} from "react-router-dom";
import ChoresCalendar from "../../components/calendars/ChoresCalendar"
import OriginChoresCalendar from "../../components/calendars/OriginChoresCalendar"
import moment from 'moment';
import axios from "axios";
import ReplacementRequests from '../../components/chores/ReplacementRequests';
import ChoresHistory from '../../components/chores/ChoresHistory';
//import {CheckBox, FormInput, FormLabel, Text} from "react-native-elements";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants";
import DraggableUser from '../../components/chores/DraggableUser';
import UsersInTypeModal from '../../components/chores/UsersInTypeModal'
import AnnouncementsManagementPage from "../announcementsManagementPage/AnnouncementsManagementPage";


const TOTAL_PER_PAGE = 10;
var choreTypesOptions = [];

const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
};
const serviceProviderId = store.get('serviceProviderId');
var usersToAddToType = [];

class ChoresManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            page: 0,
            totalPages: 0,
            choreTypesOptions: [],
            choreTypeSelected: '',
            settings: '',
            userChores: [/*{
                "userId": "1",
                "choreTypeName": "שמירה",
                "date": "2019-03-20T22:00:00.000Z",
                "isMark": false
            }*/],
            createUserChoreResult: {
                name: '',
                users: [],
                reqFaild:'',
            },
            isOpenModalUsers: false,
            usersToAddToType: [],
            userNameToAddToType: [],
            usersNotInType: [],
            openModal: false,
            contentModal: '',
            calendarDisplay: 'calendar',
            requestsReplaced: [],
            choreTypeName: '',
            openOriginalChoresModal: false,
            originalUserChores: [],
            showHistoryTable: false,
            userDragged: {name: "", id: ""},
            dateDragged: "",
            userchoreDeleted:false,

            getChoreTypesError:"",
            errorMessageDeleting:"",
            errorDeleteUserFromChoreType:"",
        };


        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');


        this.handleChange = this.handleChange.bind(this);
        this.settingsView = this.settingsView.bind(this);

        this.serviceProviderHeaders = '';
        this.toEditSettings = this.toEditSettings.bind(this);

        this.onSelectSlot = this.onSelectSlot.bind(this);
        this.createUserChores = this.createUserChores.bind(this);
        this.deleteUserChore = this.deleteUserChore.bind(this);
        this.handleClosePortal = this.handleClosePortal.bind(this);
        this.onUpdateSettings = this.onUpdateSettings.bind(this);
        this.openModalUsers = this.openModalUsers.bind(this);
        this.deleteUserFromChoreType = this.deleteUserFromChoreType.bind(this);
        //this.modalUsersBuild = this.modalUsersBuild.bind(this);
        //this.handleUserToAddChange = this.handleUserToAddChange.bind(this);
        this.handleUserToAdd = this.handleUserToAdd.bind(this);
        //this.addUserToChoreType = this.addUserToChoreType.bind(this);
        this.openModalRequest = this.openModalRequest.bind(this);
        this.onDeleteType = this.onDeleteType.bind(this);
        this.onChangeUserchoresByReplacement = this.onChangeUserchoresByReplacement.bind(this);
        this.onDraggedUser = this.onDraggedUser.bind(this);
    }

    componentWillMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        choresStorage.getAllChoreTypes(serviceProviderId, serviceProviderHeaders)
            .then(response => {
                console.log("get all chore types response",response)
                if(response&& response.response!== undefined && response.response.status!== 200){
                    this.setState({getChoreTypesError:"בעיה בהבאת נתונים מהשרת, נא לרענן את העמוד"});
                }
                else{
                    let choreTypes = response !== null ? response : [];
                    choreTypesOptions = choreTypes.map(item => ({
                        key: item.choreTypeName,
                        text: item.choreTypeName,
                        value: item.choreTypeName,
                    }));
                    this.setState({choreTypesOptions: choreTypesOptions});
                }
            });

    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        connectToServerSocket(store.get('serviceProviderId'));


        WEB_SOCKET.on("getChangeInUserChores", this.onChangeUserchoresByReplacement.bind(this));
    }

    componentWillUnmount() {
        WEB_SOCKET.off("getChangeInUserChores");

    }

    componentWillReceiveProps({location = {}}) {
    }

    handleChange(event) {
        let typeName = String(event.nativeEvent.srcElement.innerText);
        this.setState({choreTypeSelected: typeName});
        this.settingsView(event.nativeEvent.srcElement.innerText);
        this.onSelectSlot(event, event.nativeEvent.srcElement.innerText);


    }

    settingsView(type) {

        choresStorage.getChoreTypeSetting(serviceProviderId, serviceProviderHeaders, type)
            .then(settings => {
                if(settings.status!==200){
                    this.setState({getChoreTypesError:"בעיה בהבאת הנתונים מהשרת, נא רענן את העמוד"});
                }
                else{
                    this.setState({settings: settings.data.type});
                }
            });
    }

    toEditSettings() {
        this.props.history.push("/settings");
    }

    // getUserChoresForType(type) {
    //     console.log("in GETUSERCHORESFORTYPE: type:", type);
    //     choresStorage.getUserChoresForType(this.serviceProviderId, serviceProviderHeaders, type)
    //         .then(res => {
    //             console.log("in GETUSERCHORESFORTYPE: res:", res);
    //             this.setState({userChores: res.data})
    //             return res.data
    //         })
    // }


    onChangeUserchoresByReplacement() {
        this.onSelectSlot("", this.state.choreTypeName);
    }

    onSelectSlot(event, typeName) {
        axios.all([choresStorage.getUsersForChoreType(serviceProviderId, serviceProviderHeaders, typeName),//event.target.innerText), 
            choresStorage.getUserChoresForType(serviceProviderId, serviceProviderHeaders, typeName, ""),
            choresStorage.getReplacementRequests(serviceProviderId, serviceProviderHeaders, typeName, 'replaced')
        ])
            .then(reses => {
                if( reses[0].status!==200 || reses[1].status!==200 || reses[2].status!==200){
                    this.setState({getChoreTypesError:"אירעה בעיה בהבאת חלק מהנתונים מהשרת, נא לרענן את העמוד"});
                }
                else{
                    var usersDoType = [];
                    var user;
                    for (user in reses[0].data.usersChoreType) {
                        usersDoType.push(reses[0].data.usersChoreType[user].User);
                    }
                    ;
                    usersDoType = usersDoType.map(u => ({
                        key: user,
                        text: u.fullname,
                        value: u.fullname,
                        id: u.userId
                    }));
                    this.setState({users: usersDoType});
                    //reses[1]

                    let userChores = reses[1].data.usersChores;
                    const totalPages = Math.ceil(userChores.length / TOTAL_PER_PAGE);
                    let userChoreEvents = [];
                    let originalUserChoreEvents = [];
                    userChores.map((userchore, index) => {
                        let userChoreEvent = {
                            user: null,
                            id: 1000,
                            title: '',
                            start: '',
                            end: '',
                            userChore: null,
                            date: Date.now(),
                            originDate: Date.now(),
                            isMark: false,
                        };
                        userChoreEvent.user = userchore.User;
                        userChoreEvent.id = userchore.userChoreId;
                        userChoreEvent.title = userchore.User.fullname;
                        userChoreEvent.allDay = false;
                        userChoreEvent.startTime = this.state.settings.startTime;
                        userChoreEvent.endTime = this.state.settings.endTime;
                        userChoreEvent.userChore = userchore;
                        userChoreEvent.date = userchore.date;
                        userChoreEvent.start = userchore.date;
                        userChoreEvent.originDate = userchore.originDate;
                        userChoreEvent.isMark = userchore.isMark;

                        //for origin userchores board:
                        let originalUserChoreEvent = {
                            User: null,
                            id: 1000,
                            title: '',
                            start: '',
                            end: '',
                            userChore: null,
                            date: Date.now(),
                            originDate: Date.now(),
                            isMark: false,
                        };
                        originalUserChoreEvent.User = userchore.User;
                        originalUserChoreEvent.id = userchore.userChoreId;
                        originalUserChoreEvent.title = userchore.User.fullname;
                        originalUserChoreEvent.allDay = false;
                        originalUserChoreEvent.startTime = this.state.settings.startTime;
                        originalUserChoreEvent.endTime = this.state.settings.endTime;
                        originalUserChoreEvent.userChore = userchore;
                        originalUserChoreEvent.date = userchore.originDate;
                        originalUserChoreEvent.start = userchore.originDate;
                        originalUserChoreEvent.originDate = userchore.originDate;
                        originalUserChoreEvent.isMark = userchore.isMark;

                        originalUserChoreEvents.push(originalUserChoreEvent);
                        userChoreEvents.push(userChoreEvent);

                    });

                    //reses[2]
                    let requestsReplaced = [];
                    reses[2].data.requests.map(re => {
                        if (re.choreOfSender.choreTypeName === typeName) {
                            requestsReplaced.push(re);
                        }
                    })


                    this.setState({
                        userChores: userChoreEvents,
                        originalUserChores: originalUserChoreEvents,
                        requestsReplaced: requestsReplaced,
                        page: 0,
                        totalPages,
                        users: usersDoType
                    });
                }
            })
            .catch(er => {
                this.setState({getChoreTypesError:"אירעה בעיה בהבאת חלק מהנתונים מהשרת, נא לרענן את העמוד"});
            })

    }

    createUserChores(event, usersChoosed, usersChoosedNames, date) {// {usersChoosed, usersChoosedNames, date}){
        let requests = [];
        let updateUserchores = this.state.userChores;
        let updateOriginalUserchores = this.state.originalUserChores;
        let i = 0;
        for (i in usersChoosed) {
            requests.push(choresStorage.createNewUserChore(serviceProviderId, this.serviceProviderHeaders, this.state.settings.choreTypeName, usersChoosed[i], moment(date).format('YYYY-MM-DD')));
        }
        axios.all(requests)
            .then(res => {
                console.log("create user chores RESPONSE0", res)
                let reqFaild = "";
                var workUsers = [];
                var index;
                var resultUsers = '';
                let chore = 0;
                let getUsersRequests = [];
                for (chore in res) {
                    if (res[chore] !== undefined && res[chore].response===undefined) {
                        index = usersChoosed.indexOf(res[chore].data.newUserChore.userId);
                        console.log("res.data[chore].newUserChore: ", res[chore].data);
                        console.log("index: ", index, usersChoosedNames[index]);
                        resultUsers = resultUsers + ', ' + usersChoosedNames[index];
                        getUsersRequests.push(usersStorage.getUserByUserID(res[chore].data.newUserChore.userId, this.serviceProviderHeaders));
                        //creat event to userchore was added:
                        getUsersRequests.push(choresStorage.createUserchoreEvent(serviceProviderId, serviceProviderHeaders, res[chore].data.newUserChore.userId, res[chore].data.newUserChore.userChoreId));
                    }
                    else{
                        if(reqFaild===""){
                            reqFaild =reqFaild +  " יתכן שהיו עוד משתמשים עבורם לא נוספה תורנות-עבורם נסה שנית.\n";
                        }
                    }
                }
                axios.all(getUsersRequests)
                    .then((response) => {
                        
                        let r = 0;
                        let timesFaild = 0;
                        for (r in response) {
                            let user = response[r];
                            if (user.fullname !== undefined && r%2===0) {
                                let choreEvent = {
                                    allDay: false,
                                    date: res[chore].data.newUserChore.date,
                                    originDate: res[chore].data.newUserChore.originDate,
                                    endTime: this.state.settings.endTime,
                                    startTime: this.state.settings.startTime,
                                    id: res[chore].data.newUserChore.userChoreId,
                                    isMark: false,
                                    title: user.fullname,
                                    user: user,
                                    User: user,
                                    userChore: res[chore].data.newUserChore,
                                }
                                updateUserchores.push(choreEvent);
                                updateOriginalUserchores.push(choreEvent);

                            }
                            if(r%2===1 && response[r].response!==undefined && response[r].response.status!==200 &&timesFaild===0){
                                reqFaild = reqFaild + "אירעה בעיה בהוספת אירועי תורנויות, יש למחוק תורנויות שנוספו כעת ולהוסיף שנית. \n"
                                timesFaild=timesFaild+1;
                            }

                        }
                        if (resultUsers === '') {
                            this.setState({userChores: updateUserchores, originalUserChores: updateOriginalUserchores});
                            this.forceUpdate();
                        this.setState({createUserChoreResult: {name: 'portalNeedToDeleteUserChores', users: resultUsers}});
                    } else {
                        this.setState({createUserChoreResult: {name: 'portalUserChoresCreated', users: resultUsers, reqFaild:reqFaild}});
                    }
                    })
            });
    }

    deleteUserChore(e, {choreId}) {
        choresStorage.deleteUserChore(serviceProviderId, serviceProviderHeaders, choreId)
            .then(res => {
                
                if(res.status!==200){
                    this.setState({errorMessageDeleting:"תורנות לא נמחקה, נסה שנית"})
                }else{
                    let updateUserchores = this.state.userChores.filter(el => el.id !== choreId)
                    let updateOriginalUserChores = this.state.originalUserChores.filter(el => el.id !== choreId)
                    this.setState({userChores: updateUserchores, originalUserChores: updateOriginalUserChores,userchoreDeleted: true, errorMessageDeleting:""});
                    //this.setState({userchoreDeleted: true, errorMessageDeleting:""});
                    //this.setState({errorMessageDeleting:"תורנות  נמחקה, נסה שנית"})
                    this.forceUpdate();
                }
            })
            .catch(er=>{
                this.setState({errorMessageDeleting:"תורנות לא נמחקה, נסה שנית"})
            })
    }

    handleClosePortal() {
        this.setState({
            openModal: false,
            contentModal: "",
            createUserChoreResult: {
                name: '',
                users: '',
                reqFaild:'',
            }
        });
    }

    onUpdateSettings(newUpdatedSettings) {
        this.setState({settings: newUpdatedSettings});
    }

    onCreateChoreType(settings) {
        let types = this.state.choreTypesOptions;
        types.push({
            key: settings.choreTypeName,
            text: settings.choreTypeName,
            value: settings.choreTypeName,
        })
        this.setState({choreTypesOptions: types});
    }

    openModalUsers(e, {value}) {
        this.setState({isOpenModalUsers: value, errorDeleteUserFromChoreType:""});
    }

    deleteUserFromChoreType(e, {userId}) {
        choresStorage.deleteUserFromChoreType(serviceProviderId, serviceProviderHeaders, userId, this.state.choreTypeSelected)
            .then(res => {
                console.log("RESPONSE!!!", res)
                if (res !== undefined && res.status!==200){
                    this.setState({ errorDeleteUserFromChoreType:"מחיקת תורן נכשלה, נסה שנית."});
                }
                else if (res !== undefined) {
                    let usersInType = this.state.users;
                    let usersNotInType = this.state.usersNotInType;
                    let ur = 0;
                    for (ur in usersInType) {
                        if (usersInType[ur].id === userId) {
                            let removed = usersInType.splice(ur, 1);
                            usersNotInType.push(removed[0]);
                        }
                    }
                    this.setState({users: usersInType, usersNotInType: usersNotInType});
                } else {
                    this.setState({
                        openModal: true,
                        contentModal: 'לא ניתן להסיר משתמש מהתורנות מאחר ויש לו תורנויות עתידיות. \n יש למחוק אותן תחילה.'
                    });
                }
            });
    }

    handleUserToAdd(e, {userId}) {
    }



    openModalRequest(content) {
        this.setState({openModal: true, contentModal: content});
        this.forceUpdate();
    }

    onDeleteType() {
        choresStorage.getAllChoreTypes(serviceProviderId, serviceProviderHeaders)
            .then(response => {
                if(response&& response.response!== undefined && response.response.status!== 200){
                    this.setState({getChoreTypesError:"בעיה בהבאת נתונים מהשרת, נא לרענן את העמוד"});
                }
                else{
                    let choreTypes = response;
                    choreTypesOptions = choreTypes.map(item => ({
                        key: item.choreTypeName,
                        text: item.choreTypeName,
                        value: item.choreTypeName,
                    }));
                    this.setState({choreTypesOptions: choreTypesOptions});
                }
            })
    }

    onDraggedUser(e, src, obj) {
        let userChoosed = [];
        let userChoosedName = [];

        if (src === "draggableObject") {
            userChoosed.push(obj.userId);
            userChoosed.push(obj.name);
            this.setState({userDragged: obj});
        } else if (src === "dayEvent") {
            this.setState({dateDragged: obj})
        }
        if (this.state.userDragged.userId !== "" && this.state.dateDragged !== "") {
            this.createUserChores(e, userChoosed, userChoosedName, this.state.dateDragged);
        }
    }


    render() {
        const {users, page, totalPages, choreTypesOptions, choreTypeSelected, userChores} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;


        return (
            <Page children={users} title={""/*strings.mainPageStrings.CHORES_PAGE_TITLE*/}>
                <Helmet>
                    <title>Meshekle | ניהול תורנויות</title>
                </Helmet>
                {!(String(window.location).includes('settings') || String(window.location).includes('newChoreType')) ?//String(window.location)==='http://localhost:3000/chores'?
                    <div>
                        <Header as={'h1'}>{"תורנויות"}</Header>
                        <Button icon onClick={() => this.props.history.push(`${this.props.match.path}/newChoreType`)}
                                positive><Icon name="plus"/>{"  צור סוג תורנות חדש  "}</Button>
                        <Button icon onClick={() => this.setState({showHistoryTable: true})} positive><Icon
                            name="history"/>{"  היסטורית תורנויות  "}</Button>
                        <div hidden={!this.state.showHistoryTable}><br/><Button icon
                                                                                onClick={() => this.setState({showHistoryTable: false})}
                                                                                positive><Icon name="chevron right"/> <i
                            class="calendar outline icon"></i>{"   לוח תורנויות  "}</Button></div>
                        <br/><br/>

                        <div hidden={!this.state.showHistoryTable}>
                            {this.state.showHistoryTable ? <ChoresHistory/> : <div></div>}

                        </div>
                        <div hidden={this.state.showHistoryTable}>
                            <Select search placeholder='בחר סוג תורנות' options={this.state.choreTypesOptions}
                                    onChange={this.handleChange}
                            />
                            {this.state.getChoreTypesError!==""? <h4 style={{color:'red'}}>{this.state.getChoreTypesError}</h4>:<div></div>}

                            {this.state.choreTypeSelected === '' ?
                                <Header as={'h4'}> בחר סוג תורנות </Header>
                                :
                                <div>
                                    {/*this.onSelectSlot()*/}
                                    <Button color='twitter' onClick={() => {
                                        this.props.history.push(`${this.props.match.path}/settings`, {settings: this.state.settings,/*onUpdateSettings:this.onUpdateSettings*/})
                                    }}>{"הגדרות"}</Button>
                                    <Button color='twitter' value={true} onClick={this.openModalUsers}>עריכת
                                        תורנים</Button>
                                    <Button color='twitter' onClick={() => {
                                        this.setState({
                                            openModal: true, contentModal: <ReplacementRequests
                                                serviceProviderId={this.serviceProviderId}
                                                serviceProviderHeaders={this.serviceProviderHeaders}
                                                choreType={this.state.choreTypeSelected}
                                                requestsReplaced={this.state.requestsReplaced}
                                            ></ReplacementRequests>
                                        })
                                    }}>{"בקשות החלפה"}</Button>
                                    <br/><br/>
                                    <Button content='סידור מקורי'
                                            color={this.state.openOriginalChoresModal ? 'blue' : 'light-grey'}
                                            onClick={() => this.setState({openOriginalChoresModal: true})}/>
                                    <Button content='סידור נוכחי'
                                            color={!this.state.openOriginalChoresModal ? 'blue' : 'light-grey'}
                                            onClick={() => this.setState({openOriginalChoresModal: false})}/>
                                    {this.state.openOriginalChoresModal === false ?
                                        <ChoresCalendar
                                            events={this.state.userChores}
                                            //getUserChoresForType={this.getUserChoresForType}
                                            onSelectSlot={this.onSelectSlot}
                                            usersOfType={this.state.users}
                                            settings={this.state.settings}
                                            createUserChores={this.createUserChores}
                                            deleteUserChore={this.deleteUserChore}
                                            createUserChoreResult={this.state.createUserChoreResult}
                                            handleClosePortal={this.handleClosePortal}
                                            choreTypeName={this.state.choreTypeSelected}
                                            serviceProviderHeaders={serviceProviderHeaders}
                                            serviceProviderId={serviceProviderId}
                                            onDraggedUser={this.onDraggedUser}
                                            userchoreDeleted = {this.state.userchoreDeleted}
                                            errorMessageDeleting = {this.state.errorMessageDeleting}
                                        />
                                        :

                                        <OriginChoresCalendar
                                            events={this.state.originalUserChores}
                                            //getUserChoresForType={this.getUserChoresForType}
                                            onSelectSlot={this.onSelectSlot}
                                            usersOfType={this.state.users}
                                            settings={this.state.settings}
                                            createUserChores={this.createUserChores}
                                            deleteUserChore={this.deleteUserChore}
                                            createUserChoreResult={this.state.createUserChoreResult}
                                            handleClosePortal={this.handleClosePortal}
                                            choreTypeName={this.state.choreTypeSelected}
                                            serviceProviderHeaders={serviceProviderHeaders}
                                            serviceProviderId={serviceProviderId}
                                            onDraggedUser={this.onDraggedUser}
                                            errorMessageDeleting = {this.state.errorMessageDeleting}
                                        />
                                    }


                                    {<UsersInTypeModal
                                        isOpenModalUsers={this.state.isOpenModalUsers}
                                        openModalUsers = {this.openModalUsers}
                                        choreTypeSelected = {this.state.choreTypeSelected}
                                        deleteUserFromChoreType = {this.deleteUserFromChoreType}
                                        //addUserToChoreType = {this.addUserToChoreType}
                                        usersToAddToType = {(usersToAdd)=>this.setState({usersToAddToType:usersToAdd})}
                                        usersInType = {this.state.users}
                                    />}
                                </div>
                            }
                        </div>
                    </div>
                    : <div></div>}

                <Modal open={this.state.openModal}>
                    <Modal.Header>{this.state.contentModal}</Modal.Header>
                    <Button content='אישור' positive onClick={this.handleClosePortal}
                    />

                </Modal>
                <div>

                    <Switch>
                        <Route exec path={`${this.props.match.path}/settings`}
                               render={(props) => (
                                   <ChoreSettings {...props}
                                                  openModalRequest={(content) => this.openModalRequest(content)}
                                                  settings={this.state.settings}
                                                  onUpdateSettings={this.onUpdateSettings}
                                                  onDeleteType={(type) => this.onDeleteType(type)}
                                   />
                               )}/>
                        <Route exec path={`${this.props.match.path}/newChoreType`}
                               render={(props) => (
                                   <CreateNewChoreType {...props}
                                                       openModalRequest={(content) => this.openModalRequest(content)}
                                                       onCreateChoreType={(type) => this.onCreateChoreType(type)}

                                   />
                               )}/>/>
                        {/*<Redirect to={`${this.props.match.path}`}/>*/}
                    </Switch>
                   {/* {this.state.showHistoryTable === false ?
                        <DraggableUser usersInType={this.state.users}
                                       createUserChores={this.createUserChores}
                                       onDraggedUser={this.onDraggedUser}
                        />
                        :
                        <div></div>
                    }*/}
                </div>

            </Page>

        );
    }
}

export default ChoresManagementPage
