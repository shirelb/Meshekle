import React from 'react';
//import './styles.css'
import 'semantic-ui-css/semantic.min.css';
import {Accordion, Button, Checkbox, Dropdown, Header, Icon, Image, Input, Menu, Table} from 'semantic-ui-react';
import {Link, Route, Switch} from "react-router-dom";
import store from 'store';
import moment from 'moment';
import times from 'lodash.times';
import {Helmet} from 'react-helmet';
import Page from '../../components/Page';
import choresStorage from "../../storage/choresStorage";
import {connectToServerSocket, WEB_SOCKET} from "../../shared/constants";
import _ from "lodash";
import Datetime from 'react-datetime';
import helpers from "../../shared/helpers";

const TOTAL_PER_PAGE = 10;

class ChoresHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chores: [],
            pageChores: 0,
            totalPagesChores: 0,
            serviceProviders: [],
            pageServiceProviders: 0,
            totalPagesServiceProviders: 0,

            activeIndex: -1,
            choresColumn: null,
            choresDirection: null,
            choresFilterColumnsAndTexts: {
                fullname: "",
                choreTypeName: "",
                originDate: "",
                date: "",
            },
            serviceProvidersColumn: null,
            serviceProvidersDirection: null,
            serviceProvidersFilterColumnsAndTexts: {
                serviceProviderId: "",
                fullname: "",
                role: "",
                operationTime: "",
                phone: "",
                appointmentWayType: "",
                active: "",
            },
            loadingErrorMessage:""
        };

        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.setPage = this.setPage.bind(this);

        this.serviceProviderHeaders = '';
        this.chores = [];
        this.serviceProviders = [];
    }

    componentDidMount() {
        this.serviceProviderHeaders = {
            'Authorization': 'Bearer ' + store.get('serviceProviderToken')
        };
        this.userId = store.get('userId');
        this.serviceProviderId = store.get('serviceProviderId');
        this.loadChores();
        connectToServerSocket(store.get('serviceProviderId'));

        //WEB_SOCKET.on("getUsers", this.loadChores.bind(this));
    }

    componentWillUnmount() {
        //WEB_SOCKET.off("getUsers");
        //WEB_SOCKET.off("getServiceProviders");
    }

    loadChores() {
        console.log("in load chores!!!!!")
        choresStorage.getAllPastUserChores(this.serviceProviderId,this.serviceProviderHeaders)
            .then((response) => {
                console.log("hisory response", response)
                if(response && response!==undefined && response.status!==200){
                    this.setState({loadingErrorMessage:"אירעה בעיה בטעינת הנתונים, נא לרענן את העמוד."})
                }
                else{

                    let chores = [];
                    let chore = 0;
                    for(chore in response.data){
                        let c = response.data[chore];
                        c.fullname = response.data[chore].User.fullname;
                        chores.push(c);
                    }
                    const totalPagesChores = Math.ceil(chores.length / TOTAL_PER_PAGE);

                    this.setState({
                        chores: chores,
                        pageChores: 0,
                        totalPagesChores,
                        loadingErrorMessage:"",
                    });

                    this.chores = chores;
                }
            });
    }



    setPage(page) {
        return () => {
            this.setState({page});
        };
    }

    decrementPage() {
        const {pageChores} = this.state;

        this.setState({pageChores: pageChores - 1});
    }

    incrementPage() {
        const {pageChores} = this.state;

        this.setState({pageChores: pageChores + 1});
    }




    handleChoresSort = clickedColumn => () => {
        const {choresColumn, chores, choresDirection} = this.state;
        console.log("sorting:", this.state.chores[0] )
        if (choresColumn !== clickedColumn) {
            this.setState({
                choresColumn: clickedColumn,
                chores: _.sortBy(chores, [clickedColumn]),
                choresDirection: 'ascending',
            });
        }
        else{
            this.setState({
                chores: _.sortBy(chores, [clickedColumn]).reverse(),
                choresDirection: choresDirection === 'ascending' ? 'descending' : 'ascending',
            })

        }

    };

    handleFilter = (clickedColumn, e) => {
        let choresFilterColumnsAndTexts = this.state.choresFilterColumnsAndTexts;
        if (e === "") {
            choresFilterColumnsAndTexts[clickedColumn] = "";
            this.setState({
                usersFilterColumnsAndTexts: choresFilterColumnsAndTexts
            })
        }
        else{
            console.log("in handleFilter e: ", e, clickedColumn);
            if (clickedColumn === "fullname" || clickedColumn === "choreTypeName") {
                choresFilterColumnsAndTexts[clickedColumn] = e.nativeEvent.srcElement.value;
            }else{
                choresFilterColumnsAndTexts[clickedColumn] = moment(e).format('YYYY-MM-DD');
            }
                this.setState({
                    choresFilterColumnsAndTexts: choresFilterColumnsAndTexts
                })
            
            }
choresFilterColumnsAndTexts = _.omitBy(this.state.choresFilterColumnsAndTexts, (att) => att === "");
        let chores = _.filter(this.chores,
            (o) =>
                Object.keys(choresFilterColumnsAndTexts).every((col) => {
                    if (col === 'originDate' || col === 'date'){
                         if(e.text && e.value){
                            return (o[col].split("-")[1] === e.value);
                         }
                         else{
                            return (o[col].split("-")[1] === choresFilterColumnsAndTexts[col].split("-")[1])&&(o[col].split("-")[0] === choresFilterColumnsAndTexts[col].split("-")[0])&&(moment(o[col]).format('DD') === choresFilterColumnsAndTexts[col].split("-")[2]);
                         }
                        }    
                    else if (_.isNumber(o[col])){
                        return o[col] === parseInt(choresFilterColumnsAndTexts[col]);
                    }
                    else if (_.isBoolean(o[col]))
                        return o[col].toString() === choresFilterColumnsAndTexts[col].toString();
                    else
                        return o[col].includes(choresFilterColumnsAndTexts[col]);
                })
        );
        this.setState({
            chores: chores,
        });
        
        console.log("after filter this.chores:", chores);
        this.setState({
            chores: chores,
        });

        console.log("in filter:", this.chores, chores)
    };

  


    render() {
        const {choresColumn, choresDirection, chores, pageChores, totalPagesChores, serviceProvidersColumn, serviceProvidersDirection, serviceProviders, pageServiceProviders, totalPagesServiceProviders, activeIndex} = this.state;
        const startIndex = pageChores * TOTAL_PER_PAGE;

        return (
            <div>
                <Page children={chores} title={"היסטוריית תורנויות"}
                      divId={'divHistoryToPrint'}>
                    <Helmet>
                        <title>Meshekle | User-Chores history</title>
                    </Helmet>
                    <br/><br/><br/>
                    <p style={{color:'red'}}>{this.state.loadingErrorMessage}</p>
                    <Button icon
                            onClick={() => helpers.exportToPDF('MeshekleHistoryToPrint', 'divHistoryToPrint', 'landscape')}>
                        <Icon name="file pdf outline"/>
                        &nbsp;&nbsp;
                        יצא לPDF
                    </Button>

                    <Table celled striped textAlign='right' selectable sortable compact={"very"} collapsing>
                        <Table.Header>
                            <Table.Row>
                                
                                <Table.HeaderCell
                                    sorted={choresColumn === 'fullname' ? choresDirection : null}
                                    onClick={this.handleChoresSort('fullname')}
                                >
                                    {"שם מלא"}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={choresColumn === 'choreTypeName' ? choresDirection : null}
                                    onClick={this.handleChoresSort('choreTypeName')}
                                >
                                    {"סוג תורנות"}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={choresColumn === 'originDate' ? choresDirection : null}
                                    onClick={this.handleChoresSort('originDate')}
                                >
                                    {"תאריך מקורי"}
                                </Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={choresColumn === 'date' ? choresDirection : null}
                                    onClick={this.handleChoresSort('date')}
                                >
                                    {"תאריך בפועל"}
                                </Table.HeaderCell>
                                
                                
                            
                            </Table.Row>
                            <Table.Row>
                               
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('fullname', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleFilter('fullname', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('choreTypeName', e)}
                                    />
                                    <Input placeholder='סנן...' className={"filterInput"}
                                           onChange={(e) => this.handleFilter('choreTypeName', e)}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('originDate', e)}
                                    />
                                    <Icon link name='x'
                                          onClick={(e) => {
                                              let choresFilterColumnsAndTexts = this.state.choresFilterColumnsAndTexts;
                                              choresFilterColumnsAndTexts.originDate = "";
                                              this.setState({
                                                  monthFilterSelected: null,
                                                  originDateFilterSelected: "",
                                                  choresFilterColumnsAndTexts: choresFilterColumnsAndTexts,
                                              });
                                              this.handleFilter('originDate', "");
                                          }}
                                    />
                                    <Dropdown
                                        text={this.state.monthFilterSelected ? this.state.monthFilterSelected : 'חודש'}
                                        floating
                                        className={"filterInput"}
                                        labeled
                                        button
                                        multiple={false}
                                        fluid
                                    >
                                        <Dropdown.Menu>
                                            {moment.months().map(month =>
                                                <Dropdown.Item
                                                    // label={{empty: true, circular: true}}
                                                    text={month + " | " + moment().month(month).format("MM")}
                                                    onClick={(event, data) => this.handleFilter('originDate', data)}
                                                    value={moment().month(month).format("MM")}
                                                />
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Table.HeaderCell>
                                
                                
                                <Table.HeaderCell>
                                    <Icon link name='filter'
                                          onClick={(e) => this.handleFilter('date', e)}
                                    />
                                    <Icon link name='x'
                                          onClick={(e) => {
                                              let choresFilterColumnsAndTexts = this.state.choresFilterColumnsAndTexts;
                                              choresFilterColumnsAndTexts.date = "";
                                              this.setState({
                                                  monthFilterSelected: null,
                                                  dateFilterSelected: "",
                                                  choresFilterColumnsAndTexts: choresFilterColumnsAndTexts,
                                              });
                                              this.handleFilter('date', "");
                                          }}
                                    />
                                    <Dropdown
                                        text={this.state.monthFilterSelected ? this.state.monthFilterSelected : 'חודש'}
                                        floating
                                        className={"filterInput"}
                                        labeled
                                        button
                                        multiple={false}
                                        fluid
                                    >
                                        <Dropdown.Menu>
                                            {moment.months().map(month =>
                                                <Dropdown.Item
                                                    // label={{empty: true, circular: true}}
                                                    text={month + " | " + moment().month(month).format("MM")}
                                                    onClick={(event, data) => this.handleFilter('date', data)}
                                                    value={moment().month(month).format("MM")}
                                                />
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Table.HeaderCell>
                                
                                
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {chores.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(chore =>
                                (<Table.Row key={chore.userChoreId}>
                                   
                                    <Table.Cell>{chore.User.fullname}</Table.Cell>
                                    <Table.Cell>{chore.choreTypeName}</Table.Cell>
                                    <Table.Cell>{moment(chore.originDate).format("DD/MM/YYYY")}</Table.Cell>
                                    <Table.Cell>{moment(chore.date).format("DD/MM/YYYY")}</Table.Cell>
                                </Table.Row>),
                            )}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan={8}>
                                    <Menu floated="left" pagination>
                                        {pageChores !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                                            <Icon name="right chevron"/>
                                        </Menu.Item>}
                                        {times(totalPagesChores, n =>
                                            (<Menu.Item as="a" key={n} active={n === pageChores}
                                                        onClick={this.setPage(n)}>
                                                {n + 1}
                                            </Menu.Item>),
                                        )}
                                        {pageChores !== (totalPagesChores - 1) &&
                                        <Menu.Item as="a" icon onClick={this.incrementPage}>
                                            <Icon name="left chevron"/>
                                        </Menu.Item>}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Page>

            
            </div>
        );
    }
}

 export default ChoresHistory