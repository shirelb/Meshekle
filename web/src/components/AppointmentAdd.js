import React from 'react';
import {post} from 'axios';
import {Helmet} from 'react-helmet';
import AppointmentForm from "./AppointmentForm";
import {Modal} from "semantic-ui-react";

class AppointmentAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {slotInfo: this.props.location.state.slotInfo};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSubmit(appointment) {
        post('/api/appointments', appointment)
            .then(() => {
                console.log('added:', appointment);
            });
    }

    handleCancel(e) {
        e.preventDefault();

        console.log('you have canceled');
    }

    render() {
        return (
            <Modal open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                {/*<Page title="Add Appointment" columns={3}>*/}

                <Helmet>
                    <title>Meshekle | Add Appointment</title>
                </Helmet>

                <AppointmentForm
                    handleSubmit={this.handleSubmit}
                    handleCancel={this.handleCancel}
                    slotInfo={this.state.slotInfo}
                />
                {/*</Page>*/}
            </Modal>
        );
    }
}

export default AppointmentAdd;