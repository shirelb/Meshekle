import React, {Component} from "react";
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/locale/he.js';

import moment from 'moment';
import 'moment/min/moment.min';

import $ from 'jquery';
import 'jquery/dist/jquery.min';
// import "jquery-ui/ui/widgets/draggable";
// import "jquery-ui/ui/widgets/droppable";
import "jquery-ui-dist/jquery-ui.min.css";
import "jquery-ui-dist/jquery-ui.min";

// import './bootstrap.min.css';
// import { Calendar } from "fullcalendar";
// import {Calendar} from '@fullcalendar/core';
// import interactionPlugin, {Draggable} from '@fullcalendar/interaction';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';
// import '@fullcalendar/core/main.css';
// import '@fullcalendar/daygrid/main.css';
// import '@fullcalendar/timegrid/main.css';
// import '@fullcalendar/list/main.css';


var containerEl = document.getElementById('external-events');

export default class AppointmentCalendar extends Component {
    constructor() {
        super();
        this.jq = $.noConflict();
        this.fullcalendarConfig = {
            events: [],//this.props.events,
            height: 630,
            header: {
                left: 'next,prev today',
                center: 'title',
                right: 'month,basicWeek,basicDay,agendaWeek,agendaDay,listWeek',
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
            // drop: function () {
            //     console.log('in dropppppp ');
            //     // is the "remove after drop" checkbox checked?
            //     if ($('#drop-remove').is(':checked')) {
            //         // if so, remove the element from the "Draggable Events" list
            //         $(this).remove();
            //     }
            // },
            // drop: function (date, jsEvent, ui, resourceId) {
            //     console.log('in dropppppp ');
            //     var memberName = $(this).data('event').title;
            //     var memberID = $(this).attr('id').toString();
            //     //Create Event - add to array
            //     var newEvent = new Object();
            //     newEvent = {
            //         title: memberName,
            //         id: memberID,
            //         start: date.format(),
            //         end: date.format(),
            //         objectID: 0
            //     };
            //     // eventsAdded.push(newEvent);
            // },
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
        };

        this.root = null;
        this.calendarInstance = null;
    }

    alreadyCreateDraggable = false;

    /*state={
        events:this.props.events
    };
*/
    componentWillReceiveProps(nextProps) {
        this.fullcalendarConfig.events = nextProps.events;
        // this.setState({events:nextProps.events})
        // $("#calendar").fullCalendar('removeEvents');
        // this.jq('#calendar').fullCalendar('removeEvents');

        // $("#calendar").fullCalendar('destroy');
        // this.jq('#calendar').fullCalendar('updateEvents', nextProps.events);
        this.jq('#calendar').fullCalendar('removeEvents');
        this.jq('#calendar').fullCalendar('addEventSource', nextProps.events);
        // this.jq('#calendar').fullCalendar('rerenderEvents');
        // this.jq('#calendar').fullCalendar('renderEvents', nextProps.events, {stick: false});
        // $('#calendar').fullCalendar(this.fullcalendarConfig);

        // this.jq('#calendar').fullCalendar('destroy');
        // this.calendarInstance = this.jq('#calendar').fullCalendar(this.fullcalendarConfig);
        // this.jq('#calendar').droppable();

        // console.log('nextProps.events ', nextProps.events);
        // console.log('get.events ', this.jq('#calendar').fullCalendar('clientEvents'));
    }

    componentDidMount() {
        // var that=this;
        this.fullcalendarConfig.events = this.props.events;
        this.fullcalendarConfig.eventClick = this.props.onSelectEvent;
        this.fullcalendarConfig.select = this.props.onSelectSlot;
        this.fullcalendarConfig.eventResize = this.props.updateAfterMoveOrResizeEvent;
        this.fullcalendarConfig.eventDrop = this.props.updateAfterMoveOrResizeEvent;
        this.fullcalendarConfig.eventReceive = this.props.onDropAppointmentRequest;
        this.fullcalendarConfig.drop = function (date, jsEvent, ui, resourceId) {
            // alert('Dropping an external event');

            // The rest of this method is taken from external-dragging.html from the demo files

            // retrieve the dropped element's stored Event Object
            var appointmentRequestDropped = JSON.parse($(this).attr('data-event'));

            let startDateAndTime = moment(date);
            let endDateAndTime = moment(date).add(2, 'h');

            /*let appointmentEvent = {
                id :appointmentRequestDropped.requestId,
            title :appointmentRequestDropped.clientName,
            allDay :false,
            start :startDateAndTime,
            end :endDateAndTime,
            appointmentRequest :appointmentRequestDropped,
        };*/
            appointmentRequestDropped.start=startDateAndTime;
            appointmentRequestDropped.end=endDateAndTime;

            $('#calendar').fullCalendar('updateEvent', appointmentRequestDropped);
            // appointmentRequestDropped=appointmentEvent;

            // that.props.onDropAppointmentRequest.apply(startDateAndTime,endDateAndTime, appointmentRequestDropped);
            // that.props.approveAppointmentRequest.apply(appointmentRequestDropped);

            // appointmentRequestDropped.stick=false;

            // $('#calendar').fullCalendar('renderEvent', appointmentEvent, false);

            /*var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            // copiedEventObject.allDay = allDay;

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            // $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }*/
        };
        // console.log('this.props.events ', this.props.events);
        // console.log('this.fullcalendarConfig ', this.fullcalendarConfig);
        /*
                const calendarEl = this.refs.fullCalendar;
        */
        //
        /*new Draggable(document.getElementById('external-events'), {
            itemSelector: '.fc-event',
            /!*eventData: function(eventEl) {
                console.log('Draggable eventData eventEl ',eventEl);
                console.log('Draggable eventData eventEl ',typeof eventEl);
                return {
                    title: eventEl.innerText,
                    duration: '02:00'
                };
            }*!/
        });*/

        // new Draggable(this.props.draggableList, {
        //     itemSelector: '.fc-event',
        //     // eventData: function (eventEl) {
        //     //     return {
        //     //         title: eventEl.innerText
        //     //     };
        //     // }
        // });

        console.log("calendarHandler");
        this.calendarInstance = this.jq('#calendar').fullCalendar(this.fullcalendarConfig);
        $('#calendar').droppable();
        this.jq('#calendar').droppable();

        /*let calendar = new Calendar(calendarEl, {
            id: "appointmentsFullCalendar",
            events: this.props.events,
            plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
            header: {
                left: 'next,prev today',
                center: 'title',
                // right: 'month,basicWeek,basicDay,agendaWeek,agendaDay,listWeek',
                right: 'dayGridMonth,dayGridWeek,dayGridDay,timeGridWeek,timeGridDay,listWeek,listDay',
            },
            buttonIcons: {
                prev: 'right-single-arrow',
                next: 'left-single-arrow',
                // prevYear: 'right-double-arrow',
                // nextYear: 'left-double-arrow',
            },
            // themeSystem:{'bootstrap'},
            // themeName:{'Minty'},

            locale: 'he',
            closeText: "סגור",
            prevText: "&#x3C;הקודם",
            nextText: "הבא&#x3E;",
            currentText: "היום",
            buttonText: {
                month: "חודשי",
                // week: "שבועי",
                // day: "יומי",
                list: "סדר יום",
                today: 'היום',
                basicWeek: "שבועי",
                basicDay: "יומי",
                agendaWeek: "יומן שבועי",
                agendaDay: "יומן יומי",
            },
            allDayText: "כל היום",
            eventLimitText: "עוד",
            noEventsMessage: "אין לך תורים מתוכננים",
            weekNumberTitle: "שבוע",
            showMonthAfterYear: false,
            yearSuffix: "",
            dir: 'rtl',
            // timeFormat:'HH:mm',
            // eventTimeFormat:'HH:mm',

            displayEventTime: true,
            displayEventEnd: true,
            // defaultDate:'2017-09-12',
            navLinks: true, // can click day/week names to navigate view,
            editable: true,
            eventResizableFromStart: true,

            eventLimit: true, // allow "more" link when too many event,
            // eventLimitText:'עוד',
            eventLimitClick: 'popover',

            weekNumbers: false,
            slotEventOverlap: true, //maybe false,
            // listDayFormat:true,
            // listDayAltFormat:true,
            nowIndicator: true,
            now: new Date(),

            eventClick: this.props.onSelectEvent,
            select: this.props.onSelectSlot,
            selectable: true,
            selectMirror: true,
            unselectAuto: true,

            droppable: true,
            // dragOpacity:.75,
            dragRevertDuration: 500,
            dragScroll: true,

            // eventDragStart:,
            eventDragStop: {
                function() {
                    console.log('eventDragStop function');
                }
            },
            eventDrop: this.props.updateAfterMoveOrResizeEvent,
            /!*drop: function (date, jsEvent, ui, resourceId) {,
            var memberName : $(this).data('event').title;,
            var memberID : $(this).attr('id').toString();,
            //Create Event - add to array
            var newEvent : new Object();,
            newEvent : {,
            title: memberName,
            id: memberID,
            start: date.format(),
            end: date.format(),
            objectID: 0,
            };
            eventsAdded.push(newEvent);
            },*!/
            drop: {
                function(info) {
                    console.log('drop function');
                    // if so, remove the element from the "Draggable Events" list
                    info.draggedEl.parentNode.removeChild(info.draggedEl);
                }
            },
// eventReceive:{this.onExternalEventReceive.bind(this)},
            eventReceive: {
                function(event) {
                    console.log('eventReceive function');
                }
            },

            eventResize: this.props.updateAfterMoveOrResizeEvent,

// textColor:'black',
            timezone: 'local',

            handleWindowResize: true,
            windowResizeDelay: 200,
        });
        calendar.render();*/
        // calendar.changeView("month");


    }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     if (nextProps.draggableList && !this.alreadyCreateDraggable) {
    //         this.alreadyCreateDraggable=true;
    //         new Draggable(nextProps.draggableList, {
    //             itemSelector: '.fc-event',
    //             // eventData: function (eventEl) {
    //             //     return {
    //             //         title: eventEl.innerText
    //             //     };
    //             // }
    //         });
    //     }
    // }

    render() {
        return <div id="calendar" ref="fullCalendar"/>;
    }
}
