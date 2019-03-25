import React, {Component} from 'react';
import {Button, Dropdown, Form, Message, Modal, TextArea} from 'semantic-ui-react';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../styles.css';
import usersStorage from "../../storage/usersStorage";
import announcementsStorage from "../../storage/announcementsStorage";




let categoryOptions = {};



class AnnouncementForm extends Component {

    constructor(props) {
        super(props);

       // const {announcement} = props;

        this.state = {
            formError: false,
            formComplete: false,
            isAlertModal: false,
        };

        this.state = {announcement:{
                title:'',
                content:'',
                categoryName:'',
                expirationTime:'',
                dateOfEvent:'',
            }};

        console.log('constructor  state', this.state);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(e) {
        e.preventDefault();

        const {announcement} = this.state;
        const {handleSubmit} = this.props;

        if (announcement.title.length >0 &&
            announcement.content.length > 0 &&
            announcement.categoryName !== '' &&
            announcement.expirationTime !== '' &&
            announcement.dateOfEvent !== '') {

            this.setState({formComplete: true});
            let updatedAnnouncement = announcement;
            updatedAnnouncement.categoryId = (categoryOptions.filter(cat => cat.value === announcement.categoryName))[0].key;
            this.setState({announcement: updatedAnnouncement});

            handleSubmit(updatedAnnouncement);
            this.setState({announcement: {}});
        } else {
            this.setState({formError: true});
        }
    }

    handleChange(e, {name, value}) {
        const {announcement} = this.state;

        this.setState({formError: false, formComplete: false});
        this.setState({announcement: {...announcement, [name]: value}});
    }

    handleClear = (e) => {
        e.preventDefault();
        this.setState({
            announcement: {
                title: '',
                content: '',
                categoryName: '',
                expirationTime: '',
                dateOfEvent: '',
            },
            formError: false,
            formComplete: false,
        });
    };

    onChangeExprTime = exprTime => {
        let updatedAnnouncement = this.state.announcement;
        updatedAnnouncement.expirationTime = moment(exprTime).toDate();
        this.setState({announcement: updatedAnnouncement})
    };

    onChangeDateOfEvent = dateOfEvent => {
        let updatedAnnouncement = this.state.announcement;
        updatedAnnouncement.dateOfEvent = moment(dateOfEvent).toDate();
        this.setState({announcement: updatedAnnouncement})
    };



    render() {
        const {announcement, formError, formComplete} = this.state;
        const {handleCancel, submitText, categories} = this.props;
        categoryOptions = categories.map(cat => ({
            key: cat.categoryId,
            text: cat.categoryName,
            value: cat.categoryName
        }));

        console.log('sasaaads ', this.state);

        return (
            <Form onSubmit={this.handleSubmit} error={formError}>
                <Form.Field
                    control={TextArea}
                    label='כותרת'
                    value={announcement.title}
                    name="title"
                    onChange={this.handleChange}
                    // width='10'
                />
                <Form.Field
                    control={TextArea}
                    label='תוכן'
                    value={announcement.content}
                    name="content"
                    onChange={this.handleChange}
                    // width='10'
                />
                <Form.Field
                    control={Dropdown}
                    label='שם קטגוריה'
                    placeholder='שם קטגוריה'
                    fluid
                    search
                    selection
                    autoComplete='on'
                    options={categoryOptions}
                    value={announcement.categoryName}
                    onChange={this.handleChange}
                    name='categoryName'
                    required
                    noResultsMessage='לא נמצאו התאמות'
                />

                <Form.Group widths='equal'>
                    <label>תאריך תפוגה</label>
                    <Form.Field
                        as={Datetime}
                        label='תאריך תפוגה'
                        value={announcement.expirationTime}
                        locale={'he'}
                        timeFormat={false}
                        install
                        // name="date"
                        onChange={this.onChangeExprTime.bind(this)}
                        required
                        // width='10'
                    />
                </Form.Group>
                <Form.Group widths='equal'>
                    <label>תאריך אירוע</label>
                    <Form.Field
                        as={Datetime}
                        label='תאריך אירוע'
                        value={announcement.dateOfEvent}
                        locale={'he'}
                        timeFormat={false}
                        install
                        // name="date"
                        onChange={this.onChangeDateOfEvent.bind(this)}
                        optional
                        // width='10'
                    />
                </Form.Group>

                {formError ?
                    <Message
                        error
                        header='פרטי מודעה חסרים'
                        content='נא להשלים את השדות החסרים'
                    />
                    : null
                }
                {formComplete ?
                    <Message success header='פרטי המודעה הושלמו' content="המודעה פורסמה בהצלחה"/>
                    : null
                }

                <Form.Group style={{marginTop:20}}>
                    <Form.Button positive type="submit">{submitText}</Form.Button>
                    <Form.Button negative onClick={handleCancel}>בטל</Form.Button>
                    <Form.Button onClick={this.handleClear}>נקה הכל</Form.Button>
                </Form.Group>

            </Form>
        )
    }
}

export default AnnouncementForm