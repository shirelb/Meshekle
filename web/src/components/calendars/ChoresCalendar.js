import React, {Component} from "react";
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/locale/he.js';

import moment from 'moment';
import 'moment/min/moment.min';

import $ from 'jquery';
import 'jquery/dist/jquery.min';
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";
import {Button, Header, Icon, Menu, Table, Modal, Select, Label,Portal,Segment,Grid} from 'semantic-ui-react';


// import "jquery-ui-dist/jquery-ui.min.css";
// import "jquery-ui-dist/jquery-ui.min";

// import './bootstrap.min.css';

export default class ChoresCalendar extends Component {
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
                right: '',
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
            },

           

            eventResize: null,

            timezone: 'local',

            handleWindowResize: true,
            windowResizeDelay: 200,
            //defaultView:''
        };
        this.state={
            openModal: false,
            modalDate: '',
            settings:'',
            usersChoosed: [],
            value:'',
            openPortal: false,
            portalContent:'',
            portalUserChoresCreated: false,
            portalNeedToDeleteUserChores:false,
            usersChoosedNames:[],
            calendarDisplay: this.props.calendarDisplay,
            
        }

        this.root = null;
        this.onSelectSlot=this.onSelectSlot.bind(this);
        this.workersToChoose = this.workersToChoose.bind(this);
        this.handleWorkerChange = this.handleWorkerChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createUserChoresRequest = this.createUserChoresRequest.bind(this);
        
        
    }

    componentWillReceiveProps(nextProps) {
        this.fullcalendarConfig.events = nextProps.events;
        this.calendarDisplay= nextProps.calendarDisplay;
        this.forceUpdate();
        this.jq('#calendar').fullCalendar('removeEvents');
        this.jq('#calendar').fullCalendar('addEventSource', nextProps.events);
    //console.log("this.fullcalendarConfig.events; ", this.fullcalendarConfig.events);
    }

    componentDidMount() {
        this.fullcalendarConfig.events = this.props.events;
        console.log("this.props.events;",this.props.events);
        this.fullcalendarConfig.select = this.onSelectSlot;
        this.setState({settings:this.props.settings});
        /*this.fullcalendarConfig.dayClick= function(event, jsEvent, view) {
            $('#calendarModal').modal('show');
        }*/
        /*this.fullcalendarConfig.eventClick = this.props.onSelectEvent;
        this.fullcalendarConfig.eventResize = this.props.updateAfterMoveOrResizeEvent;
        this.fullcalendarConfig.eventDrop = this.props.updateAfterMoveOrResizeEvent;
        this.fullcalendarConfig.eventReceive = this.props.onDropUserChore;//
        this.fullcalendarConfig.drop = function (date, jsEvent, ui, resourceId) {
            var appointmentRequestDropped = JSON.parse($(this).attr('data-event'));

            let startDateAndTime = moment(date);
            let endDateAndTime = moment(date).add(2, 'h');

            appointmentRequestDropped.start=startDateAndTime;
            appointmentRequestDropped.end=endDateAndTime;

            $('#calendar').fullCalendar('updateEvent', appointmentRequestDropped);
        };*/
        
        this.jq('#calendar').fullCalendar(this.fullcalendarConfig);
        
        console.log("calendarHandler");
        $('#calendar').droppable();
        this.jq('#calendar').droppable();
    }

    onSelectSlot(e){
        console.log("e:", e);
        this.setState({openModal: true, modalDate:e})
    }

    handleWorkerChange(event, {name}){
        console.log("in handle worker change", name, event._targetInst );
        let workers=this.state.usersChoosed;
        let workersNames=this.state.usersChoosedNames;
        if(workers.indexOf(event.target.id)<0){
            workers[name]=event.target.id;
            workersNames[name] = event.target.innerText;
            this.setState({usersChoosed:workers, usersChoosedNames:workersNames });
            console.log("workers= and usersChoosedNames",workers, workersNames );
            
        }
        else{
            //event.target.innerText = '';
            //event._targetInst.child = ''
            this.setState({openPortal:true, portalContent:'לא ניתן לבחור אותו תורן פעמיים'})
        }

    }

    createUserChoresRequest(e, {usersChoosed, usersChoosedNames, date}){
        this.forceUpdate();
        console.log("createUserChoresRequest ", this.state.usersChoosed, usersChoosed);
        this.props.createUserChores(e, this.state.usersChoosed, this.state.usersChoosedNames, date);
        //.then(res=>{
            this.setState({usersChoosed:[], usersChoosedNames:[]});
            console.log("back from create user chores request:", this.state.usersChoosed, this.state.usersChoosedNames)
        //})
    }

    workersToChoose(event){
        let ans = [];
        let past = moment(event).isBefore(moment().format('YYYY-MM-DD'));
        //console.log("workersToChoose event:",moment().format('DD-MM-YYYY'),past);
        let usrChores = this.props.events;
        let workersDay = [];
        usrChores.map(chore=> { if(moment(chore.date).format('DD-MM-YYYY')===(moment(event).format('DD-MM-YYYY'))){ workersDay.push(chore)}});
        if(past){
            ans.push(<Header>תורנים:</Header>);
            console.log("usrChores after filter past:",workersDay);
            for(var j=0;j<workersDay.length;j++){
                ans.push(<h4><br/>{workersDay[j].title} <br/></h4>);
            }
        }
        else
        {
            ans.push(<Header>יש לבחור {String(this.props.settings.numberOfWorkers)} תורנים:</Header>);
            console.log("usrChores after filter:",workersDay,  this.props.usersOfType);
            for(var j=0;j<workersDay.length;j++){
                ans.push(<h4><br/>{workersDay[j].title} <Button choreId={workersDay[j].id} onClick={this.props.deleteUserChore}>הסר תורן</Button><br/></h4>)
            }

            var loopTimes = (this.props.settings.numberOfWorkers)-j;
            if(loopTimes<0){
                loopTimes = 0;
            }
            let usersOfType = this.props.usersOfType;
            let usersOfType1 = [];
            let j1 = 0 ;
            console.log("workersDay, usersOfType-", workersDay, usersOfType);
            for(j=0; j<workersDay.length ; j++){
                for( j1=0; j1<usersOfType.length;j1++){
                    console.log("usersOfType[j1].id , workersDay[j1].user.id:", usersOfType[j1].id, workersDay[j].user.id )
                    if(usersOfType[j1].id !==workersDay[j].user.userId){
                        usersOfType1.push(usersOfType[j1]);
                    }
                }
            }
            if(workersDay.length===0){
                usersOfType1 = usersOfType;
            }
            console.log("usersOfType1: ", usersOfType1);
            for(var i=0;i<loopTimes;i++){
                ans.push(<Select placeholder='בחר תורן' options={usersOfType1}
                onChange={this.handleWorkerChange}  name={i}
                />);
            }
            if(loopTimes===0){
                ans.push( <Button disabled positive onClick={this.props.createUserChores}  usersChoosed={this.state.usersChoosed} usersChoosedNames={this.state.usersChoosedNames} date={this.state.modalDate}>קבע תורנות עבור המשתמשים</Button>);
            }
            else{
                ans.push( <Button  positive onClick={this.createUserChoresRequest}  usersChoosed={this.state.usersChoosed} usersChoosedNames={this.state.usersChoosedNames} date={this.state.modalDate}>קבע תורנות עבור המשתמשים</Button>);
                //this.setState({ usersChoosed:[], usersChoosedNames:[] });
            }
    }
        ans.push(<Button onClick={this.closeModal} >סגור</Button>);
        return <Table.Body >{ans}</Table.Body>
    }

    closeModal(){
        this.setState({openModal:false, usersChoosed:[], usersChoosedNames:[] });
        //this.setState({usersChoosed:[], usersChoosedNames:[] });
        this.forceUpdate();
    }



    

    render() {

       console.log("renser this.props.events;",( String(window.location).includes("setting")));
    return (
    <div id='calendar' hidden={(String(window.location).includes("settings"))||(String(window.location).includes("newChoreType"))} >
                    <Header>{this.props.match}</Header>
    {/* String(window.location).includes("settings")? this.setState({calendarDisplay: ""}) : this.setState({calendarDisplay: "calendar"})*/}
{/*console.log("rnderrrrrrrrrrrrrrr:", this.props.calendarDisplay)*/}
    <Modal id="calendarModal" open= {this.state.openModal}
        >
    <Modal.Header> תורנות ליום {String(moment(this.state.modalDate).format("dddd : DD-MM-YYYY"))}</Modal.Header>
    <Modal.Content>
    
        {this.workersToChoose(this.state.modalDate)}
        
      {/*<EditChoreTypeSettings onClose={() => this.props.history.goBack()}  settings={this.state.settings}/>*/}
      
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
<div></div>
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
            );
    }
}