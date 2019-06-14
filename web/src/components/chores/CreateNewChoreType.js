import React, {Component} from 'react';
import {Dropdown, Form, Message, TextArea, Field, Input, Modal, Button, FormTextArea, Label} from 'semantic-ui-react';
import moment from 'moment';
import Datetime from 'react-datetime';
//import 'react-datetime/css/react-datetime.css';
//import '../styles.css';
import usersStorage from "../../storage/usersStorage";
import choresStorage from "../../storage/choresStorage";
import DaysTags from "./DaysTags";
import store from 'store';
import NumericInput from 'react-numeric-input';

class CreateNewChoreType extends Component {

    constructor(props) {
        super(props);


        this.state = {
            settings:{
                choreTypeName: "",
                serviceProviderId: "",
                days: "",
                numberOfWorkers: "",
                frequency: "",
                startTime: "",
                endTime: "",
                color: "",
            },
            newSettings:{
                choreTypeName: "",
                serviceProviderId: "",
                days: "",
                numberOfWorkers: "",
                frequency: "",
                startTime: "",
                endTime: "",
                color: "",
            },
            deviation:false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
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

    handleSubmit(e) {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
        choresStorage.createNewChoreType(this.serviceProviderId, this.serviceProviderHeaders, this.state.newSettings)
        .then(res=>{
            console.log("settings updated to ",  this.state.newSettings,res.data);
            //this.props.location.state.openModalRequest("סוג תורנות הוספה בהצלחה!");
            this.props.openModalRequest("סוג תורנות הוספה בהצלחה!");
            this.props.onCreateChoreType(this.state.newSettings);
        })
        .catch(err=>{
            //console.log("settings updated to ",  this.state.newSettings);
            //this.props.location.state.openModalRequest("לא ניתן להוסיף את סוג התורנות הרצוי");
            this.props.openModalRequest("לא ניתן להוסיף את סוג התורנות הרצוי"+"\n יש למלא את כל השדות הריקים ואין להוסיף שם תורנות קיים");

        });
        //this.props.onDeleteType();
        this.props.history.goBack();
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



    render() {
        const {newSettings, formError, formComplete, settings} = this.state;
        const { handleCancel, submitText = 'שמור שינויים'} = this.props;

        return (
            <div>
            <Form onSubmit={this.handleSubmit} error={formError}>
                <Form.Field inline>
                    <label> שם התורנות: </label>
                    <Input
                        required
                        
                        defaultValue={""}
                        onChange={this.handleChange}
                        name='choreTypeName'
                        width='10%'
                    />
                </Form.Field>
                <h4>ימים:</h4>
                <DaysTags settings={this.state.settings} onChange={this.onChange}/>
                <Form.Field inline>
                    <label> מספר עובדים</label>
                    {/*<Input
                        
                        autoComplete='on'
                        defaultValue={""}
                        onChange={this.handleChange}
                        name='numberOfWorkers'
                        width='10%'
                        type= 'number'
                    />*/}
                    <NumericInput required number min={1} max={20}  name='numberOfWorkers' onChange={(value)=>{const {newSettings} = this.state;
        console.log("handlechange: ", 'numberOfWorkers', value)
        if(value>20){
            this.setState({deviation:true})
        }
        else{
        this.setState({deviation: false, newSettings: {...newSettings, numberOfWorkers: value}});
        console.log("after set state ", this.state.newSettings);}}}/>
        <label style={{color:'red'}}>{this.state.deviation?"חריגה" : ""}</label>
                </Form.Field>
                <Form.Field inline>
                <label> תדירות</label>
                <Input
                    
                    multiple
                    defaultValue={""}
                    onChange={this.handleChange}
                    name='frequency'
                    width='10%'
                    type= 'number'
                    margin="50%"
                />
                </Form.Field>
                <Form.Group widths='2cm' width='4cm'>
                    <label>שעת התחלה</label>
                    <Form.Field
                        required
                        as={Datetime}
                        label='שעת התחלה'
                        defaultValue={""}
                        locale={'he'}
                        dateFormat={false}
                        install
                        onChange={time => this.onChangeTime(time, true)}
                         //width='2cm'
                    />
                    <label>שעת סיום</label>
                    <Form.Field
                        as={Datetime}
                        label='שעת סיום'
                        defaultValue={""}
                        locale={'he'}
                        dateFormat={false}
                        install
                        // name="endTime"
                        onChange={time => this.onChangeTime(time, false)}
                        // onChange={this.handleChange}
                        required
                         //width='2cm'
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
                    <Form.Button positive disabled={this.state.deviation} type="submit">{submitText}</Form.Button>
                    <Form.Button onClick={this.props.history.goBack}>בטל</Form.Button>
                </Form.Group>
            </Form>
                </div>
        )
    }
}

export default CreateNewChoreType