import React, {Component} from 'react';
import {Button, Dropdown, Form, Image, Message, Modal, TextArea} from 'semantic-ui-react';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../styles.css';



let categoryOptions = {};



class AnnouncementForm extends Component {

    constructor(props) {
        super(props);

        let {announcement} = props;
        if(!announcement){
            announcement = {};
        }
        this.state = {
            formError: false,
            formComplete: false,
            isAlertModal: false,
        };

        this.state = {announcement:{
                title: announcement.title ? announcement.title : '',
                content:announcement.content ? announcement.content : '',
                categoryName:announcement.categoryName ? announcement.categoryName : '',
                expirationTime:announcement.expirationTime ? announcement.expirationTime : '',
                dateOfEvent:announcement.dateOfEvent ? announcement.dateOfEvent : '',
                file:announcement.file ? announcement.file : '',
                fileName:announcement.fileName ? announcement.fileName : '',
            }};

        console.log('constructor  state', this.state);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(e) {
        e.preventDefault();

        const {announcement} = this.state;
        const {handleSubmit} = this.props;

        if (announcement.categoryName !== '' &&
            announcement.expirationTime !== '' ) {

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
                file: '',
                fileName: '',
            },
            formError: false,
            formComplete: false,
        });
        this.refs.fileUpload.value = null;
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

    handleChangeFile = e => {
        e.preventDefault();

        let file = e.target.files[0];
        let fileName = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let updatedAnnouncement = JSON.parse(JSON.stringify(this.state.announcement));
        let prevValue = updatedAnnouncement.fileName;
        reader.onload = e => {
            console.log("file", e.target.result);
            let file = e.target.result;
            updatedAnnouncement.file = file.substring(file.indexOf(",") + 1, file.length);
            updatedAnnouncement.fileName = fileName;

            this.setState({
                announcement: updatedAnnouncement
            });
        };
        // while(! (updatedAnnouncement.fileName === prevValue) && ! (updatedAnnouncement.file === ''));




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
                    required
                />
                <Form.Field
                    control={TextArea}
                    label='תוכן'
                    value={announcement.content}
                    name="content"
                    onChange={this.handleChange}
                    required
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
                        onChange={this.onChangeExprTime.bind(this)}
                        required
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
                        onChange={this.onChangeDateOfEvent.bind(this)}
                    />
                </Form.Group>

                <input type='file' onChange={this.handleChangeFile}  ref="fileUpload"/>


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