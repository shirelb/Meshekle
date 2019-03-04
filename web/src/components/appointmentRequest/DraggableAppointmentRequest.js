import React from "react";
import {Card, Icon, List} from 'semantic-ui-react';

// import 'fullcalendar';
// import 'fullcalendar/dist/fullcalendar.css'
// import 'fullcalendar/dist/locale/he.js';
// import 'moment/min/moment.min';

import $ from 'jquery';
// import 'jquery/dist/jquery.min';
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";
// import "jquery-ui-dist/jquery-ui.min.css";
// import "jquery-ui-dist/jquery-ui.min";


export default class DraggableAppointmentRequest extends React.Component {
    componentDidUpdate() {
        $('#external-events .fc-event').each(function () {
            /* var eventObject = {
                 title: $.trim($(this).text()) // use the element's text as the event title
             };*/

            // store data so the calendar knows to render an event upon drop
            /*$(this).data('eventObject', {
                title: $.trim($(this).text()), // use the element's text as the event title
                ff: $(this), // use the element's text as the event title
                // aa: $(this).getAttribute('eventObject'), // use the element's text as the event title
                // aeea: $(this).getAttribute('data-event'), // use the element's text as the event title
                // stick: true // maintain when user navigates (see docs on the renderEvent method)
            });*/

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        });
    }

    render() {
        return <div id='external-events' style={{marginTop: 20}}>
            <List animated selection divided verticalAlign='middle'>
                {this.props.appointmentRequests.map((appointmentRequestEvent, i) => {
                    let appointmentRequest = appointmentRequestEvent.appointmentRequest;
                    return (
                        <div className='fc-event' data-event={JSON.stringify(appointmentRequestEvent)}
                             key={appointmentRequest.requestId}>
                            <List.Item
                                as={Card}
                                key={appointmentRequest.requestId}
                                onMouseOver={this.props.hoverOnAppointmentRequest(appointmentRequest)}
                                onMouseLeave={this.props.hoverOffAppointmentRequest(appointmentRequest)}
                                draggable={"true"}
                            >
                                {/*<Image avatar src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />*/}
                                {/* <List.Content>
                                    <List.Header>{appointmentRequest.clientName}</List.Header>
                                    <List.Description
                                    as='a'>{appointmentRequest.AppointmentDetail.serviceProviderId}</List.Description>
                                    <List.Description
                                    as='a'>{appointmentRequest.AppointmentDetail.role}</List.Description>
                                    <List.Description>{JSON.parse(appointmentRequest.AppointmentDetail.subject).join(", ")}</List.Description>
                                    <List.Description>{appointmentRequest.notes}</List.Description>
                                    <List.Description>
                                {Array.isArray(appointmentRequest.optionalTimes) &&
                                    appointmentRequest.optionalTimes.map((datesTimes, j) =>
                                    (
                                    <List.Item key={j}>
                                    <List.Content>
                                    <List.Description>{moment(datesTimes.date).format('DD.MM.YYYY')}:</List.Description>
                                    <List.Description>
                                    {Array.isArray(datesTimes.hours) &&
                                    datesTimes.hours.map((time, k) =>
                                        (
                                            <List.Item key={k}>
                                                <List.Content>
                                                    <List.Description>      {time.startHour}-{time.endHour}</List.Description>
                                                </List.Content>
                                            </List.Item>
                                        ),
                                    )}
                                    </List.Description>
                                    </List.Content>
                                    </List.Item>
                                    ),
                                    )}
                                    </List.Description>
                                    </List.Content>*/}
                                <List.Content as={Card} centered>
                                    <Icon name='info circle'
                                          onClick={this.props.onClick.bind(this, appointmentRequest)}/>
                                    <Card.Header>{appointmentRequest.clientName}</Card.Header>
                                    {/*<Card.Meta>{this.props.cardMeta?this.props.cardMeta:null}</Card.Meta>*/}
                                    <Card.Description>{JSON.parse(appointmentRequest.AppointmentDetail.subject).join(", ")}</Card.Description>
                                </List.Content>
                            </List.Item>
                        </div>
                    )
                })
                }
            </List>
        </div>
    }
}