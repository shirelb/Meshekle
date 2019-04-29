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



const TOTAL_PER_PAGE = 8;

var requestsRequested = [];
var requestsDenied = [];
var requestsReplaced = [];
var requestsCanceled =[];
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
        requestsRequested = [];
        requestsDenied = [];
        requestsReplaced = [];
        requestsCanceled =[];
        let reqs = [];
        reqs.push(choresStorage.getReplacementRequests(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreType, 'requested'));
        reqs.push(choresStorage.getReplacementRequests(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreType, 'denied'));
        reqs.push(choresStorage.getReplacementRequests(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreType, 'raplaced'));
        reqs.push(choresStorage.getReplacementRequests(this.props.serviceProviderId, this.props.serviceProviderHeaders, this.props.choreType, 'canceled'));
        axios.all(reqs)
        .then(res=>{
            res[0].data.requests.map(re=>{
                if(re.choreOfSender.choreTypeName===this.props.choreType){
                    console.log("re.choreOfSender.choreTypeName:", re.choreOfSender.choreTypeName);
                    requestsRequested.push(re);
                }
            })
            //requestsDenied = res[1].data.requests;
            //requestsReplaced = res[2].data.requests;
            res[1].data.requests.map(re=>{
                if(re.choreOfSender.choreTypeName===this.props.choreType){
                    console.log("re.choreOfSender.choreTypeName:", re.choreOfSender.choreTypeName);
                    requestsDenied.push(re);
                }
            })
            res[2].data.requests.map(re=>{
                if(re.choreOfSender.choreTypeName===this.props.choreType){
                    console.log("re.choreOfSender.choreTypeName:", re.choreOfSender.choreTypeName);
                    requestsReplaced.push(re);
                }
            })
            res[3].data.requests.map(re=>{
                if(re.choreOfSender.choreTypeName===this.props.choreType){
                    console.log("re.choreOfSender.choreTypeName:", re.choreOfSender.choreTypeName);
                    requestsCanceled.push(re);
                }
            })
            //requestsCanceled = res[3].data.requests;
            //this.setState({requestsRequested:res[0].data.requests, requestsDenied:res[1].data.requests, requestsReplaced:res[2].data.requests, requestsCanceled:res[3].data.requests});
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
        console.log("in tabcontent : " , requests);
        if(requests.length===undefined){
            requests = requestsRequested;
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
        /*var tabContent = (<Table >
            <Table.Header>
                
            </Table.Header>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{"המבקש"}</Table.HeaderCell>
                                <Table.HeaderCell>{"תאריך המבקש"}</Table.HeaderCell>
                                <Table.HeaderCell>{"מקבל הבקשה"}</Table.HeaderCell>
                                <Table.HeaderCell>{"תאריך מקבל הבקשה"}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.requests.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(req =>
                                (<Table.Row >
                                    <Table.Cell>{req.choreOfSender.User.fullname}</Table.Cell>
                                    <Table.Cell>{moment(req.choreOfSender.date).format('DD-MM-YYYY')}</Table.Cell>
                                    <Table.Cell>{req.choreOfReceiver.User.fullname}</Table.Cell>
                                    <Table.Cell>{moment(req.choreOfReceiver.date).format('DD-MM-YYYY')}</Table.Cell>
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
                    </Table>
        );*/
        const panes = [
            { menuItem: 'הוחלפו', render: () => {return this.tabContent(this.props.requestsReplaced)} },
            { menuItem: 'פתוחות', render: () =>{return this.tabContent(requestsRequested)}},
            { menuItem: 'נסגרו', render: () =>{return this.tabContent(requestsCanceled)}},
            { menuItem: 'נדחו', render: () => {return this.tabContent(requestsDenied)} },
          ]

        return (
            
            <Tab panes={panes} defaultActiveIndex={0} />
            
        )
    }
}

export default ReplacementRequests