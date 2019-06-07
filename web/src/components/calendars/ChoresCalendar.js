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
import {Button, Grid, Header, Icon, Modal, Portal, Segment, Select, Table} from 'semantic-ui-react';
import helpers from "../../shared/helpers";
import choresStorage from "../../storage/choresStorage";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants"
import axios from "axios";


// import "jquery-ui-dist/jquery-ui.min.css";
// import "jquery-ui-dist/jquery-ui.min";

// import './bootstrap.min.css';
var userschores = [];
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
                console.log('event, ' + event + ', was added, (need date here)', moment(event.target).format('DD-MM-YYYY'));
                console.log('eventReceive function');
                props.onDraggedUser(event, "dayEvent", event.target);
            },

            eventResize: null,

            timezone: 'local',

            handleWindowResize: true,
            windowResizeDelay: 200,
            //defaultView:''
        };
        this.state = {
            openModal: false,
            modalDate: '',
            settings: '',
            usersChoosed: [],
            value: '',
            openPortal: false,
            portalContent: '',
            portalUserChoresCreated: false,
            portalNeedToDeleteUserChores: false,
            usersChoosedNames: [],
            calendarDisplay: this.props.calendarDisplay,
            choreTypeName: props.choreTypeName,
            userschores: [],

        }

        this.root = null;
        this.onSelectSlot = this.onSelectSlot.bind(this);
        this.workersToChoose = this.workersToChoose.bind(this);
        this.handleWorkerChange = this.handleWorkerChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createUserChoresRequest = this.createUserChoresRequest.bind(this);
        this.getUserschoresForType = this.getUserschoresForType.bind(this);
        this.onDropEvent = this.onDropEvent.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        this.fullcalendarConfig.events = nextProps.events;

        this.jq('#calendar').fullCalendar('removeEvents');
        this.jq('#calendar').fullCalendar('addEventSource', nextProps.events);
    }

    componentWillUnmount() {
        WEB_SOCKET.off("getChangeInUserChores");
    }

    getUserschoresForType() {
        choresStorage.getUserChoresForType(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreTypeName)
            .then(res => {
                console.log("in getUserschoresForType:", this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreTypeName)
                let usrChores = res.data.usersChores;
                this.setState({
                    settings: this.props.settings,
                    userschores: usrChores
                });
                userschores = usrChores;
            })
            .catch(e => {
                console.log("in getUserschoresForType eror:", e, this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreTypeName)

            })
    }

    onDropEvent(event) {
        let usersChoosed = [];
        usersChoosed.push(event.user.userId);
        let usersChoosedNames = [];
        usersChoosedNames.push(event.user.fullname);
        console.log("on dropinggggg-", moment(event.start._d).format('DD-MM-YYYY'), usersChoosedNames, usersChoosed)
        let reqs = [];
        reqs.push(this.props.deleteUserChore(event, {choreId: event.userChore.userChoreId}));
        reqs.push(this.createUserChoresRequest(event, {
            usersChoosed: [event.user.userId],
            usersChoosedNames: [event.user.fullname],
            date: event.start._d
        }));
        axios.all(reqs).then(res => {

        })
    }


    componentDidMount() {
        this.fullcalendarConfig.events = this.props.events;
        this.fullcalendarConfig.select = this.onSelectSlot;
        this.fullcalendarConfig.droppable = true;
        this.fullcalendarConfig.eventDrop = this.onDropEvent;
        connectToServerSocket(this.props.serviceProviderId);

        WEB_SOCKET.on("getChangeInUserChores", this.forceUpdate.bind(this));

        this.jq('#calendar').fullCalendar(this.fullcalendarConfig);

        console.log("calendarHandler");
        $('#calendar').droppable();
        this.jq('#calendar').droppable();
    }

    onSelectSlot(e) {
        console.log("e:", e);
        this.setState({openModal: true, modalDate: e});
        this.forceUpdate();
        this.modalContent = [];
        this.modalContent = this.workersToChoose();
    }

    handleWorkerChange(event, {name}) {
        console.log("in handle worker change", name, event._targetInst);
        let workers = this.state.usersChoosed;
        let workersNames = this.state.usersChoosedNames;
        if (workers.indexOf(event.target.id) < 0) {
            workers[name] = event.target.id;
            workersNames[name] = event.target.innerText;
            this.setState({usersChoosed: workers, usersChoosedNames: workersNames});
            console.log("workers= and usersChoosedNames", workers, workersNames);

        } else {
            this.setState({openPortal: true, portalContent: 'לא ניתן לבחור אותו תורן פעמיים'})
        }

    }

    createUserChoresRequest(e, {usersChoosed, usersChoosedNames, date}) {
        this.forceUpdate();
        let users = usersChoosed;
        let usersNames = usersChoosedNames;
        console.log("createUserChoresRequest ", this.state.usersChoosed, usersChoosed);
        if (usersChoosed && usersChoosed.length === 0) {
            users = this.state.usersChoosed
            usersNames = this.state.usersChoosedNames;
        }
        this.props.createUserChores(e, users, usersNames, date);
        this.setState({usersChoosed: [], usersChoosedNames: []});
        console.log("back from create user chores request:", this.state.usersChoosed, this.state.usersChoosedNames)
    }

    workersToChoose() {
        let event = this.state.modalDate;
        this.getUserschoresForType();
        let ans = [];
        let past = moment(event).isBefore(moment().format('YYYY-MM-DD'));
        let settings = this.props.settings;
        console.log("workersToChoose event:settings.choreTypeName", this.props.choreTypeName, this.props.getUserChoresForType(this.props.choreTypeName));
        let usrChores = userschores;

        console.log("workersToChoose event:ודרCיםרקד", usrChores);

        let workersDay = [];
        usrChores.map(chore => {
            if (moment(chore.date).format('DD-MM-YYYY') === (moment(event).format('DD-MM-YYYY'))) {
                workersDay.push(chore)
            }
        });
        if (past) {
            ans.push(<Header>תורנים:</Header>);
            console.log("usrChores after filter past:", workersDay);
            let j = 0;
            for (j = 0; j < workersDay.length; j++) {
                ans.push(<h4>
                    <br/>{workersDay[j].User.fullname}&nbsp;&nbsp;&nbsp;&nbsp;{"( תאריך מקורי: " + moment(workersDay[j].originDate).format('DD-MM-YYYY') + ")"}
                    <br/></h4>);
            }
        } else {
            ans.push(<Header>יש לבחור {String(this.props.settings.numberOfWorkers)} תורנים:</Header>);
            console.log("usrChores after filter:", workersDay, this.props.usersOfType);
            let j = 0;
            for (j = 0; j < workersDay.length; j++) {
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", workersDay[j])
                ans.push(<h4>
                    <br/>{workersDay[j].User.fullname}&nbsp;&nbsp;&nbsp;&nbsp;{"( תאריך מקורי: " + moment(workersDay[j].originDate).format('DD-MM-YYYY') + ")"}
                    <Button choreId={workersDay[j].userChoreId} onClick={this.props.deleteUserChore}>הסר
                        תורן</Button><br/></h4>)
            }

            var loopTimes = (this.props.settings.numberOfWorkers) - j;
            if (loopTimes < 0) {
                loopTimes = 0;
            }
            let usersOfType = this.props.usersOfType;
            let usersOfType1 = [];
            let j1 = 0;
            console.log("workersDay, usersOfType-", workersDay, usersOfType);
            for (j = 0; j < workersDay.length; j++) {
                for (j1 = 0; j1 < usersOfType.length; j1++) {
                    console.log("usersOfType[j1].id , workersDay[j1].user.id:", usersOfType[j1].id, workersDay[j])
                    if (usersOfType[j1].id !== workersDay[j].User.userId) {
                        usersOfType1.push(usersOfType[j1]);
                    }
                }
            }
            if (workersDay.length === 0) {
                usersOfType1 = usersOfType;
            }
            console.log("usersOfType1: ", usersOfType1);
            for (var i = 0; i < loopTimes; i++) {
                ans.push(<Select search placeholder='בחר תורן' options={usersOfType1}
                                 onChange={this.handleWorkerChange} name={i}
                />);
            }
            if (loopTimes === 0) {
                ans.push(<Button disabled positive onClick={this.props.createUserChores}
                                 usersChoosed={this.state.usersChoosed} usersChoosedNames={this.state.usersChoosedNames}
                                 date={this.state.modalDate}>קבע תורנות עבור המשתמשים</Button>);
            } else {
                ans.push(<Button positive onClick={this.createUserChoresRequest} usersChoosed={this.state.usersChoosed}
                                 usersChoosedNames={this.state.usersChoosedNames} date={this.state.modalDate}>קבע תורנות
                    עבור המשתמשים</Button>);
            }
        }
        ans.push(<Button onClick={this.closeModal}>סגור</Button>);
        return <Table.Body>{ans}</Table.Body>
    }

    closeModal() {
        this.setState({openModal: false, usersChoosed: [], usersChoosedNames: []});
        this.forceUpdate();
    }


    render() {

        console.log("renser this.props.events;", (String(window.location).includes("setting")));
        return (
            <div>
                <div id='calendar'
                     hidden={(String(window.location).includes("settings")) || (String(window.location).includes("newChoreType"))}>
                    <Header>{this.props.match}</Header>
                    <Button icon
                            onClick={() => helpers.exportToPDF('MeshekleAppointmentsCalendar', 'calendar', 'landscape')}>
                        <Icon name="file pdf outline"/>
                        &nbsp;&nbsp;
                        יצא לPDF
                    </Button>

                    <Modal id="calendarModal" open={this.state.openModal}
                    >
                        <Modal.Header> תורנות
                            ליום {String(moment(this.state.modalDate).format("dddd : DD-MM-YYYY"))}</Modal.Header>
                        <Modal.Content>

                            {this.modalContent}

                        </Modal.Content>
                    </Modal>
                    {this.props.createUserChoreResult.name === 'portalUserChoresCreated' ?
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
                        <Portal onClose={() => {
                            this.setState({openPortal: false, portalContent: ''})
                        }} open={true}>
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
                                    onClick={() => {
                                        this.setState({openPortal: false, portalContent: ''})
                                    }}
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

// const style=StyleSheet.create({
//     .fc-event.hebdate, .fc-event.omer {
//         background-color:#FFF;
//         border-color:#FFF;
//         color:#999;
//        }
//        .fc-event.dafyomi {
//         background-color:#FFF;
//         border-color:#FFF;
//         color:#08c;
//        }
//        .fc-event.dafyomi a {
//         color: #0088cc;
//        }
//        .fc-event.dafyomi a:hover,
//        .fc-event.dafyomi a:focus {
//         color: #005580;
//        }
//        .fc-event.candles, .fc-event.havdalah {
//         background-color:#FFF;
//         border-color:#FFF;
//         color:#333;
//        }
//        .fc-event.holiday {
//         background-color:#3a87ad;
//         border-color:#3a87ad;
//         color:#FFF;
//        }
//        .fc-event.holiday.yomtov {
//         background-color:#ffd446;
//         border-color:#ffd446;
//         color:#333;
//        }
//        .fc-event.parashat {
//         background-color:#257e4a;
//         border-color:#257e4a;
//         color:#FFF;
//        }
//        .fc-event.hebrew .fc-title {
//         font-family:'Alef Hebrew','SBL Hebrew',David;
//         font-size:110%;
//         font-weight:normal;
//         direction:rtl;
//        }
//        .fc-event.hebrew .fc-time {
//         direction:ltr;
//         unicode-bidi: bidi-override;
//        }

// })