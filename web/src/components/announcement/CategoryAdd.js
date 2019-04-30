import React from 'react';
import {Helmet} from 'react-helmet';
import {Grid, Header, Message, Modal} from "semantic-ui-react";
import store from "store";
import announcementsStorage from "../../storage/announcementsStorage";
import CategoryForm from "./CategoryForm";

class CategoryAdd extends React.Component {
    constructor(props) {
        super(props);
        this.serviceProviderId = this.props.location.state.serviceProviderId;
        this.userId = this.props.location.state.userId;
        this.isUpdate = this.props.location.state.isUpdate;
        this.serProvsWithNames = this.props.location.state.serProvsWithNames;
        this.catNames = this.props.location.state.catNames;

        this.state = {formError: "",};



        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };

    }


    // categoryListExample = {cateogryName:"asaf",managers:[4,5,6],categoryOldName:"amit"}
    handleSubmit(categoryList) {



        this.setState({formError:""});
        const {getAnnouncements,getAnnouncementsRequests,getCategories,getAllCategories} = this.props;
        var newCategoryList = JSON.parse(JSON.stringify(categoryList));
        if(!this.isUpdate) {

            if(this.catNames.map(c=>c.toLowerCase()).includes(newCategoryList.categoryName.toLowerCase())){
                this.setState({formError: "שם הקטגוריה כבר קיים"});
                return false;
            }

            announcementsStorage.addCategory(newCategoryList, this.serviceProviderHeaders)
                .then((response) => {
                    if(response.status === 200) {
                        console.log(response);

                        getAnnouncements();
                        getAnnouncementsRequests();
                        getCategories();
                        getAllCategories();
                        this.props.history.goBack();
                        return true;
                    }
                    else {
                        this.setState({formError: response.data.message});
                        return false;
                    }
                });
        }
        else{
            if(this.catNames.map(c=>c.toLowerCase()).includes(newCategoryList.categoryName.toLowerCase()) && newCategoryList.categoryName !== newCategoryList.categoryOldName){
                this.setState({formError: "שם הקטגוריה כבר קיים"});
                return false;
            }

            announcementsStorage.updateCategory(newCategoryList, this.serviceProviderHeaders)
                .then((response) => {
                    if(response.status === 200) {
                        console.log(response);

                        getAnnouncements();
                        getAnnouncementsRequests();
                        getCategories();
                        getAllCategories();
                        this.props.history.goBack();
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


    render() {

        const {formError} = this.state;

        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | Add Appointment</title>
                </Helmet>

                <Grid padded>
                    <Grid.Column>

                        <Header as="h1" floated="right">{this.isUpdate?"ערוך קטגוריה": "קטגוריה חדשה"}</Header>
                        <CategoryForm
                            submitText="קבע"
                            category = {this.isUpdate?this.isUpdate:null}
                            serProvsWithNames = {this.serProvsWithNames}
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

export default CategoryAdd;