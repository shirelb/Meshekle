import React from 'react';
import {Form, Label, Message, Checkbox} from 'semantic-ui-react';
import moment from "moment";
import Datetime from 'react-datetime';

class UserForm extends React.Component {
    constructor(props) {
        super(props);

        const {user} = props;

        this.state = {
            formError: false,
            formComplete: false,
            isAlertModal: false,
        };

        if (user) {
            this.state = {
                user: {
                    userId: user.userId,
                    fullname: user.fullname,
                    password: user.password,
                    email: user.email,
                    mailbox: user.mailbox,
                    cellphone: user.cellphone,
                    phone: user.phone,
                    // bornDate: moment(user.bornDate).format("DD/MM/YYYY"),
                    bornDate: moment(user.bornDate),
                    active: user.active,
                    image: user.image,
                },
            };
        } else {
            this.state = {
                user: {
                    userId: '',
                    fullname: '',
                    password: '',
                    email: '',
                    mailbox: 0,
                    cellphone: '',
                    phone: '',
                    bornDate: null,
                    active: true,
                    image: null,
                },
            };
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {user} = nextProps;

        if (user) {
            this.setState({
                user: {
                    userId: user.userId,
                    fullname: user.fullname,
                    password: user.password,
                    email: user.email,
                    mailbox: user.mailbox,
                    cellphone: user.cellphone,
                    phone: user.phone,
                    // bornDate: moment(user.bornDate).format("DD/MM/YYYY"),
                    bornDate: moment(user.bornDate),
                    active: user.active,
                    image: user.image,
                },
            })
        }

    }

    handleSubmit(e) {
        e.preventDefault();
        const {user} = this.state;
        const {handleSubmit} = this.props;

        if (user.clientName !== '') { //TODO complete submit validation
            this.setState({formComplete: true});

            handleSubmit(user);
            this.setState({user: {}});
        } else
            this.setState({formError: true});
    }

    handleChange(e, {name, value}) {
        const {user} = this.state;

        this.setState({formError: false, formComplete: false});
        this.setState({user: {...user, [name]: value}});
    }

    handleClear = (e) => {
        e.preventDefault();
        this.setState({
            user: {
                userId: '',
                fullname: '',
                password: '',
                email: '',
                mailbox: 0,
                cellphone: '',
                phone: '',
                bornDate: null,
                active: true,
                image: null,
            },
            formError: false,
            formComplete: false,
        });
    };

    onChangeDate = date => {
        let updateUser = this.state.user;
        updateUser.bornDate = date;
        this.setState({user: updateUser})
    };

    onChangeActive = () => {
        let updateUser = this.state.user;
        updateUser.active = !this.state.user.active;
        this.setState({user: updateUser})
    };


    render() {
        const {formError, formComplete, user, user: {userId, fullname, password, email, mailbox, cellphone, phone, bornDate, active, image}} = this.state;
        const {handleCancel, submitText} = this.props;

        return (
            <Form onSubmit={this.handleSubmit} error={formError}>
                <Form.Group widths='equal'>
                    <Form.Input
                        required
                        label="ת.ז."
                        type="text"
                        name="userId"
                        value={userId}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        required
                        label="שם מלא"
                        type="text"
                        name="fullname"
                        value={fullname}
                        onChange={this.handleChange}
                    />
                    {/*{password !== '' ?
                        <Form.Input
                            required
                            label="סיסמא"
                            type="password"
                            name="password"
                            value={password}
                            onChange={this.handleChange}
                        /> : null
                    }*/}
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Input
                        required
                        label="אימייל"
                        type="email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        required
                        label="תיבת דואר"
                        type="number"
                        name="mailbox"
                        value={mailbox}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Input
                        required
                        label="פלאפון"
                        type="tel"
                        name="cellphone"
                        value={cellphone}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        required
                        label="טלפון"
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Input
                        required
                        label="תאריך לידה"
                        // type="date"
                        name="bornDate"
                        // onChange={this.handleChange}
                    >
                        <Datetime
                            locale={'he'}
                            timeFormat={false}
                            install
                            value={bornDate}
                            onChange={this.onChangeDate.bind(this)}
                        />
                    </Form.Input>
                    <Form.Input
                        label="תמונה"
                        type="image"
                        name="image"
                        value={image}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        required
                        label="קיים"
                        // type="checkbox"
                        name="active"
                    >
                        <Checkbox
                            name="active"
                            toggle
                            checked={active}
                            onChange={this.onChangeActive.bind(this)}
                        />
                    </Form.Input>
                </Form.Group>


                {formError ?
                    <Message
                        error
                        header='פרטי משתמש חסרים'
                        content='נא להשלים את השדות החסרים'
                    />
                    : null
                }
                {formComplete ?
                    <Message success header='פרטי משתמש הושלמו' content="המשתמש נוסף בהצלחה"/>
                    : null
                }

                <Form.Group style={{marginTop: 20}}>
                    <Form.Button positive type="submit">{submitText}</Form.Button>
                    <Form.Button negative onClick={handleCancel}>בטל</Form.Button>
                    <Form.Button onClick={this.handleClear}>נקה הכל</Form.Button>
                </Form.Group>

            </Form>
        );
    }
}

export default UserForm;