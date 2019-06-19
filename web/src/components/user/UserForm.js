import React from 'react';
import {Checkbox, Form, Image, Message} from 'semantic-ui-react';
import moment from "moment";
import Datetime from 'react-datetime';
import mappers from "../../shared/mappers";

class UserForm extends React.Component {
    constructor(props) {
        super(props);

        const {user} = props;

        this.state = {
            formError: false,
            formErrorHeader: "",
            formErrorContent: "",
            formComplete: false,
            isAlertModal: false,
            subjectOptions: [],
        };

        if (user) {
            Object.assign(this.state, {
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
            });
        } else {
            Object.assign(this.state, {
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
                    image: "",
                },
            });
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

    handleFocus = () => {
        this.setState({
            formError: false,
            formErrorHeader: "",
            formErrorContent: "",
            fieldUserIdError: false,
            fieldFullnameError: false,
            fieldEmailError: false,
            fieldMailboxError: false,
            fieldCellphoneError: false,
            fieldPhoneError: false,
            fieldBornDateError: false,
            fieldActiveError: false,
            // fieldImageError:false,
        })
    };

    isFormValid = (user) => {
        if (user.userId === '' || !(/^\d*$/.test(user.userId))) {
            this.setState({
                formError: true,
                formErrorContent: "ת.ז. צריך להכיל רק ספרות",
                fieldUserIdError: true
            });
            return false;
        }

        if (user.fullname === '' || !(/^([^0-9]*)$/.test(user.fullname))) {
            this.setState({
                formError: true,
                formErrorContent: "שמך צריך להכיל רק אותיות",
                fieldFullnameError: true
            });
            return false;
        }

        if (user.email === '' || !(/^[^@]+@[^@]+\.[^@]+$/.test(user.email))) {
            this.setState({
                formError: true,
                formErrorContent: "אימייל לא וואלידי",
                fieldEmailError: true
            });
            return false;
        }

        if (user.mailbox === 0 || !(/^\d*$/.test(user.mailbox))) {
            this.setState({
                formError: true,
                formErrorContent: "תיבת דואר צריך להכיל רק ספרות",
                fieldMailboxError: true
            });
            return false;
        }

        if (user.cellphone === '' || !(/^\d*$/.test(user.cellphone))) {
            this.setState({
                formError: true,
                formErrorContent: "הפלאפון לא וואלידי",
                fieldCellphoneError: true
            });
            return false;
        }

        if (user.phone)
            if (!(/^\d*$/.test(user.cellphone))) {
                this.setState({
                    formError: true,
                    formErrorContent: "הפלאפון לא וואלידי",
                    fieldCellphoneError: true
                });
                return false;
            }

        if (user.bornDate === null) {
            this.setState({
                formError: true,
                formErrorContent: "תאריך לידה לא מולא",
                fieldBornDateError: true
            });
            return false;
        } else if (user.bornDate > moment()) {
            this.setState({
                formError: true,
                formErrorContent: "תאריך לידה צריך להיות בעבר",
                fieldBornDateError: true
            });
            return false;
        }

        if (user.active === null) {
            this.setState({
                formError: true,
                formErrorContent: "האם המשתמש פעיל?",
                fieldActiveError: true
            });
            return false;
        }

        // user.image: null
        return true;
    };


    handleSubmit(e) {
        e.preventDefault();
        const {user} = this.state;
        const {handleSubmit} = this.props;

        if (this.isFormValid(user)) {
            this.setState({formComplete: true});

            handleSubmit(user)
                .then(res => {
                    if (res.response) {
                        if (res.response.status !== 200)
                            this.setState({
                                formError: true,
                                formErrorHeader: 'קרתה שגיאה בעת הוספת המשתמש',
                                formErrorContent: mappers.errorMapper(res.response)
                            });
                    } else
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
                                image: "",
                            },
                        });
                })
        }
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
                image: "",
            },
            formError: false,
            formErrorHeader: "",
            formErrorContent: "",
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

    onChangeImage = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            this.setState({
                user: {...this.state.user, image: reader.result},
                imageFile: file,
            });
        };

    };

    render() {
        const {formError, formErrorHeader, formErrorContent, formComplete, user, user: {userId, fullname, password, email, mailbox, cellphone, phone, bornDate, active, image}} = this.state;
        const {handleCancel, submitText} = this.props;

        // console.log("USerForm user ", user);

        return (
            <Form error={formError}>
                <Form.Group widths='equal'>
                    <Form.Input
                        error={this.state.fieldUserIdError}
                        required
                        label="ת.ז."
                        type="text"
                        name="userId"
                        value={userId}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                    />
                    <Form.Input
                        error={this.state.fieldFullnameError}
                        required
                        label="שם מלא"
                        type="text"
                        name="fullname"
                        value={fullname}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                    />
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Input
                        error={this.state.fieldEmailError}
                        required
                        label="אימייל"
                        type="email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                    />
                    <Form.Input
                        error={this.state.fieldMailboxError}
                        required
                        label="תיבת דואר"
                        type="number"
                        name="mailbox"
                        value={mailbox}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                    />
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Input
                        error={this.state.fieldCellphoneError}
                        required
                        label="פלאפון"
                        type="tel"
                        name="cellphone"
                        value={cellphone}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                    />
                    <Form.Input
                        error={this.state.fieldPhoneError}
                        label="טלפון"
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Input
                        error={this.state.fieldBornDateError}
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
                            onFocus={this.handleFocus}
                        />
                    </Form.Input>
                    <Form.Input
                        // error={this.state.field}
                        label="תמונה"
                        type="file"
                        name="image"
                        // value={image}
                        onChange={this.onChangeImage}
                        onFocus={this.handleFocus}
                    />
                    {image !== "" ?
                        <Image src={image} style={{height: '60px', width: '60px'}}/>
                        : null
                    }
                    <Form.Input
                        error={this.state.fieldActiveError}
                        required
                        label="פעיל"
                        // type="checkbox"
                        name="active"
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


                {formError ?
                    <Message
                        error
                        header={this.state.formErrorHeader === "" ? 'פרטי משתמש חסרים' : this.state.formErrorHeader}
                        content={this.state.formErrorContent === "" ? 'נא להשלים את השדות החסרים' : this.state.formErrorContent}
                    />
                    : null
                }
                {formComplete ?
                    <Message success header='פרטי משתמש הושלמו' content="המשתמש נוסף בהצלחה"/>
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

export default UserForm;