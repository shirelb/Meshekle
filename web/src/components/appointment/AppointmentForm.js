import React, {Component} from 'react';
import {Button, Dropdown, Form, Message, Modal, TextArea} from 'semantic-ui-react';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../styles.css';
import usersStorage from "../../storage/usersStorage";
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import store from "store";
import strings from "../../shared/strings";


let userOptions = {};

usersStorage.getUsers()
    .then(users => {
        console.log('users ', users);
        if (Array.isArray(users))
            userOptions = users.filter(u => u.active).map(item =>
                ({
                    key: item.userId,
                    text: item.fullname,
                    value: item.fullname
                })
            )
    });


let rolesOptions = {};

serviceProvidersStorage.getServiceProviderById(store.get("serviceProviderId"))
    .then(serviceProvidersFound => {
        console.log('serviceProvidersFound ', serviceProvidersFound);
        if (Array.isArray(serviceProvidersFound))
            rolesOptions = serviceProvidersFound.filter(provider => provider.role.includes("appointments")).map((item, index) =>
                ({
                    key: index,
                    text: strings.roles[item.role],
                    value: item.role
                })
            )
    });


class AppointmentForm extends Component {

    constructor(props) {
        super(props);

        const {slotInfo, appointment, appointmentRequestEvent} = props;

        this.state = {
            formError: false,
            formComplete: false,
            isAlertModal: false,

            subjectOptions: [],
        };


        if (slotInfo) {
            console.log('slotInfo ', slotInfo);
            this.state = {
                appointment: {
                    date: moment.isMoment(slotInfo.start) ? moment(slotInfo.start).format('YYYY-MM-DD') : '',
                    startTime: moment.isMoment(slotInfo.start) ? moment(slotInfo.start).format("HH:mm") : '',
                    endTime: moment.isMoment(slotInfo.end) ? moment(slotInfo.end).format("HH:mm") : '',
                    subject: [],
                    clientName: '',
                    role: '',
                },
                subjectOptions: [],
            };
        } else if (appointment) {
            this.state = {
                appointment: {
                    date: moment(appointment.startDateAndTime).format("YYYY-MM-DD"),
                    // date: moment(appointment.startDateAndTime),
                    startTime: moment(appointment.startDateAndTime).format("HH:mm"),
                    endTime: moment(appointment.endDateAndTime).format("HH:mm"),
                    role: appointment.AppointmentDetail.role,
                    subject: JSON.parse(appointment.AppointmentDetail.subject),
                    clientName: appointment.clientName,
                    remarks: appointment.remarks,
                },
                subjectOptions: [],
            };
        } else if (appointmentRequestEvent) {
            this.state = {
                appointment: {
                    date: moment(appointmentRequestEvent.start).format("YYYY-MM-DD"),
                    // date: moment(appointment.startDateAndTime),
                    startTime: moment(appointmentRequestEvent.start).format("HH:mm"),
                    endTime: moment(appointmentRequestEvent.end).format("HH:mm"),
                    subject: JSON.parse(appointmentRequestEvent.appointmentRequest.AppointmentDetail.subject),
                    clientName: appointmentRequestEvent.appointmentRequest.clientName,
                    remarks: appointmentRequestEvent.appointmentRequest.notes,
                    role: appointmentRequestEvent.appointmentRequest.AppointmentDetail.role,
                },
                appointmentRequestEvent: appointmentRequestEvent,
                subjectOptions: [],
            };
        }

        console.log('constructor  state', this.state);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getSubjectsOfServiceProviderRole = () => {
        let subjectOptions = [];
        serviceProvidersStorage.getServiceProviderById(store.get('serviceProviderId'))
            .then(serviceProviders => {
                let serviceProvider = serviceProviders.filter(provider => provider.role === this.state.appointment.role)[0];
                JSON.parse(serviceProvider.subjects).map((subject, index) => {
                    subjectOptions.push({key: index, text: subject, value: subject});
                });
                this.setState({subjectOptions: subjectOptions})
            });
    };

    componentWillReceiveProps(nextProps) {
        const {appointment, appointmentRequestEvent} = nextProps;

        if (appointment) {
            this.setState({
                appointment: {
                    date: moment(appointment.startDateAndTime).format("YYYY-MM-DD"),
                    // date: moment(appointment.startDateAndTime),
                    startTime: moment(appointment.startDateAndTime).format("HH:mm"),
                    endTime: moment(appointment.endDateAndTime).format("HH:mm"),
                    role: appointment.AppointmentDetail.role,
                    subject: JSON.parse(appointment.AppointmentDetail.subject),
                    clientName: appointment.clientName,
                    remarks: appointment.remarks,
                },
            })
        }
        if (appointmentRequestEvent) {
            this.setState({
                /* appointment: {
                     date: moment(appointmentRequestEvent.start).format("YYYY-MM-DD"),
                     // date: moment(appointment.startDateAndTime),
                     startTime: moment(appointmentRequestEvent.start).format("HH:mm"),
                     endTime: moment(appointmentRequestEvent.end).format("HH:mm"),
                     subject: JSON.parse(appointmentRequestEvent.appointmentRequest.AppointmentDetail.subject),
                     clientName: appointmentRequestEvent.appointmentRequest.clientName,
                     remarks: appointmentRequestEvent.appointmentRequest.notes,
                 },*/
                appointmentRequestEvent: appointmentRequestEvent,
            })
        }

        this.getSubjectsOfServiceProviderRole();

        console.log('will recive props  ', this.state.appointment);
        console.log('will recive props  ', appointment);
    }

    handleSubmit(e) {
        e.preventDefault();

        const {appointment} = this.state;
        const {handleSubmit} = this.props;

        if (appointment.clientName !== '' &&
            appointment.role !== '' &&
            appointment.subject.length > 0 &&
            appointment.date !== '' &&
            appointment.startTime !== '' &&
            appointment.endTime !== '') {

            if (this.state.appointmentRequestEvent) {
                if (!this.state.isAlertModal)
                    if (this.checkIfDateTimesWithInOptional('warning')) {
                        this.setState({isAlertModal: true});
                        return;
                    }
                this.setState({isAlertModal: false});
            }

            this.setState({formComplete: true});
            let updateAppointment = appointment;
            updateAppointment.clientId = (userOptions.filter(user => user.value === appointment.clientName))[0].key;
            this.setState({appointment: updateAppointment});

            handleSubmit(updateAppointment);
            this.setState({appointment: {}});
        } else {
            this.setState({formError: true});
        }
    }

    handleChange(e, {name, value}) {
        const {appointment} = this.state;

        this.setState({formError: false, formComplete: false});
        this.setState({appointment: {...appointment, [name]: value}});

        if (name === "role")
            this.getSubjectsOfServiceProviderRole();
    }

    handleClear = (e) => {
        e.preventDefault();
        this.setState({
            appointment: {
                date: '',
                startTime: '',
                endTime: '',
                role: '',
                subject: [],
                clientName: '',
                remarks: '',
            },
            formError: false,
            formComplete: false,
        });
    };

    onChangeDate = date => {
        let updateAppointment = this.state.appointment;
        updateAppointment.date = moment(date).format("YYYY-MM-DD");
        this.setState({appointment: updateAppointment})
    };

    onChangeTime = (time, isStart) => {
        let updateAppointment = this.state.appointment;
        isStart ?
            updateAppointment.startTime = moment(time).format("HH:mm")
            :
            updateAppointment.endTime = moment(time).format("HH:mm");
        this.setState({appointment: updateAppointment});
    };

    handleSearchChange = (e, {searchQuery}) => {
        let updateAppointment = this.state.appointment;
        updateAppointment.subject = searchQuery;
        this.setState({appointment: updateAppointment})
    };

    checkIfDateTimesWithInOptional = (typeOfMsg) => {
        var found = false;
        const appointmentDate = moment.isMoment(this.state.appointment.date) ? this.state.appointment.date : moment(this.state.appointment.date);
        const appointmentStartTime = moment.isMoment(this.state.appointment.startTime) ? this.state.appointment.startTime : moment(this.state.appointment.date + " " + this.state.appointment.startTime);
        const appointmentEndTime = moment.isMoment(this.state.appointment.endTime) ? this.state.appointment.endTime : moment(this.state.appointment.date + " " + this.state.appointment.endTime);
        const dateTimesArray = this.state.appointmentRequestEvent.appointmentRequest.optionalTimes.filter(e => moment(e.date).isSame(moment(appointmentDate)));
        if (dateTimesArray.length > 0) {
            dateTimesArray.forEach(dateTime => {
                const appointmentStartDateTime = moment(appointmentDate.format("YYYY-MM-DD") + ' ' + appointmentStartTime.format("HH:mm"));
                const appointmentEndDateTime = moment(appointmentDate.format("YYYY-MM-DD") + ' ' + appointmentEndTime.format("HH:mm"));
                dateTime.hours.forEach(times => {
                    const optionalStartDateTime = moment(dateTime.date + ' ' + times.startHour);
                    const OptionalEndDateTime = moment(dateTime.date + ' ' + times.endHour);
                    if (appointmentStartDateTime.isBetween(optionalStartDateTime, OptionalEndDateTime, null, '[]') &&
                        appointmentEndDateTime.isBetween(optionalStartDateTime, OptionalEndDateTime, null, '[]')) {
                        found = true;
                    }
                });
                if (found)
                    return typeOfMsg === 'info';
            });
            if (found)
                return typeOfMsg === 'info';
        }
        return typeOfMsg === 'warning';
    };

    render() {
        const {appointment, formError, formComplete} = this.state;
        const {handleCancel, submitText} = this.props;

        console.log('sasaaads ', this.state);

        return (
            <Form onSubmit={this.handleSubmit} error={formError}>
                <Form.Field
                    control={Dropdown}
                    label='שם לקוח'
                    placeholder='שם לקוח'
                    fluid
                    search
                    selection
                    autoComplete='on'
                    options={userOptions}
                    value={appointment.clientName}
                    onChange={this.handleChange}
                    name='clientName'
                    required
                    noResultsMessage='לא נמצאו התאמות'
                    // width='10'
                />
                <Form.Field
                    control={Dropdown}
                    label='ענף'
                    placeholder='ענף'
                    fluid
                    // search
                    selection
                    autoComplete='on'
                    options={rolesOptions}
                    value={appointment.role}
                    onChange={this.handleChange}
                    name='role'
                    required
                    noResultsMessage='לא נמצאו ענפים'
                    // onSearchChange={this.handleSearchChange}
                    // width='10'
                />
                {appointment.role ?
                    <Form.Field
                        control={Dropdown}
                        label='נושא'
                        placeholder='נושא'
                        fluid
                        search
                        multiple
                        selection
                        options={this.state.subjectOptions}
                        value={appointment.subject}
                        onChange={this.handleChange}
                        name='subject'
                        required
                        noResultsMessage='לא נמצאו התאמות'
                        onSearchChange={this.handleSearchChange}
                        // width='10'
                    />
                    : null
                }
                <Form.Field
                    control={TextArea}
                    label='הערות'
                    value={appointment.remarks}
                    name="remarks"
                    onChange={this.handleChange}
                    // width='10'
                />

                <Form.Group widths='equal'>
                    <label>תאריך</label>
                    <Form.Field
                        as={Datetime}
                        label='תאריך'
                        value={appointment.date}
                        // locale={'he'}
                        timeFormat={false}
                        install
                        // name="date"
                        onChange={this.onChangeDate.bind(this)}
                        required
                        // width='10'
                    />
                    <label>שעת התחלה</label>
                    <Form.Field
                        as={Datetime}
                        label='שעת התחלה'
                        value={appointment.startTime}
                        locale={'he'}
                        dateFormat={false}
                        install
                        // name="startTime"
                        onChange={time => this.onChangeTime(time, true)}
                        required
                        // width='10'
                    />
                    <label>שעת סיום</label>
                    <Form.Field
                        as={Datetime}
                        label='שעת סיום'
                        value={appointment.endTime}
                        locale={'he'}
                        dateFormat={false}
                        install
                        // name="endTime"
                        onChange={time => this.onChangeTime(time, false)}
                        // onChange={this.handleChange}
                        required
                        // width='10'
                    />
                </Form.Group>

                {this.state.appointmentRequestEvent ?
                    (<div>
                            <Message info={this.checkIfDateTimesWithInOptional('info')}
                                     warning={this.checkIfDateTimesWithInOptional('warning')}
                                     visible
                            >
                                <Message.Header>זמנים אוצפיונאליים מהבקשה לתור</Message.Header>
                                <Message.List>
                                    {/*{Array.isArray(this.state.appointmentRequestEvent.appointmentRequest.optionalTimes) &&*/}
                                    {this.state.appointmentRequestEvent.appointmentRequest.optionalTimes.map((datesTimes, j) =>
                                        (
                                            <Message.Item key={j}>
                                                <Message.Content>
                                                    <Message.List>{moment(datesTimes.date).format('DD.MM.YYYY')}:</Message.List>
                                                    <Message.List>
                                                        {/*{Array.isArray(datesTimes.hours) &&*/}
                                                        {datesTimes.hours.map((time, k) =>
                                                            (
                                                                <Message.Item key={k}>
                                                                    <Message.Content>
                                                                        <Message.List>{time.startHour}-{time.endHour}</Message.List>
                                                                    </Message.Content>
                                                                </Message.Item>
                                                            ),
                                                        )}
                                                    </Message.List>
                                                </Message.Content>
                                            </Message.Item>
                                        ),
                                    )}
                                </Message.List>
                            </Message>

                            {/*< Message
                                error
                                header='שים לב, התאריך או השעות אינם בין התאריכים והשעות הפוטנציאליים של הלקוח'
                                content='זה בסדר, בהנחה שדיברת עם הלקוח והוא הסכים'
                                visible={this.checkIfDateTimesWithInOptional('warning')}
                            />*/}

                            <Modal
                                open={this.state.isAlertModal}
                                size='small'
                                dimmer={"blurring"}
                            >
                                <Modal.Header>שים לב! האם את/ה בטוח?</Modal.Header>
                                <Modal.Content>
                                    <Message
                                        error
                                        header='שים לב, התאריך או השעות אינם בין התאריכים והשעות הפוטנציאליים של הלקוח'
                                        content='זה בסדר, בהנחה שדיברת עם הלקוח והוא הסכים'
                                        // visible={this.checkIfDateTimesWithInOptional('warning')}
                                        visible
                                    />
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button
                                        positive
                                        // labelPosition='right'
                                        content='כן אני בטוח'
                                        onClick={this.handleSubmit}
                                    />
                                    <Button content='לא אני רוצה לשנות'
                                            onClick={() => this.setState({isAlertModal: false})}/>
                                </Modal.Actions>
                            </Modal>
                        </div>
                    ) : null

                }

                {formError ?
                    <Message
                        error
                        header='פרטי תור חסרים'
                        content='נא להשלים את השדות החסרים'
                    />
                    : null
                }
                {formComplete ?
                    <Message success header='פרטי תור הושלמו' content="התור נקבע בהצלחה"/>
                    : null
                }

                <Form.Group style={{marginTop: 20}}>
                    <Form.Button positive type="submit">{submitText}</Form.Button>
                    <Form.Button negative onClick={handleCancel}>בטל</Form.Button>
                    <Form.Button onClick={this.handleClear}>נקה הכל</Form.Button>
                </Form.Group>

            </Form>
        )
    }
}

export default AppointmentForm