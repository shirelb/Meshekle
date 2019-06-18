import React from 'react'
import {Redirect, Route} from 'react-router-dom'
// import {connect} from 'react-redux'
// import {getLoggedUser} from './utils/xhr'
import isLoggedIn from "./shared/isLoggedIn";

class AuthorizedRoute extends React.Component {

    componentWillMount() {
        // getLoggedUser()
        isLoggedIn()
            .then(answer => {
                // console.log('hhhh compooooo abs ', answer);
                this.setState({isLoggedIn: answer});
            })
            .catch(answer => {
                // console.log('hhhh compooooo abs ', answer);
                this.setState({isLoggedIn: answer});
            });
    }

    render() {
        const {component: Component, pending, logged, ...rest} = this.props;

        return (
            <Route {...rest} render={props => {
                if (pending) return <div>Loading...</div>;
                return logged
                    ? <Component {...props} />
                    : <Redirect to="/login"/>
            }}/>
        )
    }
}

const stateToProps = ({loggedUserState}) => ({
    pending: loggedUserState.pending,
    logged: loggedUserState.logged
});

// export default connect(stateToProps)(AuthorizedRoute)
export default AuthorizedRoute
