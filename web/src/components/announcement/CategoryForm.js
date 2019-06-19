import React, {Component} from 'react';
import {Button, Dropdown, Form, Image, Message, Modal, TextArea} from 'semantic-ui-react';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../styles.css';



let serProvsOptions = {};



class CategoryForm extends Component {

    constructor(props) {
        super(props);

        let {category} = props;
        if(!category){
            category = {};
        }
        else{
            category.managers = category.managers.filter(m=> m!==null && m!==undefined);
        }
        this.state = {
            formError: false,
            formComplete: false,
            isAlertModal: false,
        };

        this.state = {category:{
                categoryName: category.categoryName ? category.categoryName : '',
                managers:category.managers ? category.managers : [],
                categoryOldName:category.categoryName ? category.categoryName :'',
            }};

        console.log('constructor  state', this.state);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(e) {
        e.preventDefault();

        const {category} = this.state;
        const {handleSubmit} = this.props;

        if (category.categoryName !== '' &&
            category.managers !== '' ) {

            this.setState({formComplete: true});
            let updatedCategory = category;
            this.setState({category: updatedCategory});

            let submit = handleSubmit(updatedCategory);
            if(submit)
                this.setState({category: {}});
        } else {
            this.setState({formError: true});
        }
    }

    handleChange(e, {name, value}) {
        const {category} = this.state;

        this.setState({formError: false, formComplete: false});
        this.setState({category: {...category, [name]: value}});
    }




    handleClear = (e) => {
        e.preventDefault();
        this.setState({
            category: {
                categoryName: '',
                managers: [],
                categoryOldName:'',
            },
            formError: false,
            formComplete: false,
        });
    };

    handleSearchChange = (e, {searchQuery}) => {
        let updateCategory = this.state.category;
        updateCategory.managers = searchQuery;
        this.setState({category: updateCategory})
    };



    render() {
        const {category, formError, formComplete} = this.state;
        const {handleCancel, submitText,serProvsWithNames} = this.props;
        serProvsOptions = serProvsWithNames.map(s => ({
            key: s.serviceProviderId,
            text: s.name,
            value: s
        }));
        serProvsOptions = serProvsOptions.filter((item,pos)=> {return serProvsOptions.map(i=>i.text).indexOf(item.text) === pos});


        return (
            <Form onSubmit={this.handleSubmit} error={formError}>
                <Form.Field
                    control={TextArea}
                    label='שם'
                    value={category.categoryName}
                    name="categoryName"
                    onChange={this.handleChange}
                    required
                />

                <Form.Field
                    control={Dropdown}
                    label='אחראי קטגוריה'
                    placeholder='אחראים'
                    fluid
                    search
                    multiple
                    selection
                    options={serProvsOptions}
                    value={category.managers}
                    onChange={this.handleChange}
                    name='managers'
                    required
                    noResultsMessage='לא נמצאו התאמות'
                    onSearchChange={this.handleSearchChange}
                />


                {formError ?
                    <Message
                        error
                        header='פרטי קטגוריה חסרים'
                        content='נא להשלים את השדות החסרים'
                    />
                    : null
                }
                {formComplete ?
                    <Message success header='פרטי הקטגריה הושלמו' content="הקטגוריה נוספה בהצלחה"/>
                    : null
                }

                <Form.Group style={{marginTop:20}}>
                    <Form.Button positive type="submit">{submitText}</Form.Button>
                    <Form.Button negative onClick={handleCancel}>בטל</Form.Button>
                    <Form.Button onClick={this.handleClear}>נקה הכל</Form.Button>
                </Form.Group>

            </Form>
        )
    }
}

export default CategoryForm