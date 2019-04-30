import React, {Component} from 'react';
import {Dropdown, Form, Message, TextArea, Field, Input} from 'semantic-ui-react';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../styles.css';
import usersStorage from "../../storage/usersStorage";
import choresStorage from "../../storage/choresStorage";
import DaysTags from "./DaysTags";
import store from 'store';

class EditChoreTypeSettings extends Component {

    constructor(props) {
        super(props);


        this.state = {
            newSettings:props.settings
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {newSettings} = nextProps;

        this.setState({newSettings});
    }

    onChange(newDaysSettings){
        
        const {newSettings} = this.state;
        console.log("newSettings : ",  newSettings)
        //this.setState({newSettings: newSettings});
        
        this.setState({newSettings: {...newSettings, days: newDaysSettings}});
    }

    handleSubmit(e, {newSettings}) {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
        choresStorage.editChoreTypeSetting(this.serviceProviderId, this.headers, this.state.newSettings)
        .then(res=>{
            console.log("settings updated to ",  this.state.newSettings);
            
            this.props.onClose(e,this.state.newSettings);
        });
        
    }

    handleChange(e, {name, value}) {
        const {newSettings} = this.state;
        console.log("handlechange: ", name, value)
        //this.setState({formError: false, formComplete: false});
        this.setState({newSettings: {...newSettings, [name]: value}});
        console.log("after set state ", this.state.newSettings);
        
    }


    onChangeTime = (time, isStart) => {
        const {newSettings} = this.state;
        //let updateSettings = this.state.newSettings;
        isStart ?
            //updateSettings.startTime = moment(time).format("HH:mm")
            this.setState({newSettings: {...newSettings, startTime: moment(time).format("HH:mm")}})
            :
            //updateSettings.endTime = moment(time).format("HH:mm");
            this.setState({newSettings: {...newSettings, endTime: moment(time).format("HH:mm")}})
        //this.setState({newSettings: updateSettings});
    };

    handleCancel(){
        this.props.onClose();
    }



    render() {
        const {newSettings, formError, formComplete} = this.state;
        const {settings, handleCancel, submitText = 'שמור שינויים'} = this.props;

        return (
            <Form newSettings={this.state.newSettings} onSubmit={this.handleSubmit} error={formError}>
                <h4>שם התורנות: {this.props.settings.choreTypeName}</h4>
                <h4>ימים:</h4>
                <DaysTags settings={this.props.settings} onChange={this.onChange}/>
                <Form.Field inline>
                    <label> מספר עובדים</label>
                    <Input
                        
                        placeholder={this.props.settings.numberOfWorkers}
                        
                        autoComplete='on'
                        defaultValue={this.props.settings.numberOfWorkers}
                        onChange={this.handleChange}
                        name='numberOfWorkers'
                        width='10%'
                        type= 'number'
                    />
                </Form.Field>
                <Form.Field inline>
                <label> תדירות</label>
                <Input
                    placeholder={this.props.settings.frequency}
                    
                    multiple
                    defaultValue={this.props.settings.frequency}
                    onChange={this.handleChange}
                    name='frequency'
                    width='10%'
                    type= 'number'
                    margin="50%"
                />
                </Form.Field>
                <Form.Group widths='equal'>
                    <label>שעת התחלה</label>
                    <Form.Field
                        as={Datetime}
                        label='שעת התחלה'
                        defaultValue={this.props.settings.startTime}
                        locale={'he'}
                        dateFormat={false}
                        install
                        onChange={time => this.onChangeTime(time, true)}
                        required
                        // width='10'
                    />
                    <label>שעת סיום</label>
                    <Form.Field
                        as={Datetime}
                        label='שעת סיום'
                        defaultValue={this.props.settings.endTime}
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
                        header='פרטי תורנות חסרים'
                        content='נא להשלים את השדות החסרים'
                    />
                    : null
                }
                {formComplete ?
                    <Message success header='פרטי תורנות הושלמו' content="פרטי התורנות עודכנו בהצלחה"/>
                    : null
                }

                <Form.Group>
                    <Form.Button  newSettings={this.state.newSettings} type="submit">{submitText}</Form.Button>
                    <Form.Button onClick={this.handleCancel}>בטל</Form.Button>
                </Form.Group>

            </Form>
        )
    }
}

export default EditChoreTypeSettings