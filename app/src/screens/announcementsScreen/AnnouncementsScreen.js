import React, {Component} from 'react';
import {Platform, RefreshControl,Switch, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import phoneStorage from "react-native-simple-store";
import announcementsStorage from "../../storage/announcementsStorage";
import {Icon, SearchBar} from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import ZoomImage from 'react-native-zoom-image';
import {Easing} from 'react-native';
import { Divider } from 'react-native-elements';


export default class AnnouncementsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            announcements: [],
            filteredAnnouncements: [],
            categories: [],
            settingsModal: false,
            addAnnouncementsModal: false,
            refreshing: false,
            search: "",
            categoryNameFilter:"Any",
            activeSections: [],
            categoriesDisplay:[],
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
                this.loadOnAirAnnouncements();
                this.loadCategories();
            });
    }

    loadOnAirAnnouncements = () => {
      announcementsStorage.getOnAirAnnouncements(this.userHeaders)
          .then(response => {
            let announcements = response.data;
            console.log("announcements",announcements);
            this.setState({announcements: announcements, filteredAnnouncements: announcements});
          })
          .catch(err => console.log("loadOnAirAnnouncements error ", err))
    };

    loadCategories = () => {
        announcementsStorage.getUniqueCategories(this.userHeaders)
            .then(response => {
                let categories = response.data;
                console.log("categories",categories);

                let categoriesDisplay = [{value: "Any"}];
                categoriesDisplay = categoriesDisplay.concat(categories.map(cat => {return {value : cat.categoryName}}));
                this.setState({categories: categories,categoriesDisplay:categoriesDisplay});

            })
            .catch(err => console.log("loadCategories error ", err))
    };


    //Scroll view on refresh
    onRefresh = () => {
        this.setState({refreshing: true});

        this.loadOnAirAnnouncements();
        this.loadCategories();

        this.setState({refreshing: false,categoryNameFilter:"Any",search:""});
    };

    //Search bar filter
    updateSearch = searchInput => {
        let categoryId = this.state.categories.filter(cat => cat.categoryName === this.state.categoryNameFilter)[0].categoryId;
        this.setState({filteredAnnouncements: this.state.announcements.filter(a => {
            return a.title.toLowerCase().includes(searchInput.toLowerCase()) &&
            (this.state.categoryNameFilter === "Any" || categoryId === a.categoryId)
            }), search:searchInput});
    };

    //Category dropdown filter
    updateDropdown = categoryName => {
        let categoryId=-1;
        if(categoryName !== 'Any'){
            categoryId = this.state.categories.filter(cat => cat.categoryName === categoryName)[0].categoryId;
        }
        this.setState({filteredAnnouncements: this.state.announcements.filter(a => {
                return a.title.toLowerCase().includes(this.state.search.toLowerCase()) &&
                    (categoryName === "Any" || categoryId === a.categoryId)
            }), categoryNameFilter: categoryName});
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
                <Text style={styles.subHeaderText}>{this.state.categories.filter(c => c.categoryId === section.categoryId)[0].categoryName}   {section.creationTime.substring(0,section.creationTime.indexOf('T'))}</Text>
                {/*<Divider style={{ backgroundColor: 'black' }} />*/}

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

    onSettingsPress = () => {
        this.onNavigateOut();
        this.props.navigation.navigate('UserAnnouncementsSettings')
    };
    onSendRequestPress = () => {
        this.onNavigateOut();
        this.props.navigation.navigate('RequestAnnouncement')
    };
    onWatchRequestsPress = () => {
        this.onNavigateOut();
        this.props.navigation.navigate('UserAnnouncementsRequests')
    };

    onNavigateOut = () => {
        this.setState({
            search: "",
            categoryNameFilter: "Any",
            announcements: this.state.announcements,
            filteredAnnouncements: this.state.announcements
        });
    };

    render() {
        const { activeSections } = this.state;

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

                    <Dropdown
                        containerStyle={styles.dropdownStyle}
                        label='Choose Category filter'
                        data={this.state.categoriesDisplay}
                        value={this.state.categoryNameFilter}
                        onChangeText={this.updateDropdown.bind(this)}
                    />

                    <Icon
                        style= {styles.icon}
                        name='settings'
                        onPress={this.onSettingsPress.bind(this)}
                    />
                    <Icon
                        style= {styles.icon}
                        name='add-circle'
                        onPress={this.onSendRequestPress.bind(this)}
                    />
                    <Icon
                        style= {styles.icon}
                        name='history'
                        onPress={this.onWatchRequestsPress.bind(this)}
                    />

                </View>



                <ScrollView
                    contentContainerStyle={{ paddingTop: 30 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                >
                    <SearchBar
                        containerStyle={styles.searchBarStyle}
                        placeholder="חפש לפי כותרת..."
                        lightTheme
                        onChangeText={this.updateSearch.bind(this)}
                        value={this.state.search}
                    />


                    <Accordion
                        activeSections={activeSections}
                        sections={this.state.filteredAnnouncements}
                        renderHeader={this.renderHeader}
                        renderContent={this.renderContent}
                        duration={400}
                        onChange={this.setSections}
                    />
                </ScrollView>

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


