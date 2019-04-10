import React from 'react';
import {Helmet} from 'react-helmet';
import ServiceProviderForm from './ServiceProviderForm';
import store from "store";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import {Grid, Header, Modal} from "semantic-ui-react";

class ServiceProviderEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {serviceProvider: this.props.location.state.serviceProvider};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
    }

    componentDidMount() {
        if (this.props.location.state.serviceProvider)
            this.setState({serviceProvider: this.props.location.state.serviceProvider});
        else
            serviceProvidersStorage.getServiceProviderById(this.props.match.params.serviceProviderId)
                .then(serviceProvider => {
                    this.setState({serviceProvider: serviceProvider});
                })
    }

    handleSubmit(serviceProvider) {
        // todo complete this -  handleSubmit(serviceProvider) !
        serviceProvidersStorage.updateServiceProviderById(serviceProvider, this.serviceProviderHeaders)
            .then((response) => {
                this.props.history.goBack();
                this.props.history.goBack();
            })
    }

    handleCancel(e) {
        e.preventDefault();

        console.log('you have canceled');

        this.props.history.goBack();
    }

    render() {
        const {serviceProvider} = this.state;

        return (
            <Modal size='large' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    {/*<title>Meshekle | ערוך נותן שירות {serviceProvider.fullname}</title>*/}
                    <title>Meshekle | ערוך נותן שירות {serviceProvider.serviceProviderId}</title>
                </Helmet>

                <Grid padded>
                    <Grid.Row>
                        <Header as="h1" floated="right">ערוך משתמש</Header>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <ServiceProviderForm
                                submitText="עדכן"
                                serviceProvider={serviceProvider}
                                handleSubmit={this.handleSubmit}
                                handleCancel={this.handleCancel}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal>);
    }
}

export default ServiceProviderEdit;