import PropTypes from 'prop-types';
import React, {Component} from 'react'
import {DragSource} from 'react-dnd';
import BigCalendar from 'react-big-calendar'
import {Card, Icon} from 'semantic-ui-react'
import {List} from "semantic-ui-react/dist/commonjs/elements/List";


/* drag sources */
let eventSource = {
    beginDrag(props) {
        console.log('in beginDrag props ', props);
        return Object.assign({},
            {event: props.resource},

            {anchor: 'drop'}
        )
    },

   /* beginDrag(props) {
        // Return the data describing the dragged item
        const item = { id: props.id };
        return item;
    },*/

    endDrag(props, monitor, component) {
        console.log('in endDrag props ',props);
        console.log('in endDrag monitor.didDrop() ',monitor.didDrop());
        if (!monitor.didDrop()) {
            return;
        }

        // When dropped on a compatible target, do something
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        console.log('dropResult ',dropResult);
        this.props.onDrop(item)
        // CardActions.moveCardToList(item.id, dropResult.listId);
    }
}

function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

const propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    resource: PropTypes.object.isRequired
}


class DraggableSidebarResource extends Component {
    render() {
        let {connectDragSource, isDragging, resource} = this.props;
        let EventWrapper = BigCalendar.components.eventWrapper;
        const ResourceRenderComponent = this.props.resourceRenderComponent;

        console.log('connectDragSource ',connectDragSource);

        return (
            <EventWrapper event={resource}>
                {connectDragSource(<div style={{opacity: isDragging ? 0.5 : 1}}>
                    <Card
                        centered
                        onClick={() => {
                            this.props.onClickResource(resource)
                        }}
                        onMouseOver={this.props.onMouseEnter}
                        onMouseLeave={this.props.onMouseLeave}
                    >
                        <Icon name='clipboard' />
                        <Card.Header>{this.props.cardHeader}</Card.Header>
                        <Card.Meta>{this.props.cardMeta?this.props.cardMeta:null}</Card.Meta>
                        <Card.Description>{this.props.cardDescription}</Card.Description>
                        {/*<Icon name='clipboard' />*/}
                        {/*<ResourceRenderComponent resource={resource}/>*/}
                    </Card>
                </div>)}
            </EventWrapper>

        );
    }
}

DraggableSidebarResource.propTypes = propTypes;

export default DragSource('event', eventSource, collectSource)(DraggableSidebarResource);
