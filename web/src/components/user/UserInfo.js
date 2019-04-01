import React from 'react';
import {Button, Image, Modal} from 'semantic-ui-react';
import moment from 'moment';
import {Helmet} from 'react-helmet';
import usersStorage from "../../storage/usersStorage";
import store from "store";
import strings from "../../shared/strings";
import {Redirect, Route, Switch} from "react-router-dom";
import UserEdit from "./UserEdit";

class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        console.log("UserInfo props ", this.props);
        this.props.location.state ?
            this.state = {user: this.props.location.state.user} :
            this.state = {user: {}};
        // this.state = {user: this.props.location.state.user};

        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };

        if (this.props.location.state)
            this.setState({user: this.props.location.state.user});
        else
            usersStorage.getUserByUserID(this.props.match.params.userId, this.serviceProviderHeaders)
                .then(user => {
                    this.setState({user: user});
                })
    }

    handleDelete() {
        usersStorage.deleteUserByUserID(this.props.match.params.userId, this.serviceProviderHeaders)
            .then((response) => {
                console.log('user deleted response ', response);
                this.props.history.goBack();
            });
    }

    handleEdit = () => {
        this.props.history.push(`${this.props.match.url}/edit`, {
            user: this.state.user
        });
    }

    render() {
        const {user} = this.state;
        console.log('UserInfo user ', user);

        return (
            <div>
                <Modal open dimmer="blurring" closeIcon onClose={() => this.props.history.goBack()}>
                    <Helmet>
                        <title>Meshekle | User {user.fullname}</title>
                    </Helmet>

                    <Modal.Header>{user.fullname}</Modal.Header>
                    <Modal.Content image>
                        <Image wrapped size="small" src={`https://api.adorable.io/avatars/250`}/>
                        <Modal.Description>
                            <p>{strings.phoneBookPageStrings.USER_ID_HEADER}: {user.userId}</p>
                            <p>{strings.phoneBookPageStrings.FULLNAME_HEADER}: {user.fullname}</p>
                            {/*<p>{strings.phoneBookPageStrings.PASSWORD_HEADER}: {user.password}</p>*/}
                            <p>{strings.phoneBookPageStrings.EMAIL_HEADER}: {user.email}</p>
                            <p>{strings.phoneBookPageStrings.MAILBOX_HEADER}: {user.mailbox}</p>
                            <p>{strings.phoneBookPageStrings.CELLPHONE_HEADER}: {user.cellphone}</p>
                            <p>{strings.phoneBookPageStrings.PHONE_HEADER}: {user.phone}</p>
                            <p>{strings.phoneBookPageStrings.BORN_DATE_HEADER}: {moment(user.bornDate).format("DD/MM/YYYY")}</p>
                            <p>{strings.phoneBookPageStrings.ACTIVE_HEADER}: {user.active ? strings.phoneBookPageStrings.ACTIVE_ANSWER_YES : strings.phoneBookPageStrings.ACTIVE_ANSWER_NO}</p>
                            {/*<Table.HeaderCell>Image</Table.HeaderCell>*/}
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions className='alignLeft'>
                        <Button positive onClick={this.handleEdit}>ערוך</Button>
                        <Button negative onClick={this.handleDelete}>מחק</Button>
                        <Button>סגור</Button>
                    </Modal.Actions>
                </Modal>

                <div>
                    <Switch>
                        <Route exec path={`${this.props.match.url}/edit`}
                               component={UserEdit}/>
                        {/*<Redirect to={`${this.props.match.path}`}/>*/}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default UserInfo;