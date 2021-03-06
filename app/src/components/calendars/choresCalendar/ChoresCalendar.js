import React, {Component} from "react";
import {FlatList, Modal, StyleSheet, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Calendar, LocaleConfig} from "react-native-calendars";
import moment from "moment";
import phoneStorage from "react-native-simple-store";
import {List, ListItem} from "react-native-elements";
import Button from "../../../components/submitButton/Button";
import choresStorage from "../../../storage/choresStorage";
import ReplacementsChoresCalendar from "../choresCalendar/ReplacementsChoresCalendar";
import axios from "axios";
import ReplacementRequests from "../../choresComponents/ReplacementRequests";
import ClosedReplacementRequests from "../../choresComponents/ClosedReplacementRequests";
import {APP_SOCKET, connectToServerSocket} from "../../../shared/constants";

export default class ChoresCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markedDates: {},
            selectedDate: "",
            dateModalVisible: false,
            choreModalVisible: false,
            type: {
                message: "",
                type: {workers: "", startTime: "", endTime: "", choreTypeName: ""}
            },
            workers: "",
            replacementsModal: false,
            userChoreSelected: "",
            requestsModal: false,
            closedRequestsModal: false,
            alertModal: false,
            alertContent: "",
            refreshing: false,
        };

        this.userHeaders = {};
        this.userId = null;
        this.onDayPress = this.onDayPress.bind(this);
        this.loadUserChores = this.loadUserChores.bind(this);
    }

    componentDidMount() {
        phoneStorage.get("userData").then(userData => {
            this.userHeaders = {
                Authorization: "Bearer " + userData.token
            };
            this.userId = userData.userId;
            connectToServerSocket(userData.userId);

            this.loadUserChores();
            APP_SOCKET.on("getUserChore", this.loadUserChores.bind(this));
            APP_SOCKET.on("getChangeInUserChores", this.loadUserChores.bind(this));
            APP_SOCKET.on("removeUserChore", this.loadUserChores.bind(this));
        });
    }

    componentWillUnmount() {
        APP_SOCKET.off("getUserChore");
        APP_SOCKET.off("getChangeInUserChores");
    }

    loadUserChores() {
        choresStorage
            .getUserChoresForUser(this.userId, this.userHeaders)
            .then(response => {
                if (response && response.status !== 200) {
                    alert("בעיה בהבאת נתונים מהשרת, נסה לרענן עמוד.");
                } else {
                    let markedDates = [];
                    response.data.chores.forEach(userChore => {
                        if (
                            userChore.date !== undefined &&
                            (userChore.date !== null && userChore.date)
                        ) {
                            const date = moment(userChore.date).format("YYYY-MM-DD");
                            if (
                                markedDates[date] === undefined ||
                                markedDates[date] === null
                            ) {
                                markedDates[date] = {
                                    marked: true,
                                    selected: userChore.isMark,
                                    userChores: [],
                                    selectedColor: "yellow"
                                };
                            }
                            let requests = [
                                choresStorage.getChoreTypeSetting(
                                    this.userId,
                                    this.userHeaders,
                                    userChore.choreTypeName
                                ),
                                choresStorage.getOtherWorkers(
                                    this.userId,
                                    this.userHeaders,
                                    userChore.choreTypeName,
                                    moment(date).format("MM"),
                                    moment(date).format("YYYY"),
                                    date
                                )
                            ];

                            markedDates[date].selected =
                                userChore.isMark || markedDates[date].selected; //uc.isMark;
                            axios.all(requests).then(responses => {
                                if (responses[1] === undefined || responses[0].status !== 200) {
                                    alert("בעיה בהבאת פרטי התורנות, נסה לרענן את העמוד");
                                } else {
                                    console.log("LOAD USERSCHORES response: ", response);
                                    var uc = userChore;
                                    uc.type = responses[0].data;

                                    markedDates[date].userChores.push(uc);
                                    this.setState({
                                        markedDates: markedDates,
                                        workers: String(responses[1])
                                    });
                                    this.forceUpdate();
                                }
                            });
                        }
                    });

                    this.setState({
                        markedDates: markedDates
                    });
                    this.forceUpdate();
                    //
                }
            });
    }

    onDaySelect = day => {
        console.log(
            "this.state.selectedDate === '' ",
            this.state.selectedDate === ""
        );
        //if (this.state.selectedDate !== '')
        //console.log('this.state.markedDates[selectedDate].userChores.length === 0 ', this.state.markedDates[this.state.selectedDate].userChores.length === 0);

        console.log("in onDaySelect day ", day);
        let updatedMarkedDates = this.state.markedDates;

        if (
            this.state.selectedDate !== "" &&
            updatedMarkedDates[this.state.selectedDate] !== undefined
        ) {
            let lastMarkedDate = updatedMarkedDates[this.state.selectedDate];
            lastMarkedDate.selected = false;
            updatedMarkedDates[this.state.selectedDate] = lastMarkedDate;
        }

        const selectedDay = moment(day.dateString).format("YYYY-MM-DD");
        if (updatedMarkedDates[selectedDay] === undefined)
            updatedMarkedDates[selectedDay] = {
                marked: true,
                selected: false,
                userChores: []
            };
        let newMarkedDate = updatedMarkedDates[selectedDay];
        //newMarkedDate.selected = true;
        newMarkedDate.color = "blue";
        updatedMarkedDates[selectedDay] = newMarkedDate;

        this.setState({
            selectedDate: moment(day.dateString).format("YYYY-MM-DD"),
            markedDates: updatedMarkedDates,
            dateModalVisible: true,
            choreModalVisible: false
        });
    };

    onDayPress = date => {
        console.log("in day press ");
        this.setState({
            date: new Date(date.year, date.month - 1, date.day)
        });
    };

    onDayChange = date => {
        console.log("in day change ");
        this.setState({
            date: new Date(date.year, date.month - 1, date.day)
        });
    };

    renderItem(item) {
        return (
            <View style={[styles.item, {height: item.height}]}>
                <Text>{item.choreTypeName}</Text>
                <Text>{item.date}</Text>
            </View>
        );
    }

    renderDay(day) {
        return (
            <View style={styles.dayMonthContainer}>
                <Text style={styles.day}>{day ? day.day : null} </Text>
                <Text style={styles.dayMonth}>
                    {day
                        ? LocaleConfig.locales["il"].monthNamesShort[day.month - 1]
                        : null}{" "}
                </Text>
                <Text style={styles.dayMonth}>
                    {day
                        ? LocaleConfig.locales["il"].dayNames[
                            new Date(day.timestamp).getDay()
                            ]
                        : null}{" "}
                </Text>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}>
                <Text> </Text>
            </View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    getDateStringFromDateAndTime = dateAndTime => {
        const date = new Date(dateAndTime);
        return date.toISOString().split("T")[0];
    };
    getTimeStringFromDateAndTime = dateAndTime => {
        const date = new Date(dateAndTime);
        return date
            .toISOString()
            .split("T")[1]
            .split(".")[0]
            .slice(0, -3);
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    renderRow = ({item}) => {
        return (
            <ListItem
                roundAvatar
                title={
                    item.isMark
                        ? item.choreTypeName + " <מסומן כמחפש/ת החלפה>"
                        : item.choreTypeName
                }
                titleStyle={{fontSize: 20, color: "#00BFFF"}}
                containerStyle={{borderBottomWidth: 0}}
                onPress={() => {
                    choresStorage
                        .getOtherWorkers(
                            this.userId,
                            this.userHeaders,
                            item.choreTypeName,
                            moment(item.date).format("MM"),
                            moment(item.date).format("YYYY"),
                            item.date
                        )
                        .then(res => {
                            if (res === undefined) {
                                alert("אירעה בעיה בהבאת נתונים מהשרת, נסה לרענן עמוד");
                            } else {
                                this.setState({
                                    choreModalVisible: true,
                                    type: item.type,
                                    userChoreSelected: item,
                                    workers: res
                                });
                            }
                        });
                }}
            />
        );
    };

    onRefresh = () => {
        this.setState({refreshing: true});

        this.loadUserChores();

        this.setState({refreshing: false});
    };

    render() {
        LocaleConfig.defaultLocale = "il";

        let currDay = new Date(); // get current date
        let currDayStr = new Date().toUTCString(); // get current date

        return (
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
            }>
                <Calendar
                    markedDates={this.state.markedDates}
                    onDayPress={this.onDaySelect}
                    style={styles.calendar}
                    theme={{
                        backgroundColor: "#ffffff",
                        calendarBackground: "#ffffff",
                        textSectionTitleColor: "#b6c1cd",
                        selectedDayBackgroundColor: "#00adf5",
                        selectedDayTextColor: "#ffffff",
                        todayTextColor: "#00adf5",
                        dayTextColor: "#2d4150",
                        textDisabledColor: "#d9e1e8",
                        dotColor: "#00adf5",
                        selectedDotColor: "#ffffff",
                        arrowColor: "orange",
                        monthTextColor: "blue",
                        textDayFontFamily: "monospace",
                        textMonthFontFamily: "monospace",
                        textDayHeaderFontFamily: "monospace",
                        textMonthFontWeight: "bold",
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
                <Button
                    style={{marginTop: 10}}
                    label="בקשות החלפה"
                    onPress={() => {
                        this.setState({requestsModal: true});
                    }}
                />
                <Button
                    label="בקשות סגורות"
                    onPress={() => {
                        this.setState({closedRequestsModal: true});
                    }}
                />
                <Modal
                    visible={this.state.requestsModal}
                    onRequestClose={() => {
                        this.setState({requestsModal: false});
                    }}
                >
                    <ReplacementRequests
                        onClose={() => {
                            this.loadUserChores();
                            this.setState({requestsModal: false});
                        }}
                        loadUserChores={this.loadUserChores}
                    />
                </Modal>
                <Modal
                    visible={this.state.closedRequestsModal}
                    onRequestClose={() => {
                        this.setState({closedRequestsModal: false});
                    }}
                >
                    <ClosedReplacementRequests
                        onClose={() => {
                            this.setState({closedRequestsModal: false});
                        }}
                    />
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.dateModalVisible}
                    onRequestClose={() => {
                        this.setState({dateModalVisible: false});
                    }}
                >
                    <View style={{marginTop: 22}}>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({dateModalVisible: false});
                                }}
                            >
                                <Button
                                    label="חזור"
                                    onPress={() => {
                                        this.setState({dateModalVisible: false});
                                    }}
                                />
                            </TouchableOpacity>

                            <Text style={{fontSize: 30, textAlign: "center"}}>
                                {" "}
                                {moment(this.state.selectedDate).format("DD-MM-YYYY")}{" "}
                            </Text>

                            <List
                                containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
                            >
                                {this.state.selectedDate === "" ||
                                this.state.markedDates[this.state.selectedDate] === undefined ||
                                this.state.markedDates[this.state.selectedDate].userChores ===
                                undefined ||
                                this.state.markedDates[this.state.selectedDate].userChores
                                    .length === 0 ? (
                                    <Text style={{fontSize: 20}}>
                                        אין לך תורנויות לתאריך זה{" "}
                                    </Text>
                                ) : (
                                    <FlatList
                                        data={
                                            this.state.markedDates[this.state.selectedDate].userChores
                                        }
                                        renderItem={this.renderRow}
                                        keyExtractor={item => item.userId}
                                        ItemSeparatorComponent={this.renderSeparator}
                                    />
                                )}
                            </List>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.choreModalVisible}
                    onRequestClose={() => {
                        this.setState({choreModalVisible: false});
                    }}
                >
                    <View style={{marginTop: 22}}>
                        <View>
                            {/*<TouchableOpacity*/}
                            <Button
                                label="חזור"
                                onPress={() => {
                                    console.log("\nclosepressed\n");
                                    this.setState({
                                        dateModalVisible: true,
                                        choreModalVisible: false
                                    });
                                }}
                            />
                            <Text>פרטי תורנות</Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    textAlign: "center"
                                }}
                            >
                                {" "}
                                {moment(this.state.selectedDate).format("DD-MM-YYYY")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    textAlign: "center"
                                }}
                            >
                                {this.state.type.type.choreTypeName + " \n"}
                            </Text>
                            <Text>תורנים:</Text>
                            <Text style={{fontSize: 18, textAlign: "center"}}>
                                {this.state.workers}
                            </Text>
                            <Text>שעות פעילות:</Text>
                            <Text style={{fontSize: 18, textAlign: "center"}}>
                                {this.state.type.type.endTime +
                                "-" +
                                this.state.type.type.startTime}
                            </Text>
                            {/*</TouchableOpacity>*/}
                            {moment(this.state.userChoreSelected.date) >=
                            moment(Date.now()) ? (
                                <View>
                                    {this.state.userChoreSelected.isMark ? (
                                        <Button
                                            label="הסר סימון"
                                            onPress={() => {
                                                choresStorage
                                                    .generalReplacementRequest(
                                                        this.userId,
                                                        this.userHeaders,
                                                        this.state.userChoreSelected.userChoreId,
                                                        false
                                                    )
                                                    .then(res => {
                                                        if (res && res.status !== 200) {
                                                            alert("בעיה! הפעולה לא בוצעה, נסה שנית.");
                                                        } else {
                                                            this.setState({
                                                                alertModal: true,
                                                                alertContent:
                                                                    "כעת התורנות שלך אינה מסומנת כמחפשת החלפה"
                                                            });
                                                            this.loadUserChores();
                                                        }
                                                    });
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            label="סמן אותי"
                                            onPress={() => {
                                                choresStorage
                                                    .generalReplacementRequest(
                                                        this.userId,
                                                        this.userHeaders,
                                                        this.state.userChoreSelected.userChoreId,
                                                        true
                                                    )
                                                    .then(res => {
                                                        if (res && res.status !== 200) {
                                                            alert("בעיה! הפעולה לא בוצעה, נסה שנית.");
                                                        } else {
                                                            this.setState({
                                                                alertModal: true,
                                                                alertContent:
                                                                    "כעת התורנות שלך מסומנת כמחפשת החלפה"
                                                            });
                                                            this.loadUserChores();
                                                        }
                                                    });
                                            }}
                                        />
                                    )}

                                    <Button
                                        label="חפש החלפה"
                                        onPress={() => {
                                            this.setState({replacementsModal: true});
                                        }}
                                    />
                                </View>
                            ) : (
                                <View/>
                            )}
                            <Modal
                                visible={this.state.replacementsModal}
                                onRequestClose={() => {
                                    this.setState({replacementsModal: false});
                                }}
                            >
                                <ReplacementsChoresCalendar
                                    choreTypeName={this.state.type.type.choreTypeName}
                                    //chores={this.state.markedDates[this.state.selectedDate].userChores}
                                    userChoreSelected={this.state.userChoreSelected}
                                    onClose={() => {
                                        this.setState({
                                            replacementsModal: false,
                                            choreModalVisible: false,
                                            dateModalVisible: false
                                        });
                                    }}
                                />
                            </Modal>
                            <Modal
                                visible={this.state.alertModal}
                                onRequestClose={() => {
                                    this.setState({alertModal: false});
                                }}
                            >
                                <Text>{this.state.alertContent}</Text>
                                <Button
                                    onPress={() => this.setState({alertModal: false})}
                                    label={"סגור"}
                                />
                            </Modal>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    calendar: {
        borderTopWidth: 2,
        marginBottom: 10,
        paddingTop: 5,
        borderBottomWidth: 2,
        borderColor: "#eee",
        height: 350
    },
    item: {
        backgroundColor: "white",
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
        borderTopWidth: 2,
        borderTopColor: "grey",
        borderBottomWidth: 2,
        borderBottomColor: "grey"
    },
    dayMonthContainer: {
        height: 100
        // borderTopWidth: 2,
        // borderTopColor: 'grey',
    },
    day: {
        fontSize: 20,
        fontWeight: "300",
        // color: appStyle.agendaDayMonthColor,
        marginTop: -5,
        backgroundColor: "rgba(0,0,0,0)"
    },
    dayMonth: {
        fontSize: 14,
        fontWeight: "300",
        // color: appStyle.agendaDayMonthColor,
        marginTop: -5,
        backgroundColor: "rgba(0,0,0,0)"
    }
});