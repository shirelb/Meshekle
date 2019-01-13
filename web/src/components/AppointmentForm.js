import React, {Component} from 'react';
import {Button, Form, Input, Message, Radio, Select, TextArea} from 'semantic-ui-react';
import {post} from "axios";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const options = [
    {key: 'f', text: 'Fan', value: 'Fan'},
    {key: 'hd', text: 'Hair dye', value: 'HairDye'},
    {key: 'hc', text: 'Hair cut', value: 'HairCut'},
];

class AppointmentForm extends Component {

    constructor(props) {
        super(props);

        const {slotInfo,appointment = {}} = props;

        this.state = {
            appointment: {},
            date: slotInfo.start,
            startTime: '10:00',
            endTime: '11:00',
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

        handleSubmit(appointment);

        this.setState({appointment: {}});
    }

    handleChange(e, {name, value}) {
        const {appointment} = this.state;

        this.setState({appointment: {...appointment, [name]: value}});
    }

    onChange = date => this.setState({ date });
    onChangeTime = time => this.setState({ time });


    render() {
        const {value, appointment} = this.state;
        const {handleCancel, submitText = 'Create'} = this.props;

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group widths='equal'>
                    {/*<Form.Field inline>*/}
                        {/*<label>First name</label>*/}
                        {/*<Input placeholder='First name'/>*/}
                    {/*</Form.Field>*/}
                    <Form.Field control={Input} label='Client name' placeholder='First name' error/>
                    <Form.Field control={Select} label='Type Of Treatment' options={options} placeholder='Type'
                                error/>
                </Form.Group>
                {/*<Form.Group inline>*/}
                    {/*<label>Quantity</label>*/}
                    {/*<Form.Field*/}
                        {/*control={Radio}*/}
                        {/*label='One'*/}
                        {/*value='1'*/}
                        {/*checked={value === '1'}*/}
                        {/*onChange={this.handleChange}*/}
                    {/*/>*/}
                    {/*<Form.Field*/}
                        {/*control={Radio}*/}
                        {/*label='Two'*/}
                        {/*value='2'*/}
                        {/*checked={value === '2'}*/}
                        {/*onChange={this.handleChange}*/}
                    {/*/>*/}
                    {/*<Form.Field*/}
                        {/*control={Radio}*/}
                        {/*label='Three'*/}
                        {/*value='3'*/}
                        {/*checked={value === '3'}*/}
                        {/*onChange={this.handleChange}*/}
                    {/*/>*/}
                {/*</Form.Group>*/}
                {/*<Form.Group grouped>*/}
                    {/*<label>HTML radios</label>*/}
                    {/*<Form.Field label='This one' control='input' type='radio' name='htmlRadios'/>*/}
                    {/*<Form.Field label='That one' control='input' type='radio' name='htmlRadios'/>*/}
                {/*</Form.Group>*/}
                <Form.Group grouped>
                    <label>HTML checkboxes</label>
                    <Form.Field label='This one' control='input' type='checkbox'/>
                    <Form.Field label='That one' control='input' type='checkbox'/>
                </Form.Group>
                <Form.Field control={TextArea} label='About' placeholder='Tell us more about you...'/>
                <Message success header='Form Completed' content="You're all signed up for the newsletter"/>
                <Message
                    warning
                    header='Could you check something!'
                    list={[
                        'That e-mail has been subscribed, but you have not yet clicked the verification link in your e-mail.',
                    ]}
                />
                <Message
                    error
                    header='Action Forbidden'
                    content='You can only sign up for an account once with a given e-mail address.'
                />

                {/*<Form.Input*/}
                    {/*label="Date"*/}
                    {/*as={DateTimePicker}*/}
                    {/*name="date"*/}
                    {/*onChange={this.onChange}*/}
                    {/*value={this.state.date}*/}
                {/*/>*/}
                {/*<DateTimePicker*/}
                {/*onChange={this.onChange}*/}
                {/*value={this.state.date}*/}
                {/*locale={'he-IL'}*/}
                {/*/>*/}
                {/*</Form.Input>*/}

                <Form.Group>
                    <label>date and time</label>
                    <Datetime
                    /*<Form.Field*/
                        /*label='date'*/
                        /*as={Datetime}*/
                        onChange={this.onChange}
                        value={this.state.date}
                        locale={'he'}
                        timeFormat={false}
                        install
                    />
                    <Datetime
                    /*<Form.Field*/
                        // label='start time'
                        // as={Datetime}
                        onChange={this.onChangeTime}
                        value={this.state.startTime}
                        locale={'he'}
                        dateFormat={false}
                        install
                    />
                    <Datetime
                    /*<Form.Field*/
                        // label='end time'
                        // as={Datetime}
                        onChange={this.onChangeTime}
                        value={this.state.endTime}
                        locale={'he'}
                        dateFormat={false}
                        install
                    />
                    {/*<Form.Field*/}
                        {/*label='time range'*/}
                        {/*as={TimeRangePicker}*/}
                        {/*onChange={this.onChangeTime}*/}
                        {/*value={this.state.time}*/}
                        {/*locale={'he-IL'}*/}
                    {/*/>*/}
                </Form.Group>

                {/*<DatePicker*/}
                    {/*onChange={this.onChange}*/}
                    {/*value={this.state.date}*/}
                    {/*locale={'he-IL'}*/}
                {/*/>*/}

                {/*<TimePicker*/}
                    {/*onChange={this.onChange}*/}
                    {/*value={this.state.time}*/}
                {/*/>*/}

                {/*<TimeRangePicker*/}
                    {/*onChange={this.onChangeTime}*/}
                    {/*value={this.state.time}*/}
                    {/*locale={'he-IL'}*/}
                {/*/>*/}

                <Form.Input
                    label="Name"
                    type="text"
                    name="name"
                    value={appointment.name}
                    onChange={this.handleChange}
                />
                <Form.Input
                    label="Email"
                    type="email"
                    name="email"
                    value={appointment.email}
                    onChange={this.handleChange}
                />
                <Form.Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={appointment.phone}
                    onChange={this.handleChange}
                />
                <Form.Input
                    label="Address"
                    type="text"
                    name="address"
                    value={appointment.address}
                    onChange={this.handleChange}
                />
                <Form.Input
                    label="City"
                    type="text"
                    name="city"
                    value={appointment.city}
                    onChange={this.handleChange}
                />
                <Form.Input
                    label="Zip Code"
                    type="text"
                    name="zip"
                    value={appointment.zip}
                    onChange={this.handleChange}
                />
                <Form.Group>
                    <Form.Button type="submit">{submitText}</Form.Button>
                    <Form.Button onClick={handleCancel}>Cancel</Form.Button>
                </Form.Group>

            </Form>
        )
    }
}

export default AppointmentForm