import React, {Component} from 'react';
import {Dropdown, Form, Message, TextArea, Field, Input, Modal, Table, Header, Icon,Menu, Button, Tab} from 'semantic-ui-react';
import moment from 'moment';
import {Link, Redirect, Route, Switch} from "react-router-dom";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../styles.css';
import usersStorage from "../../storage/usersStorage";
import choresStorage from "../../storage/choresStorage";
import store from 'store';
import times from 'lodash.times';
import axios from "axios";
import NumericInput from 'react-numeric-input';




const TOTAL_PER_PAGE = 8;

var requestsRequested = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]};
var requestsDenied = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]};
var requestsReplaced = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]};
var requestsCanceled ={1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]};
var month = 1;
class ReplacementRequests extends Component {

    constructor(props) {
        super(props);


        this.state = {
            requests:[],
            status: "requested",
            pageUsers: 0,
            totalPagesUsers: 0,
            requestsRequested:[],
            requestsCanceled:[],
            requestsDenied:[],
            requestsReplaced:this.props.requestsReplaced,
            choreType:this.props.choreType,
            deviation:false,
            month:'',
            replacementRequestErrorMessage:"",

        };
        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);
        this.tabContent = this.tabContent.bind(this);


    }

    componentDidMount(){
        this.getRequests();
    }

    getRequests(){
        requestsRequested = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]};
        requestsDenied = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]};
        requestsReplaced ={1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]};
        requestsCanceled = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]};
        let reqs = [];
        reqs.push(choresStorage.getReplacementRequests(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreType, 'requested'));
        reqs.push(choresStorage.getReplacementRequests(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreType, 'deny'));
        reqs.push(choresStorage.getReplacementRequests(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreType, 'raplaced'));
        reqs.push(choresStorage.getReplacementRequests(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreType, 'canceled'));
        axios.all(reqs)
        .then(res=>{
            if(((res[0]&&res[0]!==undefined && res[0].status!==200) || (res[1]&&res[1]!==undefined && res[1].status!==200)|| (res[2]&&res[2]!==undefined && res[2].status!==200)||(res[3]&&res[3]!==undefined && res[3].status!==200))){
                this.setState({replacementRequestErrorMessage:"אירעה בעיה בהבאת נתונים מהשרת, רענן עמוד."});
            }
            else{
                this.setState({replacementRequestErrorMessage:""});

                res[0].data.requests.map(re_=>{
                    if(re_.choreOfSender.choreTypeName===this.props.choreType ){
                        if(Number(moment(re_.choreOfSender.date).format('MM'))===Number(month)|| Number(moment(re_.choreOfReceiver.date).format('MM'))===Number(month)){
                            requestsRequested[month].push(re_);
                        }
                    }
                })
                res[1].data.requests.map(re=>{
                    if(re.choreOfSender.choreTypeName===this.props.choreType){
                        requestsDenied[month].push(re);
                    }
                })
                res[2].data.requests.map(re=>{
                    if(re.choreOfSender.choreTypeName===this.props.choreType){
                        requestsReplaced[month].push(re);
                    }
                })
                res[3].data.requests.map(re=>{
                    if(re.choreOfSender.choreTypeName===this.props.choreType){
                        requestsCanceled.push(re);
                    }
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        const {choreType} = nextProps;

        this.setState({choreType});
    }

    

    decrementPage() {
        const {pageUsers} = this.state;

        this.setState({pageUsers: pageUsers - 1});
    }

    incrementPage() {
        const {pageUsers} = this.state;

        this.setState({pageUsers: pageUsers + 1});
    }

    setPage(page) {
        return () => {
            this.setState({page});
        };
    }

    tabContent(requests){
        const {users, pageUsers, totalPagesUsers, serviceProviders, pageServiceProviders, totalPagesServiceProviders} = this.state;
        const startIndex = pageUsers * TOTAL_PER_PAGE;
        console.log("in tabcontent : " ,moment().format('YYYY') ,requests);
        this.getRequests();
        if(requests.length===undefined){
            requests = requestsRequested[month];
        }
        return (<Tab.Pane><Table >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{"המבקש"}</Table.HeaderCell>
                            <Table.HeaderCell>{"תאריך המבקש"}</Table.HeaderCell>
                            <Table.HeaderCell>{"מקבל הבקשה"}</Table.HeaderCell>
                            <Table.HeaderCell>{"תאריך מקבל הבקשה"}</Table.HeaderCell>
                            <Table.HeaderCell>{"סוג תורנות"}</Table.HeaderCell>
                            <Table.HeaderCell>{"סטטוס"}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {requests.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(req =>
                            (<Table.Row >
                                <Table.Cell>{req.choreOfSender.User.fullname}</Table.Cell>
                                <Table.Cell>{moment(req.choreOfSender.date).format('DD-MM-YYYY')}</Table.Cell>
                                <Table.Cell>{req.choreOfReceiver.User.fullname}</Table.Cell>
                                <Table.Cell>{moment(req.choreOfReceiver.date).format('DD-MM-YYYY')}</Table.Cell>
                                <Table.Cell>{req.choreOfSender.choreTypeName}</Table.Cell>
                                <Table.Cell>{req.status}</Table.Cell>
                            </Table.Row>),
                        )}
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan={8}>
                                <Menu floated="left" pagination>
                                    {pageUsers !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                        <Icon name="right chevron"/>
                                    </Menu.Item>}
                                    {times(totalPagesUsers, n =>
                                        (<Menu.Item as="a" key={n} active={n === pageUsers}
                                                    onClick={this.setPage(n)}>
                                            {n + 1}
                                        </Menu.Item>),
                                    )}
                                    {pageUsers !== (totalPagesUsers - 1) &&
                                    <Menu.Item as="a" icon onClick={this.incrementPage}>
                                        <Icon name="left chevron"/>
                                    </Menu.Item>}
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table></Tab.Pane>
    );}

    render() {
        const {users, pageUsers, totalPagesUsers, serviceProviders, pageServiceProviders, totalPagesServiceProviders} = this.state;
        const startIndex = pageUsers * TOTAL_PER_PAGE;

        const panes = [
            //{ menuItem: 'הוחלפו', render: () => {return this.tabContent(requestsReplaced[month].length===0?this.props.requestsReplaced:requestsReplaced)} },
            { menuItem: 'הוחלפו', render: () => {return this.tabContent(requestsReplaced[month])} },
            { menuItem: 'פתוחות', render: () =>{return this.tabContent(requestsRequested[month])}},
            { menuItem: 'נסגרו', render: () =>{return this.tabContent(requestsCanceled[month])}},
            { menuItem: 'נדחו', render: () => {return this.tabContent(requestsDenied[month])} },
          ]

        return (
            <div>
            <p style={{color:'red'}}>{this.state.replacementRequestErrorMessage}</p>
            <div>
        <label>חודש</label><NumericInput title={"בחר חודש"} number min={1} max={12}  name='month' onChange={(value)=>{
        console.log("handlechange: ", 'month', value)
        if(value>12){
            this.setState({deviation:true})
        }
        else{
        this.setState({deviation: false,  month: value});
        month = value;
        console.log("after set state ", month);}}}/></div>
                <label style={{color:'red'}}>{this.state.deviation?"חריגה" : ""}</label>
            <Tab panes={panes} defaultActiveIndex={0} renderActiveOnly/>
            </div>
        )
    }
}

export default ReplacementRequests