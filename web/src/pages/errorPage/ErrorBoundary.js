import React from 'react';
import {Grid, Header, Image} from 'semantic-ui-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {asError: false};
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
        // You can also log the error to an error reporting service
        //TODO complete logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <Grid stretched textAlign={"center"}>
                <Grid.Column stretched textAlign={"center"}>
                    <Image centered src={require('../../images/logo1.png')} size={'large'}/>
                    <Header size={"huge"} textAlign={"center"} icon style={{marginTop: "-10px"}}>
                        משקל'ה
                        <Header.Subheader>יש משק ויש משקל'ה</Header.Subheader>
                    </Header>

                    <div style={{marginTop: 20, textAlign: "center"}}>
                        <Header as={'h2'}>קרתה שגיאה. יש לחזור אחורה או לרענן </Header>
                    </div>
                </Grid.Column>
            </Grid>
        }
        return this.props.children;
    }
}