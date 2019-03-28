import React, {Component} from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Checkbox, Dropdown, Form, Grid, Header, List, Radio} from 'semantic-ui-react';
import store from 'store';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import strings from "../../shared/strings";
import mappers from "../../shared/mappers";
import {Helmet} from "react-helmet";


class SettingsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serviceProviderRoles: [],
            dropdownRoles: [],
            roleSelected: "",

            operationTime: "",
            phoneNumber: "",
            appointmentWayType: "",
            subjects: "",
            active: "",
        };
    }


    getRolesOfServiceProviderAndCreateDropdown() {
        serviceProvidersStorage.getRolesOfServiceProvider(this.serviceProviderId)
            .then(roles => {
                this.setState({
                    serviceProviderRoles: roles.map(role => mappers.rolesMapper(role)),
                });

                console.log("serviceProviderRoles dddd ", this.state.serviceProviderRoles);

                roles.forEach((role, index) => {
                    let dropdownRole = {key: index, value: role, text: mappers.rolesMapper(role)};
                    let dropdownRoles = this.state.dropdownRoles;
                    dropdownRoles.push(dropdownRole);
                    this.setState({
                        dropdownRoles: dropdownRoles,
                    })
                });

                console.log("dropdownRoles dddd ", this.state.dropdownRoles);
            });
    }

    componentDidMount() {
        this.serviceProviderId = store.get('serviceProviderId');

        this.getRolesOfServiceProviderAndCreateDropdown();

        serviceProvidersStorage.getServiceProviderById(this.serviceProviderId)
            .then(response => {
                this.setState({serviceProviderList: response})
            })

    }

    handleChange = (e, {value}) => {
        serviceProvidersStorage.updateServiceProviderById(this.serviceProviderId, this.state.roleSelected, null, null, value)
            .then(response => {
                console.log("updateServiceProviderById response ", response)
            })
        this.setState({appointmentWayType: value})
    };

    selectRoleToChangeSettings = (e, {value}) => {
        console.log('selectRoleToChangeSettings value ', value);

        this.setState({roleSelected: value});

        serviceProvidersStorage.getServiceProviderAppointmentWayTypeById(this.serviceProviderId, value)
            .then(appointmentWayType => {
                console.log("getServiceProviderAppointmentWayTypeById appointmentWayType ", appointmentWayType);
                this.setState({
                    appointmentWayType: appointmentWayType,
                })
            });
    };

    addRoleToServiceProvider = (role) => {
        serviceProvidersStorage.addRoleToServiceProviderById(this.serviceProviderId, role)
            .then(response => {
                console.log("addRoleToServiceProviderById response ", response);
            })
    }

    removeRoleFromeServiceProvider = (role) => {
        serviceProvidersStorage.removeRoleFromServiceProviderById(this.serviceProviderId, role)
            .then(response => {
                console.log("removeRoleFromServiceProviderById response ", response);
            })
    }

    onChangeRoles = (event, data) => {
        console.log("onChangeRoles event ", event);
        console.log("onChangeRoles data ", data);
        data.checked ?
            this.addRoleToServiceProvider(data.name)
            :
            this.removeRoleFromeServiceProvider(data.name);

        this.getRolesOfServiceProviderAndCreateDropdown();
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>Meshekle | Settings</title>
                </Helmet>
                <Grid stretched padded>
                    <Grid.Row>
                        <Header as="h1"
                                floated="right">{strings.mainPageStrings.SETTINGS_PAGE_TITLE}</Header>
                    </Grid.Row>
                    <Grid.Row columns={'equal'} divided>
                        <Grid.Column>
                            <Header as={'h4'}>
                                תפקידים
                            </Header>
                            <List>
                                {
                                    Object.keys(strings.roles).map((item, index) => {
                                        return <List.Item key={index}>
                                            <Checkbox toggle
                                                      checked={(this.state.serviceProviderRoles.filter(role => role === strings.roles[item])).length > 0}
                                                      onChange={this.onChangeRoles.bind(this)}
                                                      name={item}/>
                                            <label>
                                                {strings.roles[item]}
                                            </label>
                                        </List.Item>
                                    })
                                }
                            </List>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Header as={'h4'}>
                            בחר את הענף עבורו את/ה רוצה לשנות את ההגדרות:
                        </Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Form>
                            <Form.Field
                                control={Dropdown}
                                // label='ענף'
                                placeholder='ענף'
                                search
                                selection
                                autoComplete='on'
                                options={this.state.dropdownRoles}
                                value={this.state.roleSelected}
                                onChange={this.selectRoleToChangeSettings.bind(this)}
                                name='serviceProviderRole'
                                required
                                noResultsMessage='לא נמצאו ענפים'
                            />
                        </Form>
                    </Grid.Row>
                    <Grid.Row>
                        <Form>
                            {/* <Form.Field
                        control={Dropdown}
                        label='נושא'
                        placeholder='נושא'
                        fluid
                        multiple
                        selection
                        options={subjectOptions}
                        value={appointment.subject}
                        onChange={this.handleChange}
                        name='subjects'
                        required
                        noResultsMessage='לא נמצאו התאמות'
                        onSearchChange={this.handleSearchChange}
                        // width='10'
                    />*/}


                            <Form.Field>
                                דרך הצגת התורים היא: <b>{this.state.appointmentWayType}</b>
                            </Form.Field>
                            {
                                Object.keys(strings.appointmentsWayType).map((item, index) => {
                                    return <Form.Field key={index}>
                                        <Radio
                                            className="radio-block"
                                            label={strings.appointmentsWayType[item]}
                                            name='radioGroup'
                                            value={item}
                                            checked={this.state.appointmentWayType === {item}.item}
                                            onChange={this.handleChange}
                                        />
                                        <label className="radio-label">{strings.appointmentsWayType[item]}</label>
                                    </Form.Field>
                                })
                            }
                            {/*<Form.Field>
                                <Radio
                                    // label='דיון'
                                    name='radioGroup'
                                    value='Dialog'
                                    checked={this.state.appointmentWayType === 'Dialog'}
                                    onChange={this.handleChange}
                                />
                                <label>דיון</label>
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    // label='שורה נעלמת'
                                    name='radioGroup'
                                    value='Slots'
                                    checked={this.state.appointmentWayType === 'Slots'}
                                    onChange={this.handleChange}
                                />
                                <label>שורה נעלמת</label>
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    // label='פתיחת תקלה'
                                    name='radioGroup'
                                    value='fault'
                                    checked={this.state.appointmentWayType === 'fault'}
                                    onChange={this.handleChange}
                                />
                                <label>פתיחת תקלה</label>
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    // label='הכל'
                                    name='radioGroup'
                                    value='all'
                                    checked={this.state.appointmentWayType === 'all'}
                                    onChange={this.handleChange}
                                />
                                <label>הכל</label>
                            </Form.Field>*/}
                        </Form>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default SettingsPage;

