import React from 'react';
import {Accordion, Button, Icon, Image, Modal} from 'semantic-ui-react';
import {Helmet} from 'react-helmet';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import store from "store";
import strings from "../../shared/strings";
import {Route, Switch} from "react-router-dom";
import ServiceProviderEdit from "./ServiceProviderEdit";
import mappers from "../../shared/mappers";

class ServiceProviderInfo extends React.Component {
    constructor(props) {
        super(props);

        console.log("UserInfo props ", this.props);
        this.props.location.state ?
            this.state = {serviceProvider: this.props.location.state.serviceProvider, activeIndex: -1} :
            this.state = {serviceProvider: {}, activeIndex: -1};


        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };

        if (this.props.location.state)
            this.setState({serviceProvider: this.props.location.state.serviceProvider});
        else
            serviceProvidersStorage.getServiceProviderById(this.props.match.params.serviceProviderId)
                .then(serviceProvider => {
                    this.setState({serviceProvider: serviceProvider});
                })
    }

    handleDelete() {
        serviceProvidersStorage.deleteServiceProviderById(this.state.serviceProvider.serviceProviderId, this.state.serviceProvider.role, "shallowDelete")
            .then((response) => {
                console.log('serviceProvider deleted response ', response);
                this.props.history.goBack();
            });
    }

    handleEdit = () => {
        this.props.history.push(`${this.props.match.url}/edit`, {
            serviceProvider: this.state.serviceProvider
        });
    };

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex})
    };

    renewPassword = () => {
        serviceProvidersStorage.renewUserPassword(this.state.serviceProvider.userId, this.serviceProviderHeaders)
            .then((response) => {
                console.log('user password renewed response ', response);
                this.props.history.goBack();
            });
    }

    appointmentRoleDetailsVisible = () => {
        if (this.state.serviceProvider.role)
            if (Object.keys(strings.appointmentRoles).includes(this.state.serviceProvider.role))
                return true;
        return false;
    };

    render() {
        const {serviceProvider, activeIndex} = this.state;
        console.log('ServiceProviderInfo serviceProvider ', serviceProvider);

        return (
            <div>
                <Modal open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                    <Helmet>
                        <title>Meshekle |
                            ServiceProvider {serviceProvider.fullname ? serviceProvider.fullname : serviceProvider.serviceProviderId}</title>
                    </Helmet>

                    <Modal.Header>{serviceProvider.fullname}</Modal.Header>
                    {/*<Modal.Header>{serviceProvider.serviceProviderId}</Modal.Header>*/}
                    <Modal.Content image>
                        <Image wrapped size="small"
                               src={serviceProvider.image ? serviceProvider.image : 'https://user-images.githubusercontent.com/30195/34457818-8f7d8c76-ed82-11e7-8474-3825118a776d.png'}/>
                        <Modal.Description style={{marginRight: 20}}>
                            <p>{strings.phoneBookPageStrings.SERVICE_PROVIDER_ID_HEADER}: {serviceProvider.serviceProviderId}</p>
                            <p>{strings.phoneBookPageStrings.FULLNAME_HEADER}: {serviceProvider.fullname}</p>
                            <p>{strings.phoneBookPageStrings.SERVICE_PROVIDER_ROLE_HEADER}: {strings.roles[serviceProvider.role]}</p>
                            {/*<p>{strings.phoneBookPageStrings.SERVICE_PROVIDER_USER_ID_HEADER}: {serviceProvider.userId}</p>*/}
                            {this.appointmentRoleDetailsVisible() ?
                                <div>
                                    {strings.phoneBookPageStrings.SERVICE_PROVIDER_OPERATION_TIME_HEADER}:
                                    {
                                        JSON.parse(serviceProvider.operationTime).map((dayTime, index) => {
                                            return <Accordion key={index}>
                                                <Accordion.Title
                                                    active={activeIndex === index}
                                                    index={index}
                                                    onClick={this.handleClick}>
                                                    <Icon name='dropdown'/>
                                                    {mappers.daysMapper(dayTime.day)}
                                                </Accordion.Title>
                                                {
                                                    dayTime.hours.map((hour, j) => {
                                                        return <Accordion.Content
                                                            active={activeIndex === index}
                                                            key={j}>
                                                            {hour.startHour} - {hour.endHour}
                                                        </Accordion.Content>
                                                    })
                                                }
                                            </Accordion>
                                        })
                                    }
                                </div>
                                : null
                            }
                            <p>{strings.phoneBookPageStrings.PHONE_HEADER}: {serviceProvider.phoneNumber}</p>
                            {this.appointmentRoleDetailsVisible() ?
                                <p>{strings.phoneBookPageStrings.SERVICE_PROVIDER_APPOINTMENT_WAY_TYPE_HEADER}: {strings.appointmentsWayType[serviceProvider.appointmentWayType]}</p>
                                : null
                            }
                            <p>{strings.phoneBookPageStrings.ACTIVE_HEADER}: {serviceProvider.active ? strings.phoneBookPageStrings.ACTIVE_ANSWER_YES : strings.phoneBookPageStrings.ACTIVE_ANSWER_NO}</p>

                            {this.props.hasPhoneBookPermissions ?
                                <Button onClick={this.renewPassword}>חדש סיסמא</Button>
                                : null
                            }
                        </Modal.Description>
                    </Modal.Content>
                    {this.props.hasPhoneBookPermissions ?
                        <Modal.Actions className='alignLeft'>
                            <Button positive onClick={this.handleEdit}>ערוך</Button>
                            <Button negative onClick={this.handleDelete}>מחק</Button>
                            <Button onClick={() => this.props.history.goBack()}>סגור</Button>
                        </Modal.Actions>
                        : null
                    }
                </Modal>

                <div>
                    <Switch>
                        <Route exec path={`${this.props.match.url}/edit`}
                               component={ServiceProviderEdit}/>
                        {/*<Redirect to={`${this.props.match.path}`}/>*/}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default ServiceProviderInfo;