import React from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Icon, Menu, Table, Modal, Label, List, View, Checkbox, Dropdown} from 'semantic-ui-react';
import store from 'store';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import strings from "../../shared/strings";
import choresStorage from "../../storage/choresStorage";
import usersStorage from "../../storage/usersStorage";
import { Select } from 'semantic-ui-react'
import ChoreSettings from "./ChoreSettings";
import CreateNewChoreType from "../../components/chores/CreateNewChoreType";
import {Redirect, Route, Switch} from "react-router-dom";
import ChoresCalendar from "../../components/calendars/ChoresCalendar"
import moment from 'moment';
import axios from "axios";
import EditChoreTypeSettings from '../../components/chores/EditChoreTypeSettings';
import ReplacementRequests from '../../components/chores/ReplacementRequests';
//import {CheckBox, FormInput, FormLabel, Text} from "react-native-elements";


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
            settings:'',
            userChores:[/*{
                "userId": "1",
                "choreTypeName": "שמירה",
                "date": "2019-03-20T22:00:00.000Z",
                "isMark": false
            }*/],
            createUserChoreResult:{
                name:'',
                users:[],
            },
            isOpenModalUsers:false,
            usersToAddToType: [],
            userNameToAddToType:[],
            usersNotInType:[],
            openModal:false,
            contentModal:'',
            calendarDisplay:'calendar',
            requestsReplaced:[],
            choreTypeName: '',
        };

        
        
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
       


        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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
        this.modalUsersBuild = this.modalUsersBuild.bind(this);
        this.handleUserToAddChange = this.handleUserToAddChange.bind(this);
        this.handleUserToAdd = this.handleUserToAdd.bind(this);
        this.addUserToChoreType = this.addUserToChoreType.bind(this);
        this.openModalRequest = this.openModalRequest.bind(this);
        this.onDeleteType = this.onDeleteType.bind(this);
    }

    componentWillMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        choresStorage.getAllChoreTypes(serviceProviderId, serviceProviderHeaders)
        .then(response => {
            let choreTypes = response;
             choreTypesOptions = choreTypes.map(item => ({
                key: item.choreTypeName,
                text: item.choreTypeName,
                value: item.choreTypeName,
            }));
            this.setState({choreTypesOptions: choreTypesOptions});
            console.log("this.state.chorestypes options = ", this.state.choreTypesOptions)
        });
        
    }
    
    componentDidMount() {
        
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');

       
    }

    componentWillReceiveProps({location = {}}) {
        /*if (location.pathname === '/phoneBook' && location.pathname !== this.props.location.pathname) {
            this.getUsers();
        }*/
    }

    /*getUsers() {
        usersStorage.getUsers()
            .then((response) => {

                const users = response;
                const totalPages = Math.ceil(users.length / TOTAL_PER_PAGE);

                this.setState({
                    users: users,
                    page: 0,
                    totalPages,
                });
            });
    }*/

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
        /*const {users} = this.state;

        this.setState({
            users: users.filter(u => u.id !== userId),
        });*/
    }

    getUserByUserID(userId) {
        usersStorage.getUserByUserID(userId, this.serviceProviderHeaders)
            .then((response) => {
                let user = response.data[0];
                console.log('getUserByUserID ', userId, ' ', user);
                this.props.history.push(`/users/${userId}`);
            })
    }

    handleChange(event){
        let typeName = String(event.nativeEvent.srcElement.innerText);
        this.setState({choreTypeSelected: typeName});
        console.log("option selectef: ", event.nativeEvent.srcElement.innerText, typeName/*currentTargetthis.state.choreTypeSelected*/);
        console.log("this.state.choreTypeSelected: ", this.state.choreTypeSelected);
        this.settingsView( event.nativeEvent.srcElement.innerText); 
        this.onSelectSlot(event,event.nativeEvent.srcElement.innerText);
        
    }

    settingsView(type){
        choresStorage.getChoreTypeSetting(serviceProviderId, serviceProviderHeaders, type)
        .then(settings=>{
            console.log("settings: ", settings);
            this.setState({settings: settings.data.type});
        });
    }

    toEditSettings(){
        this.props.history.push("/settings");
    } 

    getUserChoresForType(type) {
        console.log("in GETUSERCHORESFORTYPE: type:", type);
          choresStorage.getUserChoresForType(this.serviceProviderId, serviceProviderHeaders, type )
         .then(res=>{
            console.log("in GETUSERCHORESFORTYPE: res:", res);

             return res.data
         })
            /*.then((response) => {
                this.setState({userChores: []});

                const userChores = response.data;
                const totalPages = Math.ceil(userChores.length / TOTAL_PER_PAGE);

                userChores.map((userchore, index) => {
                    usersStorage.getUserByUserID(userchore.userId, this.serviceProviderHeaders)
                        .then(user => {
                            let userChoreEvent = {};
                            userchore.userName = user.fullname;

                            userChoreEvent.id = userchore.userChoreId;
                            userChoreEvent.title = user.fullname;
                            userChoreEvent.allDay = false;
                            userChoreEvent.start = moment(this.state.settings.startTime);
                            userChoreEvent.end = moment(this.state.settings.endTime);
                            userChoreEvent.userChore = userchore;

                            let userChoreEvents = this.state.userChores;
                            userChoreEvents.push(userChoreEvent);
                            this.setState({
                                userChores: userChoreEvents
                            });
                        });
                });

                this.setState({
                    page: 0,
                    totalPages,
                });

            });*/
    }

    /*onSelectSlot(event){
        console.log("this.state.choreTypeSelected= = ", this.state.choreTypeSelected, event.target.innerText)
        choresStorage.getUsersForChoreType(serviceProviderId, serviceProviderHeaders, event.target.innerText)
        .then(res=>{
            console.log("response:",res);
            var usersDoType = [];
            var user;
            for( user in res.data.usersChoreType){
                usersDoType.push(res.data.usersChoreType[user].User);
            };
            usersDoType = usersDoType.map(u=>({
                key:user,
                text: u.fullname,
                value: u.fullname,
                id: u.userId
            }));
            this.setState({users:usersDoType});
            console.log("this.state.users:",this.state.users, usersDoType );

            
        });
    }*/

    
    onSelectSlot(event, typeName){
        console.log("this.state.choreTypeSelected= = ", typeName)
        axios.all([choresStorage.getUsersForChoreType(serviceProviderId, serviceProviderHeaders, typeName),//event.target.innerText), 
            choresStorage.getUserChoresForType(this.serviceProviderId, this.serviceProviderHeaders,typeName),
            choresStorage.getReplacementRequests(this.serviceProviderId, this.serviceProviderHeaders, typeName, 'replaced')
        ])// event.target.innerText )])
        //.then(axios.spread(function (acct, perms){
            //console.log("response:",acct.data, perms, this.state.userChores);
            /*var usersDoType = [];
            var user;
            for( user in res.data.usersChoreType){
                usersDoType.push(res.data.usersChoreType[user].User);
            };
            usersDoType = usersDoType.map(u=>({
                key:user,
                text: u.fullname,
                value: u.fullname,
                id: u.userId
            }));
            this.setState({users:usersDoType});
            console.log("this.state.users:",this.state.users, usersDoType );*/

       // }));
       .then(reses=>{
           console.log("responses: ", reses)
           var usersDoType = [];
            var user;
            for( user in reses[0].data.usersChoreType){
                usersDoType.push(reses[0].data.usersChoreType[user].User);
            };
            usersDoType = usersDoType.map(u=>({
                key:user,
                text: u.fullname,
                value: u.fullname,
                id: u.userId
            }));
            this.setState({users:usersDoType});
            //reses[1]
            //this.setState({userChores: []});

                const userChores = reses[1].data.usersChores;
                console.log("reses[1].data:", reses[1].data.usersChores);
                const totalPages = Math.ceil(userChores.length / TOTAL_PER_PAGE);
                let userChoreEvents =[];
                userChores.map((userchore, index) => {
                            let userChoreEvent = {
                                user: null,
                                id: 1000,
                                title:'',
                                start:'',
                                end:'',
                                userChore:null,
                                date:Date.now(),
                                originDate:Date.now(),
                                isMark: false,
                            };
                            //userchore.userName = user.fullname;
                            userChoreEvent.user = userchore.User;
                            userChoreEvent.id = userchore.userChoreId;
                            userChoreEvent.title = userchore.User.fullname;
                            userChoreEvent.allDay = false;
                            userChoreEvent.startTime = this.state.settings.startTime;
                            userChoreEvent.endTime = this.state.settings.endTime;
                            userChoreEvent.userChore = userchore;
                            userChoreEvent.date = userchore.date;
                            userChoreEvent.originDate = userchore.originDate;
                            userChoreEvent.isMark = userchore.isMark;

                            //let userChoreEvents = this.state.userChores;
                            userChoreEvents.push(userChoreEvent);
                            console.log("userChoreEvents and this.state...,", userChoreEvents, this.state.userChores);
                            /*this.setState({
                                userChores: userChoreEvents
                            });*/
                        
                    });

                    //reses[2]
                    let requestsReplaced = [];
                    reses[2].data.requests.map(re=>{
                        if(re.choreOfSender.choreTypeName===typeName){
                            requestsReplaced.push(re);
                        }
                    })

                this.setState({
                    userChores: userChoreEvents,
                    /*userChores: [{
                        "userId": "1",
                        "choreTypeName": "שמירה",
                        "date": "2019-03-20T00:00:00.000Z",
                        "isMark": false
                    }],*/
                    requestsReplaced:requestsReplaced,
                    page: 0,
                    totalPages,
                });

       });
    }

    createUserChores(event,usersChoosed, usersChoosedNames, date){// {usersChoosed, usersChoosedNames, date}){
        console.log("userschoosed: and event", usersChoosed, moment(date).format('YYYY-MM-DD'));
        let requests = [];
        let i =0;
        for(i in usersChoosed){
            requests.push(choresStorage.createNewUserChore(serviceProviderId, this.serviceProviderHeaders, this.state.settings.choreTypeName, usersChoosed[i], moment(date).format('YYYY-MM-DD')));
        }
        axios.all(requests)
        //axios.all(choresStorage.createNewUserChore(serviceProviderId, serviceProviderHeaders, this.state.settings.choreTypeName, usersChoosed[0], moment(date).format('YYYY-MM-DD')),
        //choresStorage.createNewUserChore(serviceProviderId, serviceProviderHeaders, this.state.settings.choreTypeName, usersChoosed[1], moment(date).format('YYYY-MM-DD'))
    //)
        .then(res=>{
            console.log("userschores created?: ", res);
            var workUsers = [];
            var index;
            var resultUsers = '';
            let chore = 0;
            let getUsersRequests = [];
            for( chore in res){
                console.log("chore: ",res[chore]===undefined);
                if(res[chore]!==undefined){
                    index= usersChoosed.indexOf(res[chore].data.newUserChore.userId);
                    console.log("res.data[chore].newUserChore: ",res[chore].data.newUserChore.userId);
                    console.log("index: ",index, usersChoosedNames[index]);
                    resultUsers= resultUsers+', '+usersChoosedNames[index];
                    getUsersRequests.push(usersStorage.getUserByUserID(res[chore].data.newUserChore.userId, this.serviceProviderHeaders));
                    //creat event to userchore was added:
                    getUsersRequests.push(choresStorage.createUserchoreEvent(serviceProviderId, serviceProviderHeaders,  res[chore].data.newUserChore.userId, res[chore].data.newUserChore.userChoreId));

                }
            }
            console.log("getUsersRequests:",getUsersRequests);
            axios.all(getUsersRequests)
            .then((response) => {
                let updateUserchores = this.state.userChores;
                let r = 0;
                for(r in response){
                    let user = response[r];
                    if(user.fullname!==undefined){
                        console.log('getUserByUserID ', response[r]);
                        updateUserchores.push(
                            {
                                allDay:false,
                                date:res[chore].data.newUserChore.date,
                                endTime:this.state.settings.endTime,
                                startTime:this.state.settings.startTime,
                                id: res[chore].data.newUserChore.userChoreId,
                                isMark:false,
                                title: user.fullname,
                                user: user,
                                userChore:res[chore].data.newUserChore,
                            });
    
                    }

                    }
                this.setState({userChores: updateUserchores});
                this.forceUpdate();
            })
            if(resultUsers===''){
                this.setState({createUserChoreResult: {name:'portalNeedToDeleteUserChores', users:resultUsers}});
            }
            else{
                this.setState({createUserChoreResult: {name:'portalUserChoresCreated', users:resultUsers}});
            }
        });
    }

    deleteUserChore(e, {choreId, refresh}){
        console.log("deleteUserChore", e.target, refresh);
        choresStorage.deleteUserChore(serviceProviderId, serviceProviderHeaders, choreId)
        .then(res=>{
            //this.onSelectSlot(e);
            //ChoresCalendar.workersToChoose(e);
            let updateUserchores = this.state.userChores.filter(el=>el.id!==choreId )
            this.setState({userChores: updateUserchores});
            console.log("response of delete ", res, this.state.userChores, this.state.updateUserchores);
        })
    }

    handleClosePortal(){
        this.setState({openModal:false,
            contentModal:"",
            createUserChoreResult: {
            name:'',
            users:'',
        }});
    }

    onUpdateSettings(newUpdatedSettings){
        console.log ("onUpdateSettings: ", newUpdatedSettings);
        this.setState({settings:newUpdatedSettings});
    }

    onCreateChoreType(settings){
        console.log ("onCreateChoreType: ", settings);
        let types = this.state.choreTypesOptions;
        types.push({
            key: settings.choreTypeName,
            text: settings.choreTypeName,
            value: settings.choreTypeName,
        })
        this.setState({choreTypesOptions:types});
    }

    openModalUsers(e, {value}){
        this.setState({isOpenModalUsers:value});
    }

    deleteUserFromChoreType(e, {userId}){
        choresStorage.deleteUserFromChoreType(serviceProviderId, serviceProviderHeaders,userId, this.state.choreTypeSelected)
        .then(res=>{
            console.log("response deleteUserFromChoreType", res);
            if(res!==undefined){
                let usersInType= this.state.users;
                let usersNotInType = this.state.usersNotInType;
                let ur =0;
                for(ur in usersInType){
                    if(usersInType[ur].id===userId){
                        let removed= usersInType.splice(ur,1);
                        usersNotInType.push(removed[0]);
                        console.log("removed :",removed[0]);
                    }
                }
                this.setState({users:usersInType, usersNotInType:usersNotInType });
                //this.modalUsersBuild();
            }
            else{
                this.setState({openModal:true, contentModal:'לא ניתן להסיר משתמש מהתורנות מאחר ויש לו תורנויות עתידיות. \n יש למחוק אותן תחילה.'});
            }
        });
    }

    addUserToChoreType(e, {userId}){
        console.log("this.state.userToAddToType: ", this.state.usersToAddToType);
        let addUsersRequests = [];
        let usersToAdd = usersToAddToType//this.state.usersToAddToType;
        let user = 0;
        for(user in usersToAdd){
            addUsersRequests.push(choresStorage.addUserToChoreType(serviceProviderId, serviceProviderHeaders,usersToAdd[user], this.state.choreTypeSelected));
        }
        axios.all(addUsersRequests)
        .then(res=>{
            console.log("response addUserToChoreType", res[0].data);
            let usersInType= this.state.users;
            let usersNotInType = this.state.usersNotInType;
            console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeereere1", usersNotInType);
            let ur =0;
            let userAdded = 0;
            let usersAdded = usersToAddToType//this.state.usersToAddToType;
            for (userAdded in usersAdded){
            for(ur in usersNotInType){
                if(usersNotInType[ur].id===usersAdded[userAdded]){
                    console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeereere2")
                    let added= usersNotInType.splice(ur,1);
                   usersInType.push(added[0]);
                    console.log("added :",added[0]);
                }
            }
        }
        this.setState({users:usersInType, usersNotInType:usersNotInType });
            //usersInType.push();
            usersToAddToType = [];
            //this.setState({users: usersInType});
        });
    }

    handleUserToAddChange(e, data){
        //console.log("handleUsertToAddChange user value",e.nativeEvent.currentTarget, "val:", value,  options, e, open)
        console.log("handleUsertToAddChange user value", e.target.id==='')
        //e.nativeEvent.srcElement.innerText = value[value.length-1];
        //let usersToAddToType = this.state.usersToAddToType;
        //let userNameToAddToType = this.state.userNameToAddToType;
        if(e.target.id!==''){
            usersToAddToType.push(e.target.id);
        }
        //userNameToAddToType.push(value);
        //this.setState({usersToAddToType: usersToAddToType,userNameToAddToType:e.target.innerText, usersNotInType:data.options});
    }

    handleUserToAdd(e, {userId}){
    }

    modalUsersBuild(){
        console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeereere0", this.state.usersNotInType);

        let usr = 0;
        let u = 0;
        let us = 0 ;
        let users = this.state.users;
        let content = [];
        let allUsers=[];
        let usersInType= this.state.users;
        let usersInTypeNames=[];
        let usersNotInType=[];
        for(us in usersInType){
            usersInTypeNames.push(usersInType[us].text);
        }
        u=0;
        usersStorage.getUsers()
        .then(res=>{
            allUsers = res;
            console.log("responst getallusers:", usersInType, this.state.users, res)
            for(u in res){
                if(usersInTypeNames.indexOf(allUsers[u].fullname)<0){
                    usersNotInType.push({id: allUsers[u].userId, key:"1", text:allUsers[u].fullname, value:allUsers[u].fullname });
                }
                
                console.log("user: ", res[u],"is in type?", usersInTypeNames.indexOf(res[u].fullname), res[u].fullname);
            }

            this.setState({usersNotInType:usersNotInType});
        });
            content.push(<Dropdown multiple search fluid  selection placeholder='בחר משתמש להוספה' options={this.state.usersNotInType}
              labeled text ={this.state.userNameToAddToType} scrolling onChange={this.handleUserToAddChange}
             />);
             content.push(<Button onClick={this.addUserToChoreType}>הוסף</Button>);
             content.push(<br/>)
        for(usr in usersInType){
            content.push(<Label userId={users[usr].id} name={usr} onClick={this.deleteUserFromChoreType}>{users[usr].value}  </Label>)
        }
        content.push(<br/>)
        content.push(<h5 >יש ללחוץ על משתמש להסרתו מסוג תורנות</h5>)
        return (<div>{content}</div>)
    }

    openModalRequest(content){
        this.setState({openModal:true,contentModal:content});
        this.forceUpdate();
    }

    onDeleteType(){
        choresStorage.getAllChoreTypes(serviceProviderId, serviceProviderHeaders)
        .then(response => {
            let choreTypes = response;
             choreTypesOptions = choreTypes.map(item => ({
                key: item.choreTypeName,
                text: item.choreTypeName,
                value: item.choreTypeName,
            }));
            this.setState({choreTypesOptions: choreTypesOptions});
        })
    }

    render() {
        const {users, page, totalPages, choreTypesOptions, choreTypeSelected, userChores} = this.state;
        const startIndex = page * TOTAL_PER_PAGE;
        
        return (
            <Page children={users} title={strings.mainPageStrings.CHORES_PAGE_TITLE}>
                <Helmet>
                    <title>Meshekle | ניהול תורנויות</title>
                </Helmet>
                {!(String(window.location).includes('settings')||String(window.location).includes('newChoreType'))?//String(window.location)==='http://localhost:3000/chores'?
                <div>
                <Header>{/*String(window.location)*/}</Header>
                <Select search placeholder='בחר סוג תורנות' options={this.state.choreTypesOptions}
                onChange={this.handleChange} /*value={this.state.choreTypeSelected}*/
                 />
                 <Button onClick={() => this.props.history.push(`${this.props.match.path}/newChoreType`)}  positive>{"צור סוג תורנות חדש"}</Button>
                 
                 {this.state.choreTypeSelected === '' ?
                    <Header as={'h4'}> בחר סוג תורנות </Header>
                    :
                    <div>
                    {/*this.onSelectSlot()*/}
                    <Button onClick={() =>{/*this.setState({calendarDisplay:''});this.forceUpdate();*/this.props.history.push(`${this.props.match.path}/settings`,{settings: this.state.settings,/*onUpdateSettings:this.onUpdateSettings*/})}}  >{"הגדרות"}</Button>
                   <Button value={true} onClick={this.openModalUsers}>עריכת תורנים</Button>
                   <Button onClick={() =>{this.setState({openModal:true, contentModal:<ReplacementRequests
                                                                                        serviceProviderId= {this.serviceProviderId}
                                                                                        serviceProviderHeaders = {this.serviceProviderHeaders}
                                                                                        choreType = {this.state.choreTypeSelected}
                                                                                        requestsReplaced = {this.state.requestsReplaced}
                                                                                        ></ReplacementRequests>})}}  >{"בקשות החלפה"}</Button>
                   {/*this.getUserChoresForType*/}
                   <ChoresCalendar 
                        events={this.state.userChores}
                        getUserChoresForType={this.getUserChoresForType}
                        onSelectSlot= {this.onSelectSlot}
                        usersOfType={this.state.users}
                        settings = {this.state.settings}
                        createUserChores = {this.createUserChores}
                        deleteUserChore = {this.deleteUserChore}
                        createUserChoreResult = {this.state.createUserChoreResult}
                        handleClosePortal = {this.handleClosePortal}
                        choreTypeName = {this.state.choreTypeSelected}
                        serviceProviderHeaders = {serviceProviderHeaders}
                        serviceProviderId = {serviceProviderId}
                        //calendarDisplay = {this.state.calendarDisplay}
                        //calendarDisplay =  {String(window.location).includes("settings")? this.setState({calendarDisplay: ""}) : this.setState({calendarDisplay: "calendar"})}
                        //calendarDisplay =  {String(window.location).includes("settings")? "" :  "calendar"}

                        
                        />

                    <Modal  open= {this.state.isOpenModalUsers} >
                 <Modal.Header>עריכת תורנים עבור תורנות: {this.state.choreTypeSelected}
                 <Button  value={false} onClick={this.openModalUsers}>סגור</Button>
</Modal.Header>
                    <Modal.Content>
                     {this.state.isOpenModalUsers? this.modalUsersBuild(): <div></div>}
                       
                                            
                    </Modal.Content>
                </Modal>
                    </div>
                 }
                 </div>
            :<div></div>}

                <Modal open={this.state.openModal}>
                    <Modal.Header>{this.state.contentModal}</Modal.Header>
                    <Button content='אישור' positive onClick={this.handleClosePortal}
              />

                </Modal>
                 <div>
                 
                 <Switch>
                        <Route exec path={`${this.props.match.path}/settings`}
                               render={(props)=>(
                                   <ChoreSettings {...props}
                                   openModalRequest = {(content)=>this.openModalRequest(content)}
                                    settings = {this.state.settings}
                                    onUpdateSettings= {this.onUpdateSettings}
                                    onDeleteType = {(type)=>this.onDeleteType(type)}
                                   />
                               )}/>
                        <Route exec path={`${this.props.match.path}/newChoreType`}
                        render={(props)=>(
                                   <CreateNewChoreType {...props}
                                   openModalRequest = {(content)=>this.openModalRequest(content)}
                                   onCreateChoreType = {(type)=> this.onCreateChoreType(type)}
                                
                                   />
                               )}/>/>
                        <Redirect to={`${this.props.match.path}`}/>
                    </Switch>
                    {/*<Switch>
                        <Route exec path={`${this.props.match.path}/settings`}
                               component={ChoreSettings}/>
                        <Route exec path={`${this.props.match.path}/newChoreType`}
                        component={CreateNewChoreType}/>
                        <Redirect to={`${this.props.match.path}`}/>
                    </Switch>*/}
                </div>
            
            </Page>
        );
    }
}

export {ChoresManagementPage}
//CreateNewChoreType