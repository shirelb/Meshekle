import React, {Component} from 'react';
import {
    Platform,
    RefreshControl,
    Switch,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    BackHandler
} from 'react-native';
import phoneStorage from "react-native-simple-store";
import announcementsStorage from "../../storage/announcementsStorage";
import {Icon, SearchBar} from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import { Divider } from 'react-native-elements';
import {Image} from "react-native-animatable";
import ZoomImage from 'react-native-zoom-image';
import {Easing} from 'react-native';
import Button from "../../components/submitButton/Button"



export default class UserAnnouncementsRequests extends Component {

    constructor(props) {
        super(props);

        this.state = {
            announcements: [],
            allCategories: [],
            settingsModal: false,
            addAnnouncementsModal: false,
            refreshing: false,
            activeSections: [],
        };
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backButtonPress);
        phoneStorage.get('userData')
            .then(userData => {
                // console.log('agenda componentDidMount userData ', userData);
                this.userHeaders = {
                    'Authorization': 'Bearer ' + userData.token
                };
                this.userId = userData.userId;
                this.loadUserAnnouncements();
                this.loadAllCategories();
            });
    }

    loadUserAnnouncements = () => {
        announcementsStorage.getUserAnnouncements(this.userHeaders,this.userId)
            .then(response => {
                let announcements = response.data;
                console.log("announcements",announcements);
                this.setState({announcements: announcements, filteredAnnouncements: announcements});
            })
            .catch(err => console.log("loadOnAirAnnouncements error ", err))
    };


    loadAllCategories = () => {
        announcementsStorage.getCategories(this.userHeaders)
            .then(response => {
                let categories = response.data;
                console.log("categories",categories);


                this.setState({allCategories: categories});

            })
            .catch(err => console.log("loadCategories error ", err))
    };


    //Scroll view on refresh
    onRefresh = () => {
        this.setState({refreshing: true});

        this.loadUserAnnouncements();
        this.loadAllCategories();

        this.setState({refreshing: false});
    };



    //Sections of the accordion
    setSections = sections => {
        this.setState({
            activeSections: sections.includes(undefined) ? [] : sections,
        });
    };

    //Accordion header
    renderHeader = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={400}
                style={[styles.header, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor"
            >
                <Text style={styles.headerText}>{section.title}</Text>
                <Text style={styles.subHeaderText}>{this.state.allCategories.filter(c => c.categoryId === section.categoryId)[0] ? this.state.allCategories.filter(c => c.categoryId === section.categoryId)[0].categoryName : ''}   {section.creationTime.substring(0,section.creationTime.indexOf('T'))}</Text>
                <Text style={this.statusColor(this.statusesColors[section.status]).subHeaderText}>{section.status}</Text>

            </Animatable.View>

        );
    };

    renderContent(section, _, isActive) {
        return (
            <Animatable.View
                duration={400}
                style={[styles.content, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor"
            >
                <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
                    {section.content}
                </Animatable.Text>
                <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
                    {section.dateOfEvent ? "תאריך אירוע: " + section.dateOfEvent.substring(0,section.dateOfEvent.indexOf("T")) : ""}
                </Animatable.Text>


                {section.fileName && ["png","jpg"].includes(section.fileName.substring(section.fileName.indexOf(".")+1,section.fileName.length).toLowerCase()) ?
                    <ZoomImage
                        source={{uri: 'data:image/png;base64,'+section.file}}
                        // source={{uri: 'http://www.visitpinedale.org/cache/made/images/mountains/wind-river-range/cirque-of-the-towers/cirque-of-the-towers-1_760_570_76auto.jpg'}}
                        imgStyle={{flex: 1,
                            width: 250,
                            height: 150,
                            resizeMode: 'contain'}}
                        style={styles.img}
                        duration={200}
                        enableScaling={false}
                        easingFunc={Easing.ease}
                    />
                :
                    <Animatable.Text style = {{color : "#1C87FF", textDecorationLine: "underline"}} animation={isActive ? 'bounceIn' : undefined}>
                        {section.fileName ? section.fileName : ""}
                    </Animatable.Text>
                }
            </Animatable.View>
        );
    }

    statusColor = (color) => {
        return StyleSheet.create({
            subHeaderText: {
                textAlign: 'center',
                fontSize: 12,
                fontWeight: '400',
                color: color,
            },
        })

    };

    statusesColors = {
        "On air": "green",
        "Requested": "blue",
        "Cancelled": "red",
        "Expired": "brown",
    };

    backButtonPress = () => {
        this.props.navigation.navigate('AnnouncementsScreen');
        return true;
    };

    render() {
        const { activeSections } = this.state;

        return (
            <View style={styles.container}>

                <ScrollView
                    contentContainerStyle={{ paddingTop: 30 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                >


                    <Accordion
                        activeSections={activeSections}
                        sections={this.state.announcements}
                        renderHeader={this.renderHeader}
                        renderContent={this.renderContent}
                        duration={400}
                        onChange={this.setSections}
                    />

                </ScrollView>
                <Button
                    buttonStyle = {{width:400}}
                    label="חזור"
                    onPress={this.backButtonPress.bind(this)}
                />
            </View>
        );
    }

}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownStyle:{
        width: 230,
        height: 50,
    },
    searchBarStyle:{
        width: 250,
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    subHeaderText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '400',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },

    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },
    icon: {
        padding: 20,
        backgroundColor: '#fff',
    },
    img: {
        borderWidth: 3,
        borderColor: '#45b7d5',

    },
});


