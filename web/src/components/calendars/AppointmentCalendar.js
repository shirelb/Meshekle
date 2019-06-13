import React, {Component} from "react";
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/locale/he.js';

import moment from 'moment';
import 'moment/min/moment.min';
import 'jquery/dist/jquery.min';

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


export default class AppointmentCalendar extends Component {
    constructor() {
        super();
        this.jq = $.noConflict();
        this.fullcalendarConfig = {
            events: [],
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
            drop: null,

            eventClick: null,
            select: null,
            selectable: true,
            selectMirror: true,
            unselectAuto: true,

            eventDrop: null,

            eventReceive: function (event) {
                // console.log('event, ' + event.title + ', was added, (need date here)');
                // console.log('eventReceive function');
            },

            eventResize: null,

            timezone: 'local',

            handleWindowResize: true,
            windowResizeDelay: 200,
        };

        this.root = null;
    }

    componentWillReceiveProps(nextProps) {
        this.fullcalendarConfig.events = nextProps.events;

        this.jq('#calendar').fullCalendar('removeEvents');
        this.jq('#calendar').fullCalendar('addEventSource', nextProps.events);
    }

    componentDidMount() {
        this.fullcalendarConfig.events = this.props.events;
        this.fullcalendarConfig.eventClick = this.props.onSelectEvent;
        this.fullcalendarConfig.select = this.props.onSelectSlot;
        this.fullcalendarConfig.eventResize = this.props.updateAfterMoveOrResizeEvent;
        this.fullcalendarConfig.eventDrop = this.props.updateAfterMoveOrResizeEvent;
        this.fullcalendarConfig.eventReceive = this.props.onDropAppointmentRequest;
        this.fullcalendarConfig.drop = function (date, jsEvent, ui, resourceId) {
            var appointmentRequestDropped = JSON.parse($(this).attr('data-event'));

            let startDateAndTime = moment(date);
            let endDateAndTime = moment(date).add(2, 'h');

            appointmentRequestDropped.start = startDateAndTime;
            appointmentRequestDropped.end = endDateAndTime;

            $('#calendar').fullCalendar('updateEvent', appointmentRequestDropped);
        };

        // console.log("calendarHandler");
        this.jq('#calendar').fullCalendar(this.fullcalendarConfig);
        $('#calendar').droppable();
        this.jq('#calendar').droppable();
    }

    render() {
        return <div id="calendar"/>;
    }
}
