import React, {Component} from 'react';
import {Button, Dropdown, Form, Message, Modal, TextArea} from 'semantic-ui-react';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../styles.css';
import serviceProvidersStorage from "../../storage/serviceProvidersStorage";
import store from "store";
import strings from "../../shared/strings";
import mappers from "../../shared/mappers";


class AppointmentForm extends Component {

    constructor(props) {
        super(props);

        const {slotInfo, appointment, appointmentRequestEvent, userOptions, serviceProviderRoles} = props;


        this.state = {
            formError: false,
            formErrorHeader: "",
            formErrorContent: "",
            formComplete: false,
            isAlertModal: false,

            subjectOptions: [],
        };

        if (userOptions === undefined || serviceProviderRoles === undefined) {
            Object.assign(this.state, {
                appointment: {
                    date: '',
                    startTime: '',
                    endTime: '',
                    subject: [],
                    clientName: '',
                    role: '',
                    remarks: '',
                },
                subjectOptions: [],
            });
        } else if (slotInfo) {
            // console.log('slotInfo ', slotInfo);
            // this.state = {
            Object.assign(this.state, {
                appointment: {
                    date: moment.isMoment(slotInfo.start) ? moment(slotInfo.start).format('YYYY-MM-DD') : '',
                    startTime: moment.isMoment(slotInfo.start) ? moment(slotInfo.start).format("HH:mm") : '',
                    endTime: moment.isMoment(slotInfo.end) ? moment(slotInfo.end).format("HH:mm") : '',
                    subject: [],
                    clientName: '',
                    role: '',
                    remarks: '',
                },
                subjectOptions: [],
            });
        } else if (appointment) {
            // this.state = {
            Object.assign(this.state, {
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
            });
        } else if (appointmentRequestEvent) {
            // let role = strings.roles[appointmentRequestEvent.appointmentRequest.AppointmentDetail.role];
            // this.state = {
            Object.assign(this.state, {
                appointment: {
                    date: moment(appointmentRequestEvent.start).format("YYYY-MM-DD"),
                    startTime: moment(appointmentRequestEvent.start).format("HH:mm"),
                    endTime: moment(appointmentRequestEvent.end).format("HH:mm"),
                    subject: JSON.parse(appointmentRequestEvent.appointmentRequest.AppointmentDetail.subject),
                    clientName: appointmentRequestEvent.appointmentRequest.clientName,
                    remarks: appointmentRequestEvent.appointmentRequest.notes,
                    role: appointmentRequestEvent.appointmentRequest.AppointmentDetail.role,
                    // Object.keys(strings.roles).find(role =>
                    // strings.roles[role] === appointmentRequestEvent.appointmentRequest.AppointmentDetail.role) === undefined ?
                    // strings.roles[appointmentRequestEvent.appointmentRequest.AppointmentDetail.role]
                    // :
                    // Object.keys(strings.roles).find(role => strings.roles[role] === appointmentRequestEvent.appointmentRequest.AppointmentDetail.role),
                },
                appointmentRequestEvent: appointmentRequestEvent,
                subjectOptions: [],
            });
        }

        // this.getServiceProviderRoles();

        // console.log('constructor  state', this.state);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getSubjectsOfServiceProviderRole = (currentRole, calledFromConstructor) => {
        let subjectOptions = [];
        serviceProvidersStorage.getServiceProviderById(store.get('serviceProviderId'))
            .then(serviceProviders => {
                if (serviceProviders.response) {
                    if (serviceProviders.response.status !== 200)
                        this.setState({
                            formError: true,
                            formErrorHeader: 'קרתה שגיאה בעת הבאת הנושאים של נותן השירות',
                            formErrorContent: mappers.errorMapper(serviceProviders.response)
                        });
                } else {
                    let serviceProvider = serviceProviders.filter(provider => provider.role === currentRole)[0];
                    if(serviceProvider) {
                        JSON.parse(serviceProvider.subjects).map((subject, index) => {
                            subjectOptions.push({key: index, text: subject, value: subject});
                        });

                        calledFromConstructor ?
                            Object.assign(this.state, {subjectOptions: subjectOptions})
                            :
                            this.setState({subjectOptions: subjectOptions})
                    }
                }
            });
    };

    componentWillReceiveProps(nextProps) {
        const {appointment, appointmentRequestEvent} = nextProps;
        // this.getServiceProviderRoles();

        if (appointment) {
            this.setState({
                appointment: {
                    date: moment(appointment.startDateAndTime).format("YYYY-MM-DD"),
                    startTime: moment(appointment.startDateAndTime).format("HH:mm"),
                    endTime: moment(appointment.endDateAndTime).format("HH:mm"),
                    role: appointment.AppointmentDetail.role,
                    subject: JSON.parse(appointment.AppointmentDetail.subject),
                    clientName: appointment.clientName,
                    remarks: appointment.remarks,
                },
            });

            this.getSubjectsOfServiceProviderRole(appointment.AppointmentDetail.role, false);
        }
        if (appointmentRequestEvent) {
            this.setState({
                appointmentRequestEvent: appointmentRequestEvent,
            });

            this.getSubjectsOfServiceProviderRole(appointmentRequestEvent.appointmentRequest.AppointmentDetail.role, false);
        }

        // console.log('will recive props  ', this.state.appointment);
        // console.log('will recive props  ', appointment);
    }

    handleSubmit(e) {
        e.preventDefault();

        const {appointment} = this.state;
        const {handleSubmit, userOptions} = this.props;

        if (appointment.clientName !== '' &&
            appointment.role !== '' &&
            appointment.subject.length > 0 &&
            appointment.date !== '' &&
            appointment.startTime !== '' &&
            appointment.endTime !== '' &&
            moment(appointment.startTime, 'h:mma').isBefore(moment(appointment.endTime, 'h:mma'))) {

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

            handleSubmit(updateAppointment)
                .then(res => {
                    if (res.response) {
                        if (res.response.status !== 200)
                            this.setState({
                                formError: true,
                                formErrorHeader: 'קרתה שגיאה בעת הוספת התור',
                                formErrorContent: mappers.errorMapper(res.response)
                            });
                    } else
                        this.setState({appointment: {}});
                });
        } else {
            !moment(appointment.startTime, 'h:mma').isBefore(moment(appointment.endTime, 'h:mma')) ?
                this.setState({
                    formError: true,
                    formErrorHeader: 'פרטי תור לא תקינים',
                    formErrorContent: 'שעת התחלה צריכה להיות קטנה משעת הסיום'
                })
                :
                this.setState({
                    formError: true,
                    formErrorHeader: 'פרטי תור חסרים',
                    formErrorContent: 'נא להשלים את השדות החסרים'
                });
        }
    }

    handleChange(e, {name, value}) {
        const {appointment} = this.state;

        this.setState({formError: false, formErrorHeader: '', formErrorContent: '', formComplete: false});
        this.setState({appointment: {...appointment, [name]: value}});

        if (name === "role")
            this.getSubjectsOfServiceProviderRole(value, false);
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
            formErrorHeader: "",
            formErrorContent: "",
            formComplete: false,
        });
    };

    onChangeDate = date => {
        this.setState({formError: false, formErrorHeader: '', formErrorContent: '', formComplete: false});

        let updateAppointment = this.state.appointment;
        updateAppointment.date = moment(date).format("YYYY-MM-DD");
        this.setState({appointment: updateAppointment})
    };

    onChangeTime = (time, isStart) => {
        this.setState({formError: false, formErrorHeader: '', formErrorContent: '', formComplete: false});

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
        const {appointment, formError, formErrorHeader, formErrorContent, formComplete} = this.state;
        const {handleCancel, submitText, userOptions, serviceProviderRoles} = this.props;
        let rolesOptions = [];

        if (serviceProviderRoles)
            if (Array.isArray(serviceProviderRoles))
                rolesOptions = serviceProviderRoles.map((item, index) =>
                    ({
                        key: index,
                        text: strings.roles[item],
                        value: item
                    })
                );


        // console.log('sasaaads ', this.state);

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
                        header={formErrorHeader}
                        content={formErrorContent}
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