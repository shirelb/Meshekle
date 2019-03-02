import React from 'react';
import {List} from 'semantic-ui-react';


export default class AppointmentRequestListRender extends React.Component {

    render() {
        const appointmentRequest = this.props.resource;

        return (
            <List.Content>
                <List.Header>{appointmentRequest.clientName}</List.Header>
                {/*<List.Description*/}
                {/*as='a'>{appointmentRequest.AppointmentDetail.serviceProviderId}</List.Description>*/}
                {/*<List.Description*/}
                {/*as='a'>{appointmentRequest.AppointmentDetail.role}</List.Description>*/}
                <List.Description>{JSON.parse(appointmentRequest.AppointmentDetail.subject).join(", ")}</List.Description>
                {/*<List.Description>{appointmentRequest.notes}</List.Description>*/}
                {/*<List.Description>
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
                </List.Description>*/}
            </List.Content>
        )
    }
}