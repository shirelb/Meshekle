import React from 'react';
import ServiceProviderForm from './ServiceProviderForm';
import {Helmet} from 'react-helmet';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import store from "store";
import {Grid, Header, Modal} from "semantic-ui-react";

class ServiceProviderAdd extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
    }

    handleSubmit(serviceProvider) {
        serviceProvidersStorage.createServiceProvider(serviceProvider)
            .then(response => {
                console.log('serviceProvider created ', response);
                this.props.history.goBack();
            });
    }

    handleCancel(e) {
        e.preventDefault();

        console.log('you have canceled');

        this.props.history.goBack();
    }

    render() {
        return (
            <Modal size='small' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | Add ServiceProvider</title>
                </Helmet>

                <Grid padded>
                    <Grid.Row>
                        <Header as="h1" floated="right">נותן שירות חדש</Header>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <ServiceProviderForm
                                submitText="הוסף"
                                handleSubmit={this.handleSubmit}
                                handleCancel={this.handleCancel}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal>
        );
    }
}

export default ServiceProviderAdd;