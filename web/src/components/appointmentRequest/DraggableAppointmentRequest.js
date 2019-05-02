import React from "react";
import {Card, Icon, List} from 'semantic-ui-react';

import $ from 'jquery';
import 'jquery/dist/jquery.min';
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";
// import "jquery-ui-dist/jquery-ui.min.css";
// import "jquery-ui-dist/jquery-ui.min";

const colorCardByRole = {
    "מספרה": "blue",
    "מרפאת שיניים": "olive",
};

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
                                <List.Content as={Card} centered
                                              color={`${colorCardByRole[appointmentRequest.AppointmentDetail.role]}`}
                                              style={{color: `${this.props.colorEventByRole[appointmentRequest.AppointmentDetail.role]}`}}>
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