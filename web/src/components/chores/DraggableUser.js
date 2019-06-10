import React from "react";
import {Card, Icon, List} from 'semantic-ui-react';

import $ from 'jquery';
import 'jquery/dist/jquery.min';
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";
// import "jquery-ui-dist/jquery-ui.min.css";
// import "jquery-ui-dist/jquery-ui.min";


export default class DraggableUser extends React.Component {
    constructor(props) {
        super(props);
       
        this.state={
            
            
        }
        this.createUserChores = this.createUserChores.bind(this);

        
    }
    componentDidUpdate() {
        $('#external-events .fc-event').each(function () {

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        });
    }

    createUserChores(e, id, name){
        let user = {name:name,userId:id};
        
        console.log("drag user off: e:", user);
        this.props.onDraggedUser(e, "draggableObject", user)
        ////usersChoosed.push()
        //this.props.createUserChores("", )
    }

    render() {
        return <div id='external-events' style={{marginTop: 20}}>
            <List animated selection divided verticalAlign='middle'>
                {this.props.usersInType.map((user, i) => {
                    let userId = user.id;
                    return (
                        <div className='fc-event' data-event={user}
                             key={userId}>
                            <List.Item
                                as={Card}
                                key={userId}
                                name={user.value}
                                id={user.id}
                                //onMouseOver={this.props.hoverOnAppointmentRequest(userId)}
                                onMouseLeave={()=>this.createUserChores("",userId)}
                                onClick={()=>this.userId = userId}

                                draggable={"true"}
                            >
                                
                                <List.Content as={Card} centered

                                              color={`blue`}>
                                    
                                    <Card.Header>{user.value}</Card.Header>
                                    {/*<Card.Meta>{this.props.cardMeta?this.props.cardMeta:null}</Card.Meta>*/}
                                    <Card.Description></Card.Description>
                                </List.Content>
                            </List.Item>
                        </div>
                    )
                })
                }
            </List>
        </div>
    }
}