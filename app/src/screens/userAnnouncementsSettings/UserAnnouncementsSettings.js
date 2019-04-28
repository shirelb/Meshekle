import React, {Component} from 'react';
import {FlatList, StyleSheet, View, Switch} from 'react-native';
import {Icon, List, ListItem, SearchBar, Text} from 'react-native-elements';
import phoneStorage from "react-native-simple-store";
import Button from "../../components/submitButton/Button"


import announcementsStorage from "../../storage/announcementsStorage";


export default class UserAnnouncementsSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            categoriesSwitches:[],
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
                this.loadCategories();
            });
    }

    loadCategories = () => {
        announcementsStorage.getUniqueCategories(this.userHeaders)
            .then(response => {
                let categories = response.data;
                console.log("categories",categories);

                this.setState({categories: categories});
                let categoriesSwitches=[];
                categories.forEach(function(cat) {
                    categoriesSwitches.push({categoryId:cat.categoryId,switch:false});
                });
                announcementsStorage.getCategoriesSubs(this.userHeaders,this.userId)
                    .then(response => {
                        let categoriesSubs = response.data;
                        console.log("categoriesSubs",categoriesSubs);
                        categoriesSwitches.forEach(function(catSwitch) {
                            if(categoriesSubs.includes(catSwitch.categoryId))
                                catSwitch.switch=true;
                        });
                        this.setState({categoriesSwitches:categoriesSwitches});
                    })
                    .catch(err => console.log("loadCategories error ", err))
            })
            .catch(err => console.log("loadCategories error ", err))
    };


    setSwitchValue = (val, ind) => {
        let tempData = JSON.parse(JSON.stringify(this.state.categoriesSwitches));
        tempData.forEach(item => {
           if(item.categoryId === ind){
               item.switch=val;
           }
        });
        this.setState({ categoriesSwitches: tempData });
    };

    saveChanges = () => {
        announcementsStorage.updateCategorySub(this.userHeaders,this.userId,this.state.categoriesSwitches)
            .then(() => this.props.navigation.navigate('AnnouncementsScreen'))
    };

    cancelButtonClicked = () => {
        this.loadCategories();
        this.props.navigation.navigate('AnnouncementsScreen');
    };

    listItem = ({item, index}) => (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.item}>{this.state.categories.filter(cat=>cat.categoryId===item.categoryId)[0].categoryName}</Text>
            <Switch
                onValueChange={(value) => this.setSwitchValue(value, item.categoryId)}
                value={item.switch}
            />
        </View>
    );

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.categoriesSwitches}
                    renderItem={this.listItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Button
                    label="Submit"
                    onPress={this.saveChanges.bind(this)}
                />
                <Button
                    label="Cancel"
                    onPress={this.cancelButtonClicked.bind(this)}
                />
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

