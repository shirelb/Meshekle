import React from 'react';
import {Helmet} from 'react-helmet';
import ServiceProviderForm from './ServiceProviderForm';
import store from "store";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import {Dropdown, Grid, Header, Modal} from "semantic-ui-react";
import strings from "../../shared/strings";
import mappers from "../../shared/mappers";

class ServiceProviderEdit extends React.Component {
    constructor(props) {
        super(props);

        this.props.location.state.serviceProvider ?
            this.state = {
                serviceProvider: this.props.location.state.serviceProvider,
                dropdownRoles: [],
                serviceProvidersFound: []
            } :
            this.state = {serviceProvider: {fullname: ""}, dropdownRoles: [], serviceProvidersFound: []};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
    }

    componentDidMount() {
        if (this.props.location.state.serviceProvider)
            this.setState({serviceProvider: this.props.location.state.serviceProvider});
        else if (this.props.location.state.serviceProviderId)
            this.getServiceProvidersRelatedToUser(this.props.location.state.serviceProviderId);
        else
            serviceProvidersStorage.getServiceProviderById(this.props.match.params.serviceProviderId, this.serviceProviderHeaders)
                .then(serviceProvider => {
                    if (serviceProvider.response) {
                        if (serviceProvider.response.status !== 200)
                            this.setState({
                                infoError: true,
                                infoErrorHeader: 'קרתה שגיאה בעת הבאת פרטי נותן שירות',
                                infoErrorContent: mappers.errorMapper(serviceProvider.response)
                            });
                    } else
                        this.setState({serviceProvider: serviceProvider});
                })
    }

    getServiceProvidersRelatedToUser = (serviceProviderId) => {
       serviceProvidersStorage.getServiceProviderById(serviceProviderId, this.serviceProviderHeaders)
            .then(serviceProvidersFound => {
                if (serviceProvidersFound.response) {
                    if (serviceProvidersFound.response.status !== 200)
                        return;
                } else {
                    // let serviceProvider = serviceProviderFound[0];
                    // this.setState({serviceProvider: serviceProvider});
                    serviceProvidersStorage.getServiceProviderUserDetails(serviceProviderId)
                        .then(userDetails => {
                            if (userDetails.response) {
                                if (userDetails.response.status !== 200)
                                    return;
                            } else {
                                serviceProvidersFound.forEach((provider, index) => {
                                    provider.fullname = userDetails.data.fullname;

                                    // this.setState({serviceProvidersFound: serviceProvidersFound});

                                    let dropdownRole = {
                                        key: index,
                                        value: provider.role,
                                        text: strings.roles[provider.role]
                                    };
                                    let dropdownRoles = this.state.dropdownRoles;
                                    dropdownRoles.push(dropdownRole);
                                    this.setState({
                                        serviceProvidersFound: serviceProvidersFound,
                                        dropdownRoles: dropdownRoles,
                                    })
                                })
                            }
                        })
                }
            });
    };

    handleSubmit(serviceProvider) {
       return serviceProvidersStorage.updateServiceProviderById(serviceProvider)
            .then((response) => {
                if (response.response) {
                    if (response.response.status !== 200)
                        return response;
                } else {
                    this.props.history.goBack();
                    if (this.props.location.state.serviceProvider)
                        this.props.history.goBack();
                }
            })
    }

    handleCancel(e) {
        e.preventDefault();

        // console.log('you have canceled');

        this.props.history.goBack();
    }

    selectRoleToChangeSettings = (e, {value}) => {
        // console.log('selectRoleToChangeSettings value ', value);

        this.setState({
            roleSelected: value,
            serviceProvider: this.state.serviceProvidersFound.filter(provider => provider.role === value)[0],
        });
    };

    render() {
        const {serviceProvider, serviceProvidersFound} = this.state;

        // console.log("ServiceProviderEdit state ", this.state);


        return (
            <Modal size='large' open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                <Helmet>
                    <title>Meshekle | ערוך נותן
                        שירות {serviceProvider.fullname ? serviceProvider.fullname : serviceProvider.serviceProviderId}</title>
                </Helmet>

                <Grid padded>
                    <Grid.Row>
                        <Header as="h1" floated="right">ערוך נותן שירות</Header>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            {this.props.location.state.serviceProviderId ?
                                <Dropdown
                                    label='ענף'
                                    placeholder='ענף'
                                    search
                                    selection
                                    autoComplete='on'
                                    options={this.state.dropdownRoles ? this.state.dropdownRoles : []}
                                    // value={this.state.roleSelected}
                                    onChange={this.selectRoleToChangeSettings.bind(this)}
                                    // name='serviceProviderRole'
                                    required
                                    noResultsMessage='לא נמצאו ענפים'
                                />
                                : null
                            }
                            {serviceProvider.role ?
                                <ServiceProviderForm
                                    submitText="עדכן"
                                    serviceProvider={this.state.serviceProvider}
                                    handleSubmit={this.handleSubmit}
                                    handleCancel={this.handleCancel}
                                    openedFrom={"ServiceProviderEdit"}
                                />
                                : null
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal>);
    }
}

export default ServiceProviderEdit;