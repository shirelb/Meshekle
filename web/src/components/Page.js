import React from 'react';
import {Grid, Header} from 'semantic-ui-react';

const Page = ({children, title, divId, columns = 1}) =>
    (<div>
        <Grid columns={columns} padded id={divId}>
            <Grid.Column>
                {title && <Header as="h1" floated="right">{title}</Header>}
                {children}
            </Grid.Column>
        </Grid>
    </div>);

export default Page;