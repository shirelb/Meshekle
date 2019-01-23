import React, {Component} from 'react';
import {Dropdown, Form, Message, TextArea} from 'semantic-ui-react';
import {post} from "axios";
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import helpers from "../shared/helpers";
import './styles.css';


const subjectOptions = [
    {key: 'f', text: 'פן', value: 'פן'},
    {key: 'hd', text: 'צבע', value: 'צבע'},
    {key: 'hc', text: 'תספורת', value: 'תספורת'},
];

let userOptions = {};

helpers.getUsers()
    .then(users => {
        console.log('users ', users);
        userOptions = users.map(item => ({
            key: item.userId,
            text: item.fullname,
            value: item.fullname
        }));
    });


class AppointmentForm extends Component {

    constructor(props) {
        super(props);

        const {slotInfo, appointment = {}} = props;

        this.state = {
            appointment: {
                date: moment(slotInfo.start),
                startTime: '',
                endTime: '',
                subject: [],
                clientName: '',
            },
            formError: false,
            formComplete: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {appointment} = nextProps;

        this.setState({appointment});
    }

    handleSubmit(e) {
        e.preventDefault();
        const {appointment} = this.state;
        const {handleSubmit} = this.props;

        if (appointment.clientName !== '' &&
            appointment.subject.length > 0 &&
            appointment.date !== '' &&
            appointment.startTime !== '' &&
            appointment.endTime !== '') {
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
    }

    handleClear = (e) => {
        e.preventDefault();
        this.setState({
            appointment: {
                date: '',
                startTime: '',
                endTime: '',
                subject: [],
                clientName: '',
                formError: false,
                formComplete: false,
            },
        });
    };

    onChangeDate = date => {
        let updateAppointment = this.state.appointment;
        updateAppointment.date = date;
        this.setState({appointment: updateAppointment})
    };

    onChangeTime = (time, isStart) => {
        let updateAppointment = this.state.appointment;
        isStart ?
            updateAppointment.startTime = time
            :
            updateAppointment.endTime = time;
        this.setState({appointment: updateAppointment});
    };

    handleSearchChange = (e, {searchQuery}) => {
        let updateAppointment = this.state.appointment;
        updateAppointment.subject = searchQuery;
        this.setState({appointment: updateAppointment})
    };


    render() {
        const {appointment, formError, formComplete} = this.state;
        const {handleCancel, submitText = 'קבע'} = this.props;

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
                    label='נושא'
                    placeholder='נושא'
                    fluid
                    multiple
                    selection
                    options={subjectOptions}
                    value={appointment.subject}
                    onChange={this.handleChange}
                    name='subject'
                    required
                    noResultsMessage='לא נמצאו התאמות'
                    onSearchChange={this.handleSearchChange}
                    // width='10'
                />
                <Form.Field
                    control={TextArea}
                    label='הערות'
                    value={appointment.remarks}
                    name="remarks"
                    onChange={this.handleChange}
                    // width='10'
                />

                <Form.Group widths='equal'>
                    <Form.Field
                        as={Datetime}
                        label='תאריך'
                        value={appointment.date}
                        locale={'he'}
                        timeFormat={false}
                        install
                        // name="date"
                        onChange={this.onChangeDate.bind(this)}
                        required
                        // width='10'
                    />
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

                <Form.Group>
                    <Form.Button type="submit">{submitText}</Form.Button>
                    <Form.Button onClick={handleCancel}>בטל</Form.Button>
                    <Form.Button onClick={this.handleClear}>נקה הכל</Form.Button>
                </Form.Group>

            </Form>
        )
    }
}

export default AppointmentForm