import React, {Component} from 'react';
import {FlatList, StyleSheet, View, Switch, RefreshControl, ScrollView, Alert} from 'react-native';
import {Button, Icon, List, ListItem, SearchBar, Text} from 'react-native-elements';
import phoneStorage from "react-native-simple-store";
var t = require('tcomb-form-native');
var Form = t.form.Form;

import announcementsStorage from "../../storage/announcementsStorage";
import moment from "moment";
import {Dropdown} from "react-native-material-dropdown";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
var RNFS = require('react-native-fs');


// var options = {
//     fields: {
//         eta: {
//             label: 'ETA',
//             mode: 'date',
//             config: {
//                 format: (date) => moment(date).format('YYYY-mm-d'),
//             },
//         },
//     },
// };

var options = {
    fields: {
        title: {
            label:'כותרת המודעה',
        },
        content: {
            label:'תוכן',
        },
        expirationTime: {
            label:'תאריך תפוגה',
            mode: "date",
            defaultValueText: "אנא בחר תאריך",
        },
        dateOfEvent: {
            label:'תאריך אירוע',
            mode: "date",
            defaultValueText: "אנא בחר תאריך"
        },

    }
};


// here we are: define your domain model
var Announcement = t.struct({
    title: t.String,
    content: t.String,
    expirationTime: t.Date,
    dateOfEvent: t.maybe(t.Date),

});


export default class RequestAnnouncement extends Component {



    constructor(props) {
        super(props);

        this.state = {
            categoryNameFilter: "---",
            categoriesDisplay: [],
            categories: [],
            value: null,
        };

    }

    componentDidMount() {
        phoneStorage.get('userData')
            .then(userData => {
                // console.log('agenda componentDidMount userData ', userData);
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.clearForm();
                this.loadCategories();
            });
    }

    loadCategories = () => {
        announcementsStorage.getUniqueCategories(this.userHeaders)
            .then(response => {
                let categories = response.data;
                console.log("categories",categories);

                let categoriesDisplay = [{value: "---"}];
                categoriesDisplay = categoriesDisplay.concat(categories.map(cat => {return {value : cat.categoryName}}));
                this.setState({categories: categories,categoriesDisplay:categoriesDisplay});

            })
            .catch(err => console.log("loadCategories error ", err))
    };

    saveChanges = () => {
        let value = this.refs.form.getValue();
        value = JSON.parse(JSON.stringify(this.state.value));
        let category = this.state.categoryNameFilter;

        if (value && category !== "---") {
            console.log(value);
            value.status = "Requested";
            value.creationTime = new Date();
            value.userId = this.userId;
            value.categoryId = this.state.categories.filter(c => c.categoryName === category)[0].categoryId;
            value.expirationTime = this.formatDate(String(value.expirationTime));
            if(value.dateOfEvent)
                value.dateOfEvent = this.formatDate(String(value.dateOfEvent));
            announcementsStorage.addAnnouncement(value,this.userHeaders)
                .then(() => {
                    this.clearForm();
                    this.props.navigation.navigate('AnnouncementsScreen');
                });
        }
        else if(category === "---"){
            Alert.alert(
                'לא נבחרה קטגוריה',
                'אנא בחר קטגוריה',
                [
                    {text: 'אישור', style: 'cancel'},
                ]
            );
        }
    };

    cancelChanges = () => {
        this.clearForm();
        this.props.navigation.navigate('AnnouncementsScreen');
    };

    clearForm = () => {
        //this.refs.dropdown.;
        this.setState({ value: null , categoryNameFilter: "---"});
    };

    //Category dropdown filter
    updateDropdown = categoryName => {
        this.setState({categoryNameFilter: categoryName});
    };

    onChange(value) {
        this.setState({ value });
    };

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    uploadFile() {
        //Opening Document Picker
        DocumentPicker.show(
            {
                filetype: [DocumentPickerUtil.allFiles()],
                //All type of Files DocumentPickerUtil.allFiles()
                //Only PDF DocumentPickerUtil.pdf()
                //Audio DocumentPickerUtil.audio()
                //Plain Text DocumentPickerUtil.plainText()
            },
            (error, res) => {
                this.setState({fileUri: res.uri, fileType: res.type,fileName: res.fileName,fileSize: res.fileSize});
                const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
                console.log('res : ' + JSON.stringify(res));
                console.log('URI : ' + res.uri);
                console.log('Type : ' + res.type);
                console.log('File Name : ' + res.fileName);
                console.log('File Size : ' + res.fileSize);
            }
        );
    }


    render() {
        return (

            <View style={styles.container} >
                <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
                    <Dropdown
                        ref = "dropdown"
                        containerStyle={styles.dropdownStyle}
                        label='קטגוריה'
                        data={this.state.categoriesDisplay}
                        value={this.state.categoryNameFilter}
                        onChangeText={this.updateDropdown.bind(this)}
                    />
                    <Form
                        ref="form"
                        type={Announcement}
                        options={options}
                        value={this.state.value}
                        onChange={this.onChange.bind(this)}
                    />
                    <Button
                        style={styles.button}
                        title="Add File"
                        onPress={this.uploadFile.bind(this)}
                    />
                    <Button
                        style={styles.button}
                        title="Submit"
                        onPress={this.saveChanges.bind(this)}
                    />
                    <Button
                        style={styles.button}
                        title="Clear"
                        onPress={this.clearForm.bind(this)}
                    />
                    <Button
                        style={styles.button}
                        title="Cancel"
                        onPress={this.cancelChanges.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 0,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});

