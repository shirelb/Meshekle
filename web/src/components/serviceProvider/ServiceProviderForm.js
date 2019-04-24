import React from 'react';
import {Button, Checkbox, Dropdown, Form, Grid, Header, Icon, Input, List, Message} from 'semantic-ui-react';
import moment from "moment";
import Datetime from 'react-datetime';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import mappers from "../../shared/mappers";
import store from "store";
import strings from "../../shared/strings";
import usersStorage from "../../storage/usersStorage";

class ServiceProviderForm extends React.Component {
    constructor(props) {
        super(props);

        // const {serviceProvider, users} = props;

        this.state = {
            formError: false,
            formComplete: false,
            isAlertModal: false,

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

            usersOptions: [],

            operationTimeDaySelected: [false, false, false, false, false, false,],
            activeAccordionIndex: -1,

            startTimeSelected: ["", "", "", "", "", ""],
            endTimeSelected: ["", "", "", "", "", ""],
        };

        if (this.props.serviceProvider) {
            JSON.parse(this.props.serviceProvider.operationTime).forEach(dayTime => {
                let operationTimeDaySelected = this.state.operationTimeDaySelected;
                operationTimeDaySelected[Object.keys(strings.days).indexOf(dayTime.day)] = true;
                Object.assign(this.state, {operationTimeDaySelected})
            });

            Object.assign(this.state, {
                serviceProvider: {
                    serviceProviderId: this.props.serviceProvider.serviceProviderId,
                    role: this.props.serviceProvider.role,
                    userId: this.props.serviceProvider.userId,
                    operationTime: typeof this.props.serviceProvider.operationTime === 'string' ? JSON.parse(this.props.serviceProvider.operationTime) : this.props.serviceProvider.operationTime,
                    phoneNumber: this.props.serviceProvider.phoneNumber,
                    appointmentWayType: this.props.serviceProvider.appointmentWayType,
                    subjects: typeof this.props.serviceProvider.subjects === 'string' ? JSON.parse(this.props.serviceProvider.subjects) : this.props.serviceProvider.subjects,
                    active: this.props.serviceProvider.active,
                },
            });
        } else {
            Object.assign(this.state, {
                serviceProvider: {
                    serviceProviderId: '',
                    role: '',
                    userId: '',
                    operationTime: [],
                    phoneNumber: '',
                    appointmentWayType: '',
                    subjects: [],
                    active: false,
                },
            });
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const serviceProvider = nextProps.serviceProvider;
        // const serviceProvidersFound = nextProps.serviceProvidersFound;

        if (serviceProvider) {
            this.setState({
                serviceProvider: {
                    serviceProviderId: serviceProvider.serviceProviderId,
                    role: serviceProvider.role,
                    userId: serviceProvider.userId,
                    operationTime: typeof serviceProvider.operationTime === 'string' ? JSON.parse(serviceProvider.operationTime) : serviceProvider.operationTime,
                    phoneNumber: serviceProvider.phoneNumber,
                    appointmentWayType: serviceProvider.appointmentWayType,
                    subjects: typeof serviceProvider.subjects === 'string' ? JSON.parse(serviceProvider.subjects) : serviceProvider.subjects,
                    active: serviceProvider.active,
                },
            })

            JSON.parse(serviceProvider.operationTime).forEach(dayTime => {
                let operationTimeDaySelected = this.state.operationTimeDaySelected;
                operationTimeDaySelected[Object.keys(strings.days).indexOf(dayTime.day)] = true;
                this.setState({operationTimeDaySelected})
            })
        }

        // if(serviceProvidersFound){
        //     this.setState(serviceProvidersFound)
        // }

        if (nextProps.users)
            this.buildUsersOption(nextProps.users);

    }

    buildUsersOption = (users) => {
        let usersOptions = users.map(item => ({
            key: item.userId,
            text: item.fullname,
            value: item.userId,
            user: item,
            content: <Header icon='mobile' content={item.fullname} subheader={item.userId}/>,
            // image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
        }));

        this.setState({
            usersOptions: usersOptions,
        })
    };

    getRolesOfServiceProviderAndCreateDropdown() {
        serviceProvidersStorage.getRolesOfServiceProvider(this.serviceProviderId)
            .then(roles => {
                if (roles != undefined || roles != null) {
                    this.setState({
                        serviceProviderRoles: roles.map(role => strings.roles[role]),
                    });

                    // console.log("serviceProviderRoles dddd ", this.state.serviceProviderRoles);
                    // console.log("state dעddd ", this.state);

                    roles.forEach((role, index) => {
                        let dropdownRole = {key: index, value: role, text: strings.roles[role]};
                        let dropdownRoles = this.state.dropdownRoles;
                        dropdownRoles.push(dropdownRole);
                        this.setState({
                            dropdownRoles: dropdownRoles,
                        })
                    });

                    // console.log("dropdownRoles dddd ", this.state.dropdownRoles);
                }
            });
    }

    componentDidMount() {
        this.serviceProviderId = store.get('serviceProviderId');

        // this.getRolesOfServiceProviderAndCreateDropdown();

        serviceProvidersStorage.getServiceProviderById(this.serviceProviderId)
            .then(response => {
                this.setState({serviceProviderList: response});

                // console.log("serviceProviderList ", response);
            });

        if (this.props.users)
            this.buildUsersOption(this.props.users);
        else
            this.loadUsers();

    }

    loadUsers() {
        usersStorage.getUsers()
            .then((response) => {
                console.log('response ', response);
                const users = response;

                this.buildUsersOption(users);
            });
    }

    handleFocus = () => {
        this.setState({
            formError: false,
            formErrorMassage: "",
            fieldUserIdError: false,
            fieldPhoneNumberError: false,
            fieldRoleError: false,
            fieldAppointmentsWayTypeError: false,
            fieldSubjectsError: false,
            fieldOperationTimeError: false,
            fieldActiveError: false,
        })
    };

    isFormValid = (serviceProvider) => {
        if (serviceProvider.serviceProviderId === '' || serviceProvider.userId === '') {
            this.setState({
                formError: true,
                formErrorMassage: "משתמש חסר",
                fieldUserIdError: true
            });
            return false;
        }

        if (serviceProvider.phoneNumber === '' || serviceProvider.phoneNumber.match(/^[0-9]+$/) === null || serviceProvider.phoneNumber.length < 9 || serviceProvider.phoneNumber.length > 10) {
            this.setState({
                formError: true,
                formErrorMassage: "טלפון חסר וצריך להכיל בין 9 ל10 ספרות",
                fieldPhoneNumberError: true
            });
            return false;
        }

        if (serviceProvider.role === '') {
            this.setState({
                formError: true,
                formErrorMassage: "ענף חסר",
                fieldRoleError: true
            });
            return false;
        }

        if(this.appointmentRoleDetailsVisible()) {
            if (serviceProvider.appointmentWayType === '') {
                this.setState({
                    formError: true,
                    formErrorMassage: "דרך הצגת תורים לא נבחרה",
                    fieldAppointmentsWayTypeError: true
                });
                return false;
            }

            if (serviceProvider.subjects.length === 0) {
                this.setState({
                    formError: true,
                    formErrorMassage: "חייב להיות לפחות נושא אחד",
                    fieldSubjectsError: true
                });
                return false;
            }

            if (serviceProvider.operationTime.length === 0) {
                this.setState({
                    formError: true,
                    formErrorMassage: "זמן פעילות חסר",
                    fieldOperationTimeError: true
                });
                return false;
            }
        }

        if (serviceProvider.active === null) {
            this.setState({
                formError: true,
                formErrorMassage: "האם נותן השירות פעיל?",
                fieldActiveError: true
            });
            return false;
        }

        return true;
    };


    handleSubmit(e) {
        e.preventDefault();
        const {serviceProvider} = this.state;
        const {handleSubmit} = this.props;

        serviceProvider.serviceProviderId = serviceProvider.userId;
        serviceProvider.operationTime = serviceProvider.operationTime.filter(dayTime => dayTime.hours.length > 0);

        if (this.isFormValid(serviceProvider)) {
            this.setState({formComplete: true});

            handleSubmit(serviceProvider);
            this.setState({
                serviceProvider: {
                    serviceProviderId: '',
                    role: '',
                    userId: '',
                    operationTime: [],
                    phoneNumber: '',
                    appointmentWayType: '',
                    subjects: [],
                    active: false,
                },
            });
        }

    }

    handleChange(e, {name, value}) {
        const {serviceProvider} = this.state;

        this.setState({formError: false, formComplete: false});
        this.setState({serviceProvider: {...serviceProvider, [name]: value}});
    }

    handleUpdateChange = (e, {value}) => {
        serviceProvidersStorage.updateServiceProviderById(this.serviceProviderId, this.state.roleSelected, null, null, value)
            .then(response => {
                console.log("updateServiceProviderById response ", response)
            })
        this.setState({appointmentWayType: value})
    };


    handleClear = (e) => {
        e.preventDefault();
        this.setState({
            serviceProvider: {
                serviceProviderId: '',
                role: '',
                userId: '',
                operationTime: [],
                phoneNumber: '',
                appointmentWayType: '',
                subjects: [],
                active: false,
            },
            formError: false,
            formComplete: false,

            editIconVisible: true,
            approveIconVisible: false,

            usersOptions: [],

            operationTimeDaySelected: [false, false, false, false, false, false,],
            activeAccordionIndex: -1,

            startTimeSelected: ["", "", "", "", "", ""],
            endTimeSelected: ["", "", "", "", "", ""],
        });

        this.handleFocus();
    };

    /*selectRoleToChangeSettings = (e, {value}) => {
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
    };*/

    addRoleToServiceProvider = (role) => {
        serviceProvidersStorage.addRoleToServiceProviderById(this.serviceProviderId, role)
            .then(response => {
                console.log("addRoleToServiceProviderById response ", response);
            })
    }

    removeRoleFromServiceProvider = (role) => {
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
            this.removeRoleFromServiceProvider(data.name);

        this.getRolesOfServiceProviderAndCreateDropdown();
    }

    addSubject = () => {
        if (this.state.newSubject === undefined || this.state.newSubject === "" || !(/^(?!\s*$).+/.test(this.state.newSubject)))
            return;

        // let updateSubjects = JSON.parse(this.state.serviceProvider.subjects);
        let updateSubjects = this.state.serviceProvider.subjects;
        updateSubjects.push(this.state.newSubject);
        this.setState({newSubject: "", serviceProvider: {...this.state.serviceProvider, subjects: updateSubjects}});

        /* serviceProvidersStorage.updateServiceProviderById(this.state.serviceProviderSelected.serviceProviderId,
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

             })*/
    }

    removeSubject = (subject) => {
        let updateSubjects = this.state.serviceProvider.subjects;
        updateSubjects.pop(subject);
        this.setState({serviceProvider: {...this.state.serviceProvider, subjects: updateSubjects}});

        // let updateSubjects = JSON.parse(this.state.serviceProvider.subjects);
        // updateSubjects.pop(subject);

        /*serviceProvidersStorage.updateServiceProviderById(this.state.serviceProviderSelected.serviceProviderId,
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

            })*/
    }

    editSubject = (index, subject) => {
        let updateSubjects = this.state.serviceProvider.subjects;
        updateSubjects[index] = subject;
        this.setState({
            editIconVisible: true,
            approveIconVisible: false,
            serviceProvider: {...this.state.serviceProvider, subjects: updateSubjects}
        });

        // let updateSubjects = JSON.parse(this.state.serviceProvider.subjects);
        // updateSubjects[index] = subject;

        /*serviceProvidersStorage.updateServiceProviderById(this.state.serviceProviderSelected.serviceProviderId,
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

            })*/
    }

    onChangeDate = date => {
        let updateUser = this.state.serviceProvider;
        updateUser.bornDate = date;
        this.setState({serviceProvider: updateUser})
    };

    onChangeActive = () => {
        let updateUser = this.state.serviceProvider;
        updateUser.active = !this.state.serviceProvider.active;
        this.setState({serviceProvider: updateUser})
    };

    userIdOrFullNameSearch = (options, query) => {
        return options.filter(opt => opt.key.includes(query) || opt.text.includes(query))
    };

    handleAccordionClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex})
    };

    toggleDayToOperationTime = (event, data, index) => {
        let updateOperationTime = this.state.serviceProvider.operationTime;
        let dayTime = {};
        dayTime.day = data.value;
        dayTime.hours = [];

        let updateOperationTimeDaySelected = this.state.operationTimeDaySelected;

        if (data.checked) {
            updateOperationTimeDaySelected[index] = true;
            updateOperationTime.push(dayTime);
        } else {
            updateOperationTime = updateOperationTime.filter(dayTime => dayTime.day !== data.value);
            updateOperationTimeDaySelected[index] = false;
        }

        this.setState({
            operationTimeDaySelected: updateOperationTimeDaySelected,
            serviceProvider: {...this.state.serviceProvider, operationTime: updateOperationTime}
        })
    };

    addHours = (day, index) => {
        if (!(/^(?!\s*$).+/.test(this.state.startTimeSelected[index])) || !(/^(?!\s*$).+/.test(this.state.endTimeSelected[index])))
            return;

        if (this.state.startTimeSelected[index] === undefined || this.state.endTimeSelected[index] === undefined)
            return;

        let updateOperationTime = this.state.serviceProvider.operationTime;
        let dayTime = updateOperationTime.filter(dayTime => dayTime.day === day)[0];
        dayTime.hours.push({
            startHour: this.state.startTimeSelected[index],
            endHour: this.state.endTimeSelected[index]
        });

        let startTimeSelected = this.state.startTimeSelected;
        startTimeSelected[index] = "";

        let endTimeSelected = this.state.endTimeSelected;
        endTimeSelected[index] = "";

        this.setState({
            startTimeSelected: startTimeSelected,
            endTimeSelected: endTimeSelected,
            serviceProvider: {...this.state.serviceProvider, operationTime: updateOperationTime}
        })
    };

    removeHours = (item, hour) => {
        let updateOperationTime = this.state.serviceProvider.operationTime;
        let updateHours = updateOperationTime.filter(dayTime => dayTime.day === item)[0].hours;
        updateHours = updateHours.filter(times => times.startHour !== hour.startHour && times.endHour !== hour.endHour);
        updateOperationTime.filter(dayTime => dayTime.day === item)[0].hours = updateHours;
        this.setState({serviceProvider: {...this.state.serviceProvider, operationTime: updateOperationTime}});
    };

    appointmentRoleDetailsVisible = () => {
        if (this.state.serviceProvider.role !== "")
            if (Object.keys(strings.appointmentRoles).includes(this.state.serviceProvider.role))
                return true;
        return false;
    };

    render() {
        const {formError, formComplete, usersOptions, operationTimeDaySelected, activeAccordionIndex, serviceProvider, serviceProvider: {serviceProviderId, role, userId, operationTime, phoneNumber, appointmentWayType, subjects, active}} = this.state;
        const {handleCancel, submitText} = this.props;

        console.log("serviceProvider form state ", this.state);
        // console.log("serviceProvider filter ", operationTime.filter(dayTime => dayTime.day === "Sunday"));

        return (
            <Form error={formError}>
              {/*  {this.state.serviceProvidersFound ?
                    <Form.Group>
                        <Form.label> בחר את התפקיד עבורו את/ה רוצה לשנות את ההגדרות:</Form.label>
                        <Form.Field
                            control={Dropdown}
                            label='ענף'
                            placeholder='ענף'
                            search
                            selection
                            autoComplete='on'
                            options={this.state.dropdownRoles}
                            // value={this.state.roleSelected}
                            // onChange={this.selectRoleToChangeSettings.bind(this)}
                            // name='serviceProviderRole'
                            required
                            noResultsMessage='לא נמצאו ענפים'
                        />
                    </Form.Group>
                    :null
                }*/}

                <Form.Group widths='equal'>
                    <Form.Field
                        control={Dropdown}
                        error={this.state.fieldUserIdError}
                        required
                        label="משתמש"
                        placeholder='משתמש'
                        fluid
                        autoComplete='on'
                        options={Array.isArray(usersOptions) ? usersOptions : []}
                        value={userId}
                        name="userId"
                        noResultsMessage='לא נמצאו התאמות'
                        selection
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        search={this.userIdOrFullNameSearch}
                        disabled={this.props.openedFrom !== "ServiceProviderAdd"}
                    />
                    <Form.Input
                        error={this.state.fieldPhoneNumberError}
                        required
                        label="טלפון"
                        type="tel"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                    />

                    <Form.Input
                        error={this.state.fieldActiveError}
                        required
                        label="פעיל"
                        // type="checkbox"
                        name="active"
                        disabled={serviceProviderId === store.get("serviceProviderId")}
                    >
                        <Checkbox
                            name="active"
                            toggle
                            checked={active}
                            onChange={this.onChangeActive.bind(this)}
                            onFocus={this.handleFocus}
                        />
                    </Form.Input>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field required error={this.state.fieldRoleError} onFocus={this.handleFocus}
                                disabled={this.props.openedFrom !== "ServiceProviderAdd"}>
                        <label>תפקיד</label>
                        <List>
                            {
                                Object.keys(strings.roles).map((item, index) => {
                                    return <List.Item key={index}>
                                        <Checkbox
                                            radio
                                            checked={role === item}
                                            // onChange={this.onChangeRoles.bind(this)}
                                            onChange={this.handleChange}
                                            value={item}
                                            name="role"
                                        />
                                        <label>
                                            {strings.roles[item]}
                                        </label>
                                    </List.Item>
                                })
                            }
                        </List>
                    </Form.Field>

                    {this.appointmentRoleDetailsVisible() ?
                        <Form.Field required error={this.state.fieldAppointmentsWayTypeError}
                                    onFocus={this.handleFocus}>
                            <label>דרך הצגת התורים</label>
                            {/*<label>{strings.appointmentsWayType[this.state.appointmentWayType]}</label>*/}
                            <List>
                                {
                                    Object.keys(strings.appointmentsWayType).map((item, index) => {
                                        if (item !== "Admin")
                                            return <List.Item key={index}>
                                                <Checkbox
                                                    radio
                                                    checked={appointmentWayType === item}
                                                    // onChange={this.onChangeRoles.bind(this)}
                                                    onChange={this.handleChange}
                                                    value={item}
                                                    name="appointmentWayType"
                                                />
                                                <label>
                                                    {strings.appointmentsWayType[item]}
                                                </label>
                                            </List.Item>
                                    })
                                }
                            </List>
                        </Form.Field>
                        : null}
                    {this.appointmentRoleDetailsVisible() ?
                        <Form.Field required error={this.state.fieldSubjectsError} onFocus={this.handleFocus}>
                            <label>הנושאים</label>
                            <Input
                                focus
                                placeholder='הוסף נושא חדש...'
                                // value={this.state.newSubject}
                                onChange={(event, data) => this.setState({newSubject: data.value})}
                                action={<Button icon onClick={this.addSubject.bind(this)}>
                                    <Icon link name='plus'/>
                                </Button>}
                            />
                            <Grid relaxed textAlign={"right"} columns={3}>
                                {
                                    subjects.map((subject, index) => {
                                        return <Grid.Row key={index} columns='equal' className={"subjectListItem"}>
                                            <Grid.Column>
                                                {this.state.editIconVisible ?
                                                    <label>{subject} </label> :
                                                    <Form.Input
                                                        focus
                                                        placeholder={subject}
                                                        onChange={(event, data) => this.setState({editedSubject: data.value})}
                                                    />
                                                }
                                            </Grid.Column>
                                            <Grid.Column>
                                                {this.state.editIconVisible ?
                                                    <Icon link name='edit'
                                                          className={"subjectListIcon"}
                                                          onClick={() => this.setState({
                                                              editIconVisible: false,
                                                              approveIconVisible: true
                                                          })}
                                                    />
                                                    :
                                                    <Icon link name='check'
                                                          className={"subjectListIcon"}
                                                          onClick={this.editSubject.bind(this, index, this.state.editedSubject)}/>
                                                }
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Icon link name='delete'
                                                      className={"subjectListIcon"}
                                                      onClick={this.removeSubject.bind(this, subject)}/>
                                            </Grid.Column>
                                        </Grid.Row>
                                    })
                                }
                            </Grid>
                        </Form.Field>
                        : null
                    }
                </Form.Group>

                <Form.Group widths='equal'>
                    {this.appointmentRoleDetailsVisible() ?
                        <Form.Input
                            error={this.state.fieldOperationTimeError}
                            required
                            label="זמן פעילות"
                            // type="number"
                            name="operationTime"
                            // value={operationTime}
                            onFocus={this.handleFocus}
                        >
                            <Grid relaxed={"very"} textAlign={"right"} container columns={'equal'}>
                                {
                                    Object.keys(strings.days).map((item, index) => {
                                        if (index < 6)
                                            return <Grid.Column key={index} className={"subjectListItem"}>
                                                <Grid.Row>
                                                    <Checkbox
                                                        toggle
                                                        checked={operationTime.filter(dayTimes =>
                                                            Object.keys(dayTimes).some(day => dayTimes[day].includes(item))).length > 0}
                                                        // onChange={this.onChangeRoles.bind(this)}
                                                        onChange={(event, data) => this.toggleDayToOperationTime(event, data, index)}
                                                        value={item}
                                                        name="operationTime"
                                                        onFocus={this.handleFocus}
                                                    />
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <label>
                                                        {strings.days[item]}
                                                    </label>
                                                </Grid.Row>

                                                <Grid.Row>
                                                    {operationTimeDaySelected[index] ?
                                                        <div>
                                                            <label>שעת התחלה</label>
                                                            <Datetime
                                                                inputProps={{style: {width: (100 + '%')}}}
                                                                label='שעת התחלה'
                                                                // value={this.state.startTimeSelected[index]}
                                                                locale={'he'}
                                                                dateFormat={false}
                                                                install
                                                                // name="startTime"
                                                                ref={'refStartTime' + index}
                                                                onChange={time => {
                                                                    let startTimeSelected = this.state.startTimeSelected;
                                                                    startTimeSelected[index] = moment(time).format("HH:mm");
                                                                    this.setState(startTimeSelected);
                                                                }}
                                                                onFocus={this.handleFocus}
                                                            />
                                                            <label>שעת סיום</label>
                                                            <Datetime
                                                                inputProps={{style: {width: (100 + '%')}}}
                                                                label='שעת סיום'
                                                                // value={this.state.endTimeSelected[index]}
                                                                locale={'he'}
                                                                dateFormat={false}
                                                                install
                                                                // name="endTime"
                                                                onChange={time => {
                                                                    let endTimeSelected = this.state.endTimeSelected;
                                                                    endTimeSelected[index] = moment(time).format("HH:mm");
                                                                    this.setState(endTimeSelected);
                                                                }}
                                                                onFocus={this.handleFocus}
                                                            />
                                                            <Button icon onClick={() => this.addHours(item, index)}>
                                                                <Icon link name='plus'/>
                                                            </Button>
                                                            <List relaxed={'very'}>
                                                                {
                                                                    operationTime.filter(dayTime => dayTime.day === item).length > 0 ?
                                                                        operationTime.filter(dayTime => dayTime.day === item)[0].hours.map((hour, index) => {
                                                                            return <List.Item key={index}>
                                                                                {hour.startHour} - {hour.endHour}
                                                                                <Icon link name='delete'
                                                                                      className={"subjectListIcon"}
                                                                                      onClick={() => this.removeHours(item, hour)}
                                                                                />
                                                                            </List.Item>
                                                                        })
                                                                        : null
                                                                }
                                                            </List>
                                                        </div>
                                                        : null
                                                    }
                                                </Grid.Row>
                                            </Grid.Column>
                                    })
                                }
                            </Grid>
                        </Form.Input>
                        : null
                    }
                </Form.Group>


                {formError ?
                    <Message
                        error
                        header='פרטי נותן שירות חסרים'
                        content={this.state.formErrorMassage === "" ? 'נא להשלים את השדות החסרים' : this.state.formErrorMassage}
                    />
                    : null
                }
                {formComplete ?
                    <Message success header='פרטי נותן שירות הושלמו' content="נותן שירות נוסף בהצלחה"/>
                    : null
                }

                <Form.Group style={{marginTop: 20}}>
                    <Form.Button positive type="submit" onClick={this.handleSubmit}>{submitText}</Form.Button>
                    <Form.Button negative onClick={handleCancel}>בטל</Form.Button>
                    <Form.Button onClick={this.handleClear}>נקה הכל</Form.Button>
                </Form.Group>

            </Form>
        );
    }
}

export default ServiceProviderForm;