import React from 'react';
import {Helmet} from 'react-helmet';
import {Grid, Header, Message, Modal} from "semantic-ui-react";
import store from "store";
import mappers from "../../shared/mappers";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import appointmentsStorage from "../../storage/appointmentsStorage";
import AppointmentForm from "../appointment/AppointmentAdd";
import AnnouncementForm from "./AnnouncementForm";
import announcementsStorage from "../../storage/announcementsStorage";

class AnnouncementAdd extends React.Component {
    constructor(props) {
        super(props);
        this.serviceProviderId = this.props.location.state.serviceProviderId;
        this.userId = this.props.location.state.userId;
        this.isUpdate = this.props.location.state.isUpdate;

        this.state = {categories: [],formError: "",};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };

        this.getCategories();
    }

    getCategories() {
        announcementsStorage.getCategoriesByServiceProviderId(this.serviceProviderId,this.serviceProviderHeaders)
            .then(response => this.setState({categories: response.data}));
    };

    handleSubmit(announcement) {
        this.setState({formError:""});
        const {getAnnouncements} = this.props;
        var newAnnouncement = JSON.parse(JSON.stringify(announcement));
        if(!this.isUpdate) {

            newAnnouncement.serviceProviderId = store.get('serviceProviderId');
            newAnnouncement.userId = store.get('userId');
            newAnnouncement.creationTime = this.formatDate(new Date());
            newAnnouncement.expirationTime = this.formatDate(newAnnouncement.expirationTime);
            newAnnouncement.dateOfEvent = this.formatDate(newAnnouncement.dateOfEvent);

            newAnnouncement.status = "On air";
            announcementsStorage.addAnnouncement(newAnnouncement, this.serviceProviderHeaders)
                .then((response) => {
                    if(response.status === 200) {
                        console.log(response);

                        getAnnouncements();
                        this.props.history.goBack();
                        //this.props.history.reload()
                        return true;
                    }
                    else {
                        this.setState({formError: response.data.message});
                        return false;
                    }
                });
        }
        else{

            newAnnouncement.expirationTime = this.formatDate(newAnnouncement.expirationTime);
            newAnnouncement.dateOfEvent = this.formatDate(newAnnouncement.dateOfEvent);
            newAnnouncement.announcementId = this.isUpdate.announcementId;

            announcementsStorage.updateAnnouncement(newAnnouncement, this.serviceProviderHeaders)
                .then((response) => {
                    if(response.status === 200) {
                        console.log(response);

                        getAnnouncements();
                        this.props.history.goBack();
                        //this.props.history.reload()
                        return true;
                    }
                    else {
                        this.setState({formError: response.data.message});
                        return false;
                    }
                });
        }
    }

    handleCancel(e) {
        e.preventDefault();

        this.props.history.goBack()
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }


    render() {

        const {categories,formError} = this.state;

        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | Add Appointment</title>
                </Helmet>

                <Grid padded>
                    <Grid.Column>

                        <Header as="h1" floated="right">{this.isUpdate?"ערוך מודעה": "מודעה חדשה"}</Header>
                        <AnnouncementForm
                            submitText="קבע"
                            announcement = {this.isUpdate?this.isUpdate:null}
                            categories = {categories}
                            handleSubmit={this.handleSubmit}
                            handleCancel={this.handleCancel}
                        />

                        {formError === "" ?
                            null
                            : <Message
                                error
                                header='אופס, יש בעיה'
                                content={formError}
                            />
                        }
                    </Grid.Column>
                </Grid>
            </Modal>
        );
    }
}

export default AnnouncementAdd;