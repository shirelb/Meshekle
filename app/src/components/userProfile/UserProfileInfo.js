import React, {Component} from 'react';
import {Image, Linking, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {Icon, Text} from "react-native-elements";
import moment from "moment";
import mappers from "../../shared/mappers";


export default class UserProfileInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: this.props.modalVisible,
            user: this.props.user,
            roles: [],
            openedFrom: this.props.openedFrom,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let roles = [];
        nextProps.user.ServiceProviders ?
            nextProps.user.ServiceProviders.forEach(provider => {
                roles.push(mappers.serviceProviderRolesMapper(provider.role));
            }) : null;
        this.setState({
            user: nextProps.user,
            roles: roles,
        });

        this.setState({
            modalVisible: this.props.modalVisible,
            openedFrom: this.props.openedFrom,
        });
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    render() {
        const user = this.state.user;
        // console.log('user ', user);

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    this.setState({user: {}})
                }}
            >
                <View style={{marginTop: 20}}>
                    <ScrollView>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <View style={{marginLeft: 20, marginTop: 20}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                        this.setState({user: {}})
                                    }}
                                >
                                    <Icon
                                        name='arrow-forward'
                                        size={50}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.circle1}>
                                <View style={styles.circle2}>
                                    <View style={styles.circle3}>
                                        <Image style={styles.avatar}
                                               source={{uri: user.image}}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>


                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around',}}>
                            <Text h3 style={styles.textName}>{user.fullname}</Text>

                            {this.state.openedFrom === "DrawerMenu" ?
                                <TouchableOpacity
                                    onPress={() => {
                                        // this.setModalVisible(!this.state.modalVisible);
                                        this.setState({modalVisible: false, user: {}});
                                        this.props.setFormModalVisible();
                                    }}
                                    style={{marginTop: 10}}
                                >
                                    <Icon
                                        name='edit'
                                        size={30}
                                    />
                                </TouchableOpacity>
                                : <View style={{width: 50}}/>
                            }
                        </View>

                        <View
                            style={{
                                height: 2,
                                width: "86%",
                                backgroundColor: "#CED0CE",
                                marginLeft: "14%"
                            }}
                        />

                        {this.state.openedFrom === "DrawerMenu" ?
                            <View style={styles.viewInfo}>
                                <Icon name='lock' style={styles.iconInfo}/>
                                <TextInput
                                    editable={false}
                                    secureTextEntry
                                    style={styles.textInput}
                                    underlineColorAndroid="transparent"
                                >
                                    {user.password}
                                </TextInput>
                            </View> : null
                        }
                        <View pointerEvents={this.state.openedFrom === "DrawerMenu" ? 'none' : 'auto'}>
                            <TouchableOpacity style={styles.viewInfo}
                                              onPress={() => Linking.openURL(`tel:${user.cellphone}`)}>
                                <Icon name='phone-android' style={styles.iconInfo}/>
                                <Text style={styles.textInfo}>
                                    {user.cellphone}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View pointerEvents={this.state.openedFrom === "DrawerMenu" ? 'none' : 'auto'}>
                            <TouchableOpacity style={styles.viewInfo}
                                              onPress={() => Linking.openURL(`tel:${user.phone}`)}>
                                <Icon name='phone' style={styles.iconInfo}/>
                                <Text style={styles.textInfo}>{user.phone}</Text>
                            </TouchableOpacity>
                        </View>
                        <View pointerEvents={this.state.openedFrom === "DrawerMenu" ? 'none' : 'auto'}>
                            <TouchableOpacity style={styles.viewInfo}
                                              onPress={() => Linking.openURL(`mailto:${user.email}`)}>
                                {/*title="support@example.com">*/}
                                <Icon name='mail-outline' style={styles.iconInfo}/>
                                <Text style={styles.textInfo}>{user.email}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewInfo}>
                            <Icon name='envelope-square' type='font-awesome'
                                  style={styles.iconInfo}/>
                            <Text style={styles.textInfo}>{user.mailbox}</Text>
                        </View>
                        <View style={styles.viewInfo}>
                            <Icon name='cake' style={styles.iconInfo}/>
                            <Text style={styles.textInfo}>{moment(user.bornDate).format('DD/MM')}</Text>
                        </View>

                        {this.state.roles.length > 0 ?
                            <View style={styles.viewInfo}>
                                <Icon name='work' style={styles.iconInfo}/>
                                <Text style={styles.textInfo}>
                                    {this.state.roles.join(", ")}
                                </Text>
                            </View> : null
                        }

                        {/*<View style={{marginTop: 20}}>
                            <Button
                                label='חזור'
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                                        this.setState({user: {}})
                                }}
                            />
                        </View>*/}

                    </ScrollView>

                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    textTitle: {
        textAlign: 'center',
        color: '#050505',
        fontWeight: 'bold',
    },


    circle1: {
        width: 250,
        height: 250,
        borderRadius: 250 / 2,
        backgroundColor: '#2a674f',
        alignSelf: 'flex-end',
        marginTop: -50,
        marginRight: -50,
        position: 'relative',
    },
    circle2: {
        width: 240,
        height: 240,
        borderRadius: 240 / 2,
        backgroundColor: '#388b6b',
        alignSelf: 'flex-end',
        marginTop: -10,
        marginRight: -10,
        position: 'absolute',
    },
    circle3: {
        width: 225,
        height: 225,
        borderRadius: 225 / 2,
        backgroundColor: '#4aba91',
        alignSelf: 'flex-end',
        marginTop: 0,
        marginRight: 0,
        position: 'absolute',
    },

    avatar: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        borderWidth: 4,
        borderColor: "white",
        position: 'absolute',
        marginTop: 60,
        marginRight: 40,
        marginLeft: 20,
    },

    viewInfo: {
        // width: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center"
    },

    iconInfo: {
        fontSize: 21,
        // color: '#bbbbbb',
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20,
    },

    textInfo: {
        // color: '#bbbbbb',
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20,
    },

    textName: {
        marginLeft: 20,
        marginRight: 20,
    },

    textInput: {
        height: 50,
        // borderRadius: 10 ,
        // borderWidth: 2,
        // borderColor: '#009688',
        backgroundColor: "#FFF",
        // marginBottom: 10,
        color: '#838383',
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20,
    }

});
