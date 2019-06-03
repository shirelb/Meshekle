import React from 'react';
import {Grid, Header, Image} from 'semantic-ui-react';

const PageNotFound = () => (
    <Grid stretched textAlign={"center"}>
        <Grid.Column stretched textAlign={"center"}>
            <Image centered src={require('../../images/logo1.png')} size={'large'}/>
            <Header size={"huge"} textAlign={"center"} icon style={{marginTop: "-10px"}}>
                משקל'ה
                <Header.Subheader>יש משק ויש משקל'ה</Header.Subheader>
            </Header>

            <div style={{marginTop: 20, textAlign: "center"}}>
                <Header as={'h1'}> 404 </Header>
                <Header as={'h2'}> Page not found </Header>
            </div>
        </Grid.Column>
    </Grid>
);

export default PageNotFound;