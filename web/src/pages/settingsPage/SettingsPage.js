import React, {Component} from 'react';
import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Button, Checkbox, Dropdown, Form, Grid, Header, Icon, Input, List, Radio, Table} from 'semantic-ui-react';
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
            serviceProviderSelected: {},

            operationTime: "",
            phoneNumber: "",
            appointmentWayType: "",
            subjects: "",
            active: "",

            editIconVisible: true,
            approveIconVisible: false,
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
                this.setState({serviceProviderList: response});

                console.log("serviceProviderList ", response);
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

        this.setState({
            roleSelected: value,
            serviceProviderSelected: this.state.serviceProviderList.filter(provider => provider.role === value)[0],
        });

        console.log("serviceProviderSelected ", this.state.serviceProviderList.filter(provider => provider.role === value)[0])

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

    /* updateServiceProviderSubjects = (updateSubjects) => {
         this.state.serviceProviderSelected.subjects
     }*/

    addSubject = () => {
        let updateSubjects = JSON.parse(this.state.serviceProviderSelected.subjects);
        updateSubjects.push(this.state.newSubject);

        serviceProvidersStorage.updateServiceProviderById(this.state.serviceProviderSelected.serviceProviderId,
            this.state.serviceProviderSelected.role, null, null, null, updateSubjects, null)
            .then(response => {
                console.log("addSubject response ", response)
                this.setState({
                    newSubject: "",
                    serviceProviderSelected: {
                        ...this.state.serviceProviderSelected,
                        subjects: JSON.stringify(updateSubjects)
                    },
                });

            })
    }

    removeSubject = (subject) => {
        let updateSubjects = JSON.parse(this.state.serviceProviderSelected.subjects);
        updateSubjects.pop(subject);

        serviceProvidersStorage.updateServiceProviderById(this.state.serviceProviderSelected.serviceProviderId,
            this.state.serviceProviderSelected.role, null, null, null, updateSubjects, null)
            .then(response => {
                console.log("addSubject response ", response)
                this.setState({
                    newSubject: "",
                    serviceProviderSelected: {
                        ...this.state.serviceProviderSelected,
                        subjects: JSON.stringify(updateSubjects)
                    },
                });

            })
    }

    editSubject = (index, subject) => {
        let updateSubjects = JSON.parse(this.state.serviceProviderSelected.subjects);
        updateSubjects[index] = subject;

        serviceProvidersStorage.updateServiceProviderById(this.state.serviceProviderSelected.serviceProviderId,
            this.state.serviceProviderSelected.role, null, null, null, updateSubjects, null)
            .then(response => {
                console.log("addSubject response ", response)
                this.setState({
                    newSubject: "",
                    editIconVisible: true,
                    approveIconVisible: false,
                    serviceProviderSelected: {
                        ...this.state.serviceProviderSelected,
                        subjects: JSON.stringify(updateSubjects)
                    },
                });

            })
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
                    {this.state.roleSelected ?
                        <Grid.Row>
                            <Form>

                                <Form.Field>
                                    <b> דרך הצגת התורים היא:
                                        {strings.appointmentsWayType[this.state.appointmentWayType]}</b>
                                </Form.Field>
                                <Grid>
                                    {
                                        Object.keys(strings.appointmentsWayType).map((item, index) => {
                                            return <Form.Group widths='equal' key={index}>
                                                <Form.Field>
                                                    <Radio
                                                        className="radio-block"
                                                        // label={strings.appointmentsWayType[item]}
                                                        name='radioGroup'
                                                        value={item}
                                                        checked={this.state.appointmentWayType === {item}.item}
                                                        onChange={this.handleChange}
                                                    />
                                                </Form.Field>
                                                <Form.Field>
                                                    <label
                                                        className="radio-label">{strings.appointmentsWayType[item]}</label>
                                                </Form.Field>
                                            </Form.Group>
                                        })
                                    }
                                </Grid>

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
                                    <b> הנושאים שלך הם:</b>
                                </Form.Field>
                                <Input
                                    focus
                                    placeholder='הוסף נושא חדש...'
                                    onChange={(event, data) => this.setState({newSubject: data.value})}
                                />
                                <Button icon onClick={this.addSubject.bind(this)}>
                                    <Icon link name='plus'/>
                                </Button>
                                <Table style={{width: 250}} columns={3} relaxed singleLine size={'large'}
                                       textAlign={"right"} basic='very' striped padded={"very"}>
                                    {
                                        JSON.parse(this.state.serviceProviderSelected.subjects).map((subject, index) => {
                                            {
                                            }
                                            return <Table.Row key={index} className={"subjectListItem"}>
                                                {this.state.editIconVisible ?
                                                    {subject} :
                                                    <Input
                                                        focus
                                                        placeholder={subject}
                                                        onChange={(event, data) => this.setState({editedSubject: data.value})}
                                                    />
                                                }
                                                <Icon link name='delete'
                                                      className={"subjectListIcon"}
                                                      onClick={this.removeSubject.bind(this, subject)}/>
                                                {this.state.editIconVisible ?
                                                    <Icon link name='edit'
                                                          className={"subjectListIcon"}
                                                          onClick={this.setState({
                                                              editIconVisible: false,
                                                              approveIconVisible: true
                                                          })}/>
                                                    :
                                                    <Icon link name='check'
                                                          className={"subjectListIcon"}
                                                          onClick={this.editSubject.bind(this, index, this.state.editedSubject)}/>
                                                }
                                            </Table.Row>
                                        })
                                    }
                                </Table>

                            </Form>
                        </Grid.Row> :
                        null
                    }
                </Grid>
            </div>
        );
    }
}

export default SettingsPage;

