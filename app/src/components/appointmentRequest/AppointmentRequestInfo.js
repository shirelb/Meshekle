import React, {Component} from 'react';
import {Modal, ScrollView, StyleSheet, View} from "react-native";
import {FormLabel, Text} from "react-native-elements";
import Button from "../submitButton/Button";
import {List} from "react-native-paper";
import mappers from "../../shared/mappers";
import colors from "../../shared/colors";


export default class AppointmentRequestInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: this.props.modalVisible,
            optionalTimes: JSON.parse(this.props.appointmentRequest.optionalTimes),
        };

    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            modalVisible: this.props.modalVisible,
        })
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible,appointmentRequestDetails: {},});
    }

    render() {
        const appointmentRequest = this.props.appointmentRequest;
        console.log('appointmentRequest ', appointmentRequest);

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    this.props.closeAppointmentRequestInfo();
                }}
            >
                <View style={{marginTop: 20}}>
                    <ScrollView>
                        <Text h4 style={styles.textTitle}>בקשת תור</Text>
                        {/*<Header
                                backgroundColor={'white'}
                                // leftComponent={{ icon: 'menu', color: '#fff' }}
                                centerComponent={{ text: 'בקשת תור', style: { color: '#050505',fontWeight: 'bold',fontSize:26 } }}
                                // rightComponent={{ icon: 'home', color: '#fff' }}
                            />*/}

                        <FormLabel>נותן שירות</FormLabel>
                        <Text style={{marginLeft: 10}}>
                            {appointmentRequest.serviceProviderFullname}
                        </Text>

                        <FormLabel> ענף</FormLabel>
                        <Text style={{marginLeft: 10}}>
                            {mappers.serviceProviderRolesMapper(appointmentRequest.AppointmentDetail.role)}
                        </Text>

                        <FormLabel> סטאטוס</FormLabel>
                        <Text style={{marginLeft: 10}}>
                            {mappers.appointmentRequestStatusMapper(appointmentRequest.status)}
                        </Text>

                        <FormLabel>נושא</FormLabel>
                        <Text style={{marginLeft: 10}}>
                            {JSON.parse(appointmentRequest.AppointmentDetail.subject).join(", ")}
                        </Text>

                        <FormLabel> תאריכים ושעות אופציונאליים</FormLabel>
                        <List.Section>
                            {Array.isArray(this.state.optionalTimes) &&
                            this.state.optionalTimes.map((item, index) => {
                                return <List.Accordion
                                    key={index}
                                    // title={moment(item.startDateAndTime).format('HH:mm') + '-' + moment(item.endDateAndTime).format('HH:mm')}
                                    title={item.date}
                                    // description={item.AppointmentDetail.role + ',' + item.AppointmentDetail.serviceProviderId}
                                    // left={props => <List.Icon {...props} icon="perm-contact-calendar"/>}
                                    // expanded={this.state.expanded[item.date]}
                                    expanded={item.expanded}
                                    onPress={() => {
                                        // let expanded = this.state.expanded;
                                        // expanded[item.date] = !expanded[item.date];
                                        // this.setState({expanded: expanded})
                                        let datesAndTimes = this.state.optionalTimes;
                                        datesAndTimes[index].expanded = !datesAndTimes[index].expanded;
                                        this.setState({optionalTimes: datesAndTimes})
                                    }}
                                >
                                    {Array.isArray(item['hours']) && item['hours'] ?
                                        item['hours'].map((hour, j) => {
                                            return <List.Item
                                                key={j}
                                                title={hour.startHour + '-' + hour.endHour}
                                                // description={item.remarks}
                                                containerStyle={{borderBottomWidth: 0}}
                                                onPress={() => console.log("item was presssed!!  ", item)}
                                            />
                                        }) : null
                                    }
                                </List.Accordion>
                            })
                            }
                        </List.Section>

                        <FormLabel>הערות</FormLabel>
                        <Text style={{marginLeft: 10}}>
                            {appointmentRequest.notes === "" ? "אין הערות" : appointmentRequest.notes}
                        </Text>

                        <View style={{marginTop: 20}}>
                            <Button
                                label='מחק'
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                    this.props.cancelAppointmentRequest(appointmentRequest);
                                    this.props.closeAppointmentRequestInfo();
                                }}
                                color={colors.TORCH_RED}
                            />
                            <Button
                                label='חזור'
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                    this.props.closeAppointmentRequestInfo();
                                }}
                            />
                        </View>

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
    }
});
