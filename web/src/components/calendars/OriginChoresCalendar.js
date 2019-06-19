import React, {Component} from "react";
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/locale/he.js';

import moment from 'moment';
import 'moment/min/moment.min';

import {Button, Header, Icon, Menu, Table, Modal, Select, Label,Portal,Segment,Grid} from 'semantic-ui-react';
import helpers from "../../shared/helpers";
import choresStorage from "../../storage/choresStorage";
import {WEB_SOCKET} from "../../shared/constants"
import {connectToServerSocket} from "../../shared/constants";
import Axios from "axios";
import axios from "axios";
import ShabatonsStyles from './ShabatonsStyles.css'

const $ = require('jquery');
// import "jquery-ui-dist/jquery-ui.min.css";
// import "jquery-ui-dist/jquery-ui.min";

// import './bootstrap.min.css';

window.jQuery = $;
require('jquery-ui/ui/version');
require('jquery-ui/ui/plugin');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/widgets/mouse');
require('jquery-ui/ui/widgets/resizable');
require("jquery-ui/ui/widgets/draggable");
require("jquery-ui/ui/widgets/droppable");


export default class OriginChoresCalendar extends Component {
    constructor(props) {
        super(props);
        this.jq = $.noConflict();
        this.calendarDisplay = this.props.calendarDisplay;
        this.fullcalendarConfig = {
            events: [],
            height: 630,
            header: {
                left: 'next,prev',
                center: 'title',
                right: 'month'
                //right: 'month,basicWeek,basicDay,agendaWeek,agendaDay,listWeek',
            },
            // themeSystem:'bootstrap4',
            isRTL: true,
            displayEventTime: true,
            displayEventEnd: true,
            navLinks: true, // can click day/week names to navigate view,
            eventResizableFromStart: true,
            eventLimit: true, // allow "more" link when too many event,
            eventLimitClick: 'popover',
            weekNumbers: false,
            slotEventOverlap: true, //maybe false,
            nowIndicator: true,
            now: moment(),
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            dragRevertDuration: 500,
            dragOpacity: .75,
            dragScroll: true,
            drop: null,

            eventClick: null,
            select: null,
            selectable: true,
            selectMirror: true,
            unselectAuto: true,
            eventDrop: null,
            

            eventReceive: function (event) {
                console.log('event, ' + event.title + ', was added, (need date here)');
                console.log('eventReceive function');
                props.onDraggedUser(event, "dayEvent", event.target);
            },

            eventResize: null,

            timezone: 'local',

            handleWindowResize: true,
            windowResizeDelay: 200,
        };
        this.state={
            openModal: false,
            modalDate: '',
            settings:'',
            usersChoosed: [],
            openPortal: false,
            portalContent:'',
            portalUserChoresCreated: false,
            usersChoosedNames:[],
            calendarDisplay: this.props.calendarDisplay,
            choreTypeName: props.choreTypeName,
            userschores:[],
            workersToChooseContent:"",
            errorMessageDeleting:this.props.errorMessageDeleting,
            getUsersChoresErrorMessage:"",
            
        };

        this.root = null;
        this.onSelectSlot=this.onSelectSlot.bind(this);
        this.workersToChoose = this.workersToChoose.bind(this);
        this.handleWorkerChange = this.handleWorkerChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createUserChoresRequest = this.createUserChoresRequest.bind(this);
        this.getUserschoresForType = this.getUserschoresForType.bind(this);
        this.onDropEvent = this.onDropEvent.bind(this);
        this.deleteUserChore = this.deleteUserChore.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.fullcalendarConfig.events = nextProps.events;
        this.workersToChoose();

        this.jq('#calendar').fullCalendar('removeEvents');
        this.jq('#calendar').fullCalendar('addEventSource', nextProps.events);
        this.setState({errorMessageDeleting:this.props.errorMessageDeleting});
    }
    componentWillMount(){
        this.getUserschoresForType();
        // this.jq('#calendar').fullCalendar('removeEvents');
        // this.jq('#calendar').fullCalendar('addEventSource', this.state.userschores);
        console.log("kkkkkkkkkkkkkkkkkkkkkkk")
    }


    componentWillUnmount(){
        WEB_SOCKET.off("getChangeInUserChores");
    }


    getUserschoresForType() {
        let usrChores = [];
        choresStorage.getUserChoresForType(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreTypeName)
            .then(res => {
                if((res &&res!==undefined && res.status!==200)){
                    this.setState({getUsersChoresErrorMessage:"אירעה בעיה בטעינת התורנויות, נסה לרענן את העמוד"})
                }
                else{
                    usrChores = res.data.usersChores.map(e=> {e.title = e.User.fullname;e.date=e.originDate; return e;});
                    this.setState({
                        settings: this.props.settings,
                        userschores: usrChores,
                        getUsersChoresErrorMessage:"",
                    });
                    this.forceUpdate();
                    this.jq('#calendar').fullCalendar('removeEvents');
                    this.jq('#calendar').fullCalendar('addEventSource', this.state.userschores);
                }
            })
            .catch(e => {
                
            })
            return usrChores;
    }

    onDropEvent(event) {
        let usersChoosed = [];
        usersChoosed.push(event.User.userId);
        let usersChoosedNames = [];
        usersChoosedNames.push(event.User.fullname);
        console.log("on dropinggggg-", moment(event.start._d).format('DD-MM-YYYY'), usersChoosedNames, usersChoosed, event)
        let reqs = [];
        reqs.push(this.props.deleteUserChore(event, {choreId: event.userChoreId}));
        reqs.push(this.createUserChoresRequest(event, {
            usersChoosed: [event.User.userId],
            usersChoosedNames: [event.User.fullname],
            date: event.start._d
        }));
        axios.all(reqs).then(res => {
            this.jq('#calendar').fullCalendar( 'addEvent',{
                allDay: false,
                date: res[1].data.newUserChore.originDate,
                originDate: res[1].data.newUserChore.originDate,
                endTime: this.state.settings.endTime,
                startTime: this.state.settings.startTime,
                id: res[1].data.newUserChore.userChoreId,
                isMark: false,
                title:  res[1].data.newUserChore.User.fullname,
                user: res[1].data.newUserChore.User,
                User: res[1].data.newUserChore.User,
                userChore: res[1].data.newUserChore,
            } )
            
        })
    }



    componentDidMount() {
        this.fullcalendarConfig.events = this.props.events;
        this.fullcalendarConfig.select = this.onSelectSlot;
        this.fullcalendarConfig.droppable = true;
        this.fullcalendarConfig.eventDrop = this.onDropEvent;
        connectToServerSocket(this.props.serviceProviderId);

        this.jq('#calendar').fullCalendar(this.fullcalendarConfig);

        $('#calendar').droppable();
        this.jq('#calendar').droppable();
    }

    onSelectSlot(e) {
        this.setState({openModal: true, modalDate: e});
        this.forceUpdate();
        this.workersToChoose();
    }

    handleWorkerChange(event, {name}) {
        let workers = this.state.usersChoosed;
        let workersNames = this.state.usersChoosedNames;
        if (workers.indexOf(event.target.id) < 0) {
            workers[name] = event.target.id;
            workersNames[name] = event.target.innerText;
            this.setState({usersChoosed: workers, usersChoosedNames: workersNames});

        } else {
            this.setState({openPortal: true, portalContent: 'לא ניתן לבחור אותו תורן פעמיים'})
        }

    }

    createUserChoresRequest(e, {usersChoosed, usersChoosedNames, date}) {
        this.forceUpdate();
        let users = usersChoosed;
        let usersNames = usersChoosedNames;
        if (usersChoosed && usersChoosed.length === 0) {
            users = this.state.usersChoosed
            usersNames = this.state.usersChoosedNames;
        }
        this.props.createUserChores(e, users, usersNames, date);
        this.setState({usersChoosed: [], usersChoosedNames: []});
        
    }

    deleteUserChore(e, {choreId}){
        this.props.deleteUserChore(e, {choreId});
        this.setState({userschores:this.state.userschores.filter(el=>el.userChoreId!==choreId)});
       
    }

    workersToChoose(){
        let event = this.state.modalDate;
        this.getUserschoresForType();
        let ans = [];
        let past = moment(event).isBefore(moment().format('YYYY-MM-DD'));
        let settings = this.props.settings;
        let usrChores = this.state.userschores;

        let workersDay = [];
        usrChores.map(chore=> { if(moment(chore.originDate).format('DD-MM-YYYY')===(moment(event).format('DD-MM-YYYY'))){ workersDay.push(chore)}});
        if(past){
            ans.push(<Header>תורנים:</Header>);
            let j=0;
            for( j=0;j<workersDay.length;j++){
                ans.push(<h4><br/>{workersDay[j].User.fullname}&nbsp;&nbsp;&nbsp;&nbsp; <br/></h4>);
            }
        }
        else
        {
            ans.push(<Header>יש לבחור {String(this.props.settings.numberOfWorkers)} תורנים:</Header>);
            let j=0;
            for( j=0;j<workersDay.length;j++){
                ans.push(<h4><br/>{workersDay[j].User.fullname}&nbsp;&nbsp;&nbsp;&nbsp; <Button choreId={workersDay[j].userChoreId} onClick={this.props.deleteUserChore}>הסר תורן</Button><br/></h4>)
            }
            if(this.state.errorMessageDeleting!==""){
                ans.push(<p style={{color:'red'}}>{this.state.errorMessageDeleting}</p>)
            }

            var loopTimes = (this.props.settings.numberOfWorkers)-j;
            if(loopTimes<0){
                loopTimes = 0;
            }
            let usersOfType = this.props.usersOfType;
            let usersOfType1 = [];
            let j1 = 0 ;
            for(j=0; j<workersDay.length ; j++){
                for( j1=0; j1<usersOfType.length;j1++){
                    if(usersOfType[j1].id !==workersDay[j].User.userId){
                        usersOfType1.push(usersOfType[j1]);
                    }
                }
            }
            if(workersDay.length===0){
                usersOfType1 = usersOfType;
            }
            for(var i=0;i<loopTimes;i++){
                ans.push(<Select search placeholder='בחר תורן' options={usersOfType1}
                onChange={this.handleWorkerChange}  name={i}
                />);
            }
            if(loopTimes===0){
                ans.push( <Button disabled positive onClick={this.props.createUserChores}  usersChoosed={this.state.usersChoosed} usersChoosedNames={this.state.usersChoosedNames} date={this.state.modalDate}>קבע תורנות עבור המשתמשים</Button>);
            }
            else{
                ans.push( <Button  positive onClick={this.createUserChoresRequest}  usersChoosed={this.state.usersChoosed} usersChoosedNames={this.state.usersChoosedNames} date={this.state.modalDate}>קבע תורנות עבור המשתמשים</Button>);
            }
    }
        ans.push(<Button onClick={this.closeModal} >סגור</Button>);
        this.setState({workersToChooseContent: <Table.Body>{ans}</Table.Body>})
        return <Table.Body >{ans}</Table.Body>
    }

    closeModal(){
        this.setState({openModal:false, usersChoosed:[], usersChoosedNames:[] , errorMessageDeleting:""});
        this.forceUpdate();
    }



    

    render() {

    return (
 <div>
           
        
    <div id='calendar' >
                    <Header>{this.props.match}</Header>
                    
                    <Button icon
                                onClick={() => helpers.exportToPDF('MeshekleAppointmentsCalendar', 'calendar', 'landscape')}>
                                <Icon name="file pdf outline"/>
                                &nbsp;&nbsp;
                                יצא לPDF
                            </Button>
                            <Modal id="calendarModal" open={this.state.openModal}>
                        <Modal.Header> תורנות
                            ליום {String(moment(this.state.modalDate).format("dddd : DD-MM-YYYY"))}</Modal.Header>
                        <Modal.Content>

                            {this.state.workersToChooseContent}

                        </Modal.Content>
                    </Modal>
  {this.props.createUserChoreResult.name==='portalUserChoresCreated' ?
      <Grid columns={2}>
        <Grid.Column>
      <Portal name='portalUserChoresCreated' onClose={this.handleClosePortal} open={true}>
            <Segment
              style={{
                left: '40%',
                position: 'fixed',
                top: '50%',
                zIndex: 1000,
              }}
            >
              <Header>!הפעולה בוצעה בהצלחה</Header>
              <p>תורנויות עבור:{this.props.createUserChoreResult.users} נוספו למערכת</p>
              <p style={{color:'red'}}>{this.props.createUserChoreResult.reqFaild}</p>
              <Button
                content='אישור'
                positive
                onClick={this.props.handleClosePortal}
              />
            </Segment>
          </Portal>

        </Grid.Column>
      </Grid>
:
<div> <Grid columns={2}>
                            <Grid.Column>
                                <Portal name='portalUserChoresFaild' onClose={this.handleClosePortal} open={this.props.createUserChoreResult.name==='portalUserChoresFaild'}>
                                    <Segment
                                        style={{
                                            left: '40%',
                                            position: 'fixed',
                                            top: '50%',
                                            zIndex: 1000,
                                        }}
                                    >
                                        <Header>!הפעולה נכשלה</Header>
                                        <Button
                                            content='אישור'
                                            positive
                                            onClick={this.props.handleClosePortal}
                                        />
                                    </Segment>
                                </Portal>

                            </Grid.Column>
                        </Grid></div>
      }
      {this.state.openPortal ?
        <Portal  onClose={()=>{this.setState({openPortal:false,portalContent:''})}} open={true}>
            <Segment
              style={{
                left: '40%',
                position: 'fixed',
                top: '50%',
                zIndex: 1000,
              }}
            >
              <Header>{this.state.portalContent}</Header>

              <Button
                content='אישור'
                positive
                onClick={()=>{this.setState({openPortal:false,portalContent:''})}}
              />
            </Segment>
          </Portal>
          :
          <div></div>

      }
      </div>  
</div>
            );
    }
}