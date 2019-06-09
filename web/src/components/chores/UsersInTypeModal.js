import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Button, Dropdown, Header, Icon, Label, Modal, Select} from 'semantic-ui-react';
import store from 'store';
import {Helmet} from 'react-helmet';
import choresStorage from "../../storage/choresStorage";
import usersStorage from "../../storage/usersStorage";
import moment from 'moment';
import axios from "axios";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants";


const TOTAL_PER_PAGE = 10;
var choreTypesOptions = [];

const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
};
const serviceProviderId = store.get('serviceProviderId');
//var usersToAddToType = [];

class UsersInTypeModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contentModal:"",
            usersToAddToType:[],
            usersNamesToAddToType:[],
            usersNotInType:[],
            usersInType: [],
        };


        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');



        this.modalUsersBuild = this.modalUsersBuild.bind(this);
        this.handleUserToAddChange = this.handleUserToAddChange.bind(this);
        this.addUserToChoreType = this.addUserToChoreType.bind(this);
    }

    componentDidMount(){
        this.setState({usersInType:this.props.usersInType})
        this.modalUsersBuild();
    }
    componentWillReceiveProps(nextProps){
        this.setState({usersInType:this.props.usersInType});
        this.modalUsersBuild();
    }

modalUsersBuild() {

    let usr = 0;
    let u = 0;
    let us = 0;
    let users = this.state.usersInType;
    let content = [];
    let allUsers = [];
    let usersInType = this.state.usersInType;
    let usersInTypeNames = [];
    let usersNotInType = [];
    for (us in usersInType) {
        usersInTypeNames.push(usersInType[us].text);
    }
    // u = 0;
    // usersStorage.getUsers()
    //     .then(res => {
    //         allUsers = res;
    //         console.log("responst getallusers:", usersInType, this.state.users, res)
            // for (u in res) {
            //     if (usersInTypeNames.indexOf(allUsers[u].fullname) < 0) {
            //         usersNotInType.push({
            //             id: allUsers[u].userId,
            //             key: "1",
            //             text: allUsers[u].fullname,
            //             value: allUsers[u].fullname
            //         });
            //     }

            // }
            
               console.log("users iin typeee", usersInType);
            choresStorage.getUsersNotInType(this.serviceProviderId, this.serviceProviderHeaders, this.props.choreTypeSelected)
            .then(usersFound=>{
                let usersNotInType = usersFound.data.uses.map(el=>{
                    return {id: el.userId,
                        key: el.userId,
                        text: el.fullname,
                        value: el.userId}
                })
                this.setState({usersNotInType: usersNotInType});
                content.push(<Dropdown multiple search fluid selection placeholder='בחר משתמש להוספה'
                                       options={this.state.usersNotInType}
                                        scrolling clearable 
                                       onChange={this.handleUserToAddChange}
                                       
                                       //value={this.state.usersToAddToType}
                                       //text ={this.state.usersNamesToAddToType} 

                />);
                content.push(<Button onClick={this.addUserToChoreType}>הוסף</Button>);
                content.push(<br/>)
                for (usr in usersInType) {
                    content.push(<Label userId={users[usr].id} name={usr} value={users[usr].value}
                                        onClick={this.props.deleteUserFromChoreType}>{users[usr].text}  </Label>)
                }
                content.push(<br/>)
                content.push(<h5>יש ללחוץ על משתמש להסרתו מסוג תורנות</h5>)
                this.setState({contentModal:(<div>{content}</div>)}) ;

            })
        //});
}

handleUserToAddChange(e, data) {
    // let usersToAddToType = this.state.usersToAddToType;
    //let usersNamesToAddToType = this.state.usersNamesToAddToType;
    if (e.target.id !== '') {
        //usersToAddToType.push(e.target.id);
       // usersNamesToAddToType.push(e.target.innerText)
    }
    // if(e.target.class==='delete icon'){
        //     console.log("delete icon:", e, data)
        //     //usersToAddToType.splice(usersToAddToType.indexOf())
        // }
        //let usersToAddToType = this.state.usersToAddToType;
        //usersToAddToType.push({value:data.value[data.value.length-1], text:e.target.innerText})
        
        //let usersToAddToType = this.state.usersToAddToType;
        //usersToAddToType.push(data.value[0])
        this.setState({usersToAddToType: data.value, /*usersNamesToAddToType:usersNamesToAddToType*/});
        this.forceUpdate();
        this.modalUsersBuild();
        this.forceUpdate();
        console.log("label cliked:", e.target.id, data, data.value, data.text, this.state.usersNamesToAddToType)
    //this.props.usersToAddToType(usersToAddToType);
}

addUserToChoreType(e, {userId}) {
    let addUsersRequests = [];
    let usersToAdd = this.state.usersToAddToType;
    let user = 0;
    for (user in usersToAdd) {
        addUsersRequests.push(choresStorage.addUserToChoreType(this.serviceProviderId, this.serviceProviderHeaders, usersToAdd[user], this.props.choreTypeSelected));
    }
    axios.all(addUsersRequests)
        .then(res => {
            console.log("response addUserToChoreType", res[0].data);
            let usersInType = this.state.usersInType;
            let usersNotInType = this.state.usersNotInType;
            console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeereere1", usersNotInType);
            let ur = 0;
            let userAdded = 0;
            let usersAdded = res.map(r=>r.data.userChoreType.userId)//usersToAddToType//this.state.usersToAddToType;
            console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeereere2",usersAdded)
            for (userAdded in usersAdded) {
                for (ur in usersNotInType) {
                    if (usersNotInType[ur].id === usersAdded[userAdded]) {
                        let added = usersNotInType.splice(ur, 1);
                        usersInType.push(added[0]);
                        console.log("added :", added[0]);
                    }
                }
            }
            this.setState({usersInType: usersInType, usersNotInType: usersNotInType,  usersToAddToType:[], usersNamesToAddToType:[]});
            this.forceUpdate();
            this.modalUsersBuild()
        });
}


render(){
    return (
        <Modal open={this.props.isOpenModalUsers}>
                                        <Modal.Header>עריכת תורנים עבור תורנות: {this.props.choreTypeSelected}
                                            <Button value={false} onClick={this.props.openModalUsers}>סגור</Button>
                                        </Modal.Header>
                                        <Modal.Content>
                                            {this.state.contentModal}
                                            {/* this.modalUsersContent*/}

                                        </Modal.Content>
                                    </Modal>
    )
}
}
export default UsersInTypeModal