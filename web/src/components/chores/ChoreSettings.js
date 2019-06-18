import React from 'react';
import '../../pages/choresManagementPage/styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Icon, Menu, Table, Modal} from 'semantic-ui-react';
import store from 'store';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import strings from "../../shared/strings";
import choresStorage from "../../storage/choresStorage";
import usersStorage from "../../storage/usersStorage";
import { Select } from 'semantic-ui-react'
import { Input } from 'semantic-ui-react'
import EditChoreTypeSettings from "../../components/chores/EditChoreTypeSettings"
import {Redirect, Route, Switch} from "react-router-dom";


const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
};

const serviceProviderId = store.get('serviceProviderId');

export default class ChoreSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            settings:this.props.settings,// this.props.location.state.settings/*props.settings*/,
            onUpdateSettings: this.props.onUpdateSettings,//this.props.location.state.onUpdateSettings,
            openModal:false,
            contentModal:'',
        };
        

        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');

        this.inputChange = this.inputChange.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayDays = this.displayDays.bind(this);
        this.deleteChoreType = this.deleteChoreType.bind(this);
        this.deleteChoreTypeRequest = this.deleteChoreTypeRequest.bind(this);
        this.closeModal = this.closeModal.bind(this);
    };

    componentWillMount() {
        
    }

    componentDidMount() {
        console.log("laaaaaaaaaaaaaaa:",this.props.settings , this.location)
        this.setState({settings:this.props.settings});
    }

    inputChange(e){
        console.log("onchange", e.target.value);
        e.source.action ={color:'red'}
    }

    handleChange(event) {
        //this.setState({value: event.target.value, color: 'red'});
        //this.props.settings.choreTypeName = event.target.value;
        console.log("some field change", event);
      }
    
      handleSubmit(event) {
      }
    
    displayDays (days){
        console.log("daysarray before: ", days);
        let ans = '';
        ans = days.replace('[', '');
        console.log("daysarray after: ", ans);
    }

    deleteChoreType(){
        choresStorage.deleteChoreType(serviceProviderId, serviceProviderHeaders, this.state.settings.choreTypeName)
        .then(res=>{
            console.log("response of deleteChoreType: ", res);
            this.setState({openModal:false, contentModal:''});
            this.props.onDeleteType();
            this.props.history.goBack();
        });
    }
    
    deleteChoreTypeRequest(){
        this.setState({openModal:true, contentModal:'שים לב!!! מחיקת התורנות תגרום לתורנויות העתידיות להימחק מהמערכת. האם תרצה להמשיך?'});
    }

    closeModal(){
        this.setState({openModal:false, contentModal:''});
        this.props.history.goBack();
    }

    componentWillReceiveProps(nextProps) {
        console.log("in rwillreceiveprops nextProps.location:", nextProps.location)
        this.setState({settings:nextProps.location.state.settings}) ;
    }

    render() {
        const {settings} = this.props;
        /*if(this.state.settings.choreTypeName===undefined){
            this.setState({settings:this.props.location.state.settings})
        }
        console.log("this.state.settings in lalalallalala:", this.state.settings.days);
        */
        return(
            <div>

       
          <label>
          {/*<DaysTags/>*/}
        </label>
        <h4>שם התורנות: {this.props.settings.choreTypeName}</h4>
        <h4>ימים: {this.props.settings.days}</h4>
        <h4>מספר עובדים בתורנות: {this.props.settings.numberOfWorkers}</h4>
        <h4>תדירות : {this.props.settings.frequency}</h4>
        <h4>שעת התחלה : {this.props.settings.startTime}</h4>
        <h4>שעת סיום : {this.props.settings.endTime}</h4>
        <h4> צבע :<text> {this.props.settings.color}</text> </h4>

        <Button negative onClick={this.deleteChoreTypeRequest}>מחיקת סוג תורנות</Button>
        
        <Modal trigger={<Button positive>ערוך פרטים</Button>}
        closeIcon={false}>
    <Modal.Header>עריכת פרטי תורנות</Modal.Header>
    <Modal.Content>
      <EditChoreTypeSettings onClose={(e,newSettings) => {this.props.onUpdateSettings(newSettings);this.props.history.goBack()}}  settings={this.state.settings}/>
    </Modal.Content>
  </Modal>
  <Button onClick={this.props.history.goBack}>בטל</Button>
<Modal open={this.state.openModal}>
        <Modal.Header>{this.state.contentModal}</Modal.Header>
        <Modal.Content>
        <Button negative onClick={()=>this.deleteChoreType()}>אישור</Button>
        <Button  onClick={this.closeModal}>חזור</Button>
</Modal.Content>
        </Modal>
         
            </div>
            
        );
    }
}

 //export default{ChoreSettings}