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
import RNFetchBlob from 'rn-fetch-blob'
var RNFS = require('react-native-fs');
import Button from "../../components/submitButton/Button"

import Share from 'react-native-share';
import {PermissionsAndroid} from 'react-native';


export default class AnnouncementsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            announcements: [],
            filteredAnnouncements: [],
            categories: [],
            allCategories:[],
            settingsModal: false,
            addAnnouncementsModal: false,
            refreshing: false,
            search: "",
            categoryNameFilter:"Any",
            activeSections: [],
            categoriesDisplay:[],
        };
        //TODO: CHECK IF RUN IN ANDROID OR IPHONE
        this.requestSaveFilePermission();
    }

    async requestSaveFilePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
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
                this.loadAllCategories();
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

        this.loadOnAirAnnouncements();
        this.loadCategories();

        this.setState({refreshing: false,categoryNameFilter:"Any",search:""});
    };

    //Search bar filter
    updateSearch = searchInput => {
        let categoriesWithFilterdName = this.state.allCategories.filter(cat => cat.categoryName === this.state.categoryNameFilter).map(item => item.categoryId);

        this.setState({filteredAnnouncements: this.state.announcements.filter(a => {
            return a.title.toLowerCase().includes(searchInput.toLowerCase()) &&
            (this.state.categoryNameFilter === "Any" || categoriesWithFilterdName.includes(a.categoryId))
            }), search:searchInput});
    };

    //Category dropdown filter
    updateDropdown = categoryName => {
        let categoriesWithFilterdName=[];
        if(categoryName !== 'Any'){
            categoriesWithFilterdName = this.state.allCategories.filter(cat => cat.categoryName === categoryName).map(item => item.categoryId);
        }
        this.setState({filteredAnnouncements: this.state.announcements.filter(a => {
                return a.title.toLowerCase().includes(this.state.search.toLowerCase()) &&
                    (categoryName === "Any" || categoriesWithFilterdName.includes(a.categoryId))
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
                <Text style={styles.subHeaderText}>{this.state.allCategories.filter(c => c.categoryId === section.categoryId)[0] ? this.state.allCategories.filter(c => c.categoryId === section.categoryId)[0].categoryName : ''}   {section.creationTime.substring(0,section.creationTime.indexOf('T'))}</Text>
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

                {section.fileName ?

                    <Button
                        containerStyle={styles.downloadButton}
                        label="save file"
                        onPress={() => {
                            let date = new Date();
                            console.log(section);
                             let dir = RNFS.ExternalStorageDirectoryPath+'/Pictures';
                            console.warn(dir);
                            // let path = dir + "/me"+Math.floor(date.getTime() + date.getSeconds() / 2);
                            let path = dir + '/'+section.fileName;

                            RNFS.writeFile(path, section.file, 'base64')
                                .then((success) => {
                                    /*Share.open({
                                        title: 'Share via',
                                        message: 'some message',
                                        url: 'file://'+path
                                    })
                                        .then((res) => { console.warn(res) })
                                        .catch((err) => { err && console.error(err); });*/

                                }).catch((e) => {
                                console.warn(e);
                            });

                        }}
                    />
                 :
                    null
                }
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
                    null
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

    downloadAnnouncementFile = (announcement) => {
        console.log(announcement);
        let PictureDir = RNFetchBlob.fs.dirs.PictureDir;
        let path = PictureDir + "/me_"+Math.floor(date.getTime() + date.getSeconds() / 2);
        RNFS.writeFile(path,announcement.file,'base64')
            .then(() => console.log("file downloaded"));
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
                        raised
                        type='material'
                        color='black'
                        style= {styles.icon}
                        name='settings'
                        onPress={this.onSettingsPress.bind(this)}
                    />
                    <Icon
                        raised
                        type='material'
                        color='black'
                        style= {styles.icon}
                        name='add-circle'
                        onPress={this.onSendRequestPress.bind(this)}
                    />
                    <Icon
                        raised
                        type='font-awesome'
                        color='black'
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
                        inputStyle={{backgroundColor: 'white'}}
                        containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 5}}
                        placeholderTextColor='grey'
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
        width: 150,
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
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    downloadButton: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});


