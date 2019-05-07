import React from "react";
import /*RGL,*/ { WidthProvider, Layout, Responsive } from "react-grid-layout";
import FlexRow from '../../../components/FlexRow';
import FlexColumn from '../../../components/FlexColumn'
import DepthLadder from './DepthLadder';
import MyOrders from './MyOrders'
import MyPositions from './MyPositions'
import Order from './Order'
import { connect } from 'react-redux';
import { RootState } from 'MyTypes';
import Auth from '../../../services/auth0-service';
import { Instrument } from 'MyModels';
import TopBar from './TopBar'
import Ticks from './Ticks'
import { wsSend } from '../../ws/actions';
import * as R from 'ramda'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Help from './Help';

const ReactGridLayout = WidthProvider(Responsive);
const originalLayout = getFromLS("layout") || [];
interface MyProps {
    onLayoutChange: any,
    username: string,
    credit_limit: number,
    connected: boolean,
    auth: Auth,
    instruments: ReadonlyArray<Instrument>,
    subscribedSymbols: ReadonlySet<string>,
    unsubscribedSymbols: ReadonlySet<string>,
    wsSend: typeof wsSend,
 }
/**
 * This layout demonstrates how to sync to localstorage.
 */
class LocalStorageLayout_ extends React.PureComponent<MyProps,{layout:Layout[]}> {
  static defaultProps = {
    className: "layout",
    username: 'nobody',
    credit_limit: 0,
    connected: false,
    instruments: [],
    //cols: 24,
    rowHeight: 15,
    onLayoutChange: function() {}
  };

  constructor(props: MyProps) {
    super(props);

    this.state = {
      layout: JSON.parse(JSON.stringify(originalLayout))
    };

    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
  }

  resetLayout() {
    this.setState({
      layout: []
    });
  }

  onLayoutChange(layout: Layout[]) {
    /*eslint no-console: 0*/
    console.log(`layout change`)
    saveToLS("layout", layout);
    this.setState({ layout });
    // 
    this.props.onLayoutChange(layout) ; // updates status display
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const layout = this.state.layout
    const cols = {xlg: 72, lg: 48, mmd: 40, md: 32, sm: 24, xs: 16, xxs: 8}
    const breakpoints = {xlg:2400, lg: 2000, mmd: 1600, md: 1200, sm: 800, xs: 400, xxs: 0}
    const widthTags = Object.keys(breakpoints)
    const nWidths = widthTags.length
    // For now, same layout for every breakpoint
    const layouts = R.zipObj(widthTags, Array(nWidths).fill(layout))

    return (
      <div>
        
         <TopBar isAuthenticated={isAuthenticated}
                 auth={this.props.auth}
                 connected={this.props.connected}
                 credit_limit={this.props.credit_limit}
                 username={this.props.username}/>
        <Tabs> 
            <TabList> 
                <Tab> Exchange </Tab>
                <Tab> Help </Tab>
            </TabList>
            <TabPanel>
                <FlexRow>{/*style={{direction:'ltr', display:'table-row', width:'600px'}}>*/}
                  <FlexColumn>
                    <div style={{fontSize:'12px', height: '200px', border:'1px solid black'}} 
                        data-grid={{ w:3, h:8, x: 0, y: 0,  static: true,}}
                                key="Order">
                                <Order/>
                    </div>
                    <div style={{ width: '150px'}}> Click on the Event field above and choose an event to get started</div>
                  </FlexColumn>
                    <ReactGridLayout
                        style={{/*backgroundImage, minHeight*/ width: '100%'}}
                        {...this.props}
                        layouts={layouts}
                        breakpoints={breakpoints}
                        cols={cols}
                        onLayoutChange={this.onLayoutChange}
                    >
                   {this.props.instruments.filter(
                        (i,ix) => this.props.subscribedSymbols &&
                                  this.props.subscribedSymbols.has(i.symbol) &&
                                  !(this.props.unsubscribedSymbols && 
                                    this.props.unsubscribedSymbols.has(i.symbol))
                        
                    ).map((i, ix) => (
                        <div style={{width:'100%', fontSize: '10px',border:'1px solid black',}} 
                            key={i.symbol} data-grid={{ minWidth:3, minHeight:8,
                            w: 3, h: 8, x: 3*ix, y: 0,  autoSize: true,  }}>
                            <DepthLadder symbol={i.symbol} name={i.name}></DepthLadder>
                        </div>
                    )) }

                    <div style={{border:'1px solid black'}}
                        key="MyOrders" data-grid={{ w: 12, h: 8, x: 0, y: 10, autoSize: true,}}>
                        <MyOrders/>
                    </div>
                    <div style={{border:'1px solid black'}}
                        key="MyPositions" data-grid={{ w: 12, h: 8, x: 0, y: 20, autoSize: true,}}>
                        <MyPositions/>
                    </div>

                    <div style={{border:'1px solid black'}}
                        key="Ticks" data-grid={{ w: 12, h: 8, x: 0, y: 30, autoSize: true,}}>
                        <Ticks/>
                    </div>
                         
                </ReactGridLayout>
                </FlexRow>
            </TabPanel>
            <TabPanel>
                <Help/> 
            </TabPanel>
        </Tabs>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState) => { 
    //console.log(`sub: ${JSON.stringify(state.ws.hello.subscribedSymbols.values())}`)
    return ({
        username: state.ws.hello.username,
        credit_limit: state.ws.hello.credit_limit,
        connected: state.ws.hello.connected,
        instruments: Object.values(state.ws.instruments),
        subscribedSymbols: state.ws.hello.subscribedSymbols,
        unsubscribedSymbols: state.ws.hello.unsubscribedSymbols,
    });
}
const dispatchProps = {
    wsSend: wsSend
};

export const LocalStorageLayout = connect(mapStateToProps, dispatchProps)(LocalStorageLayout_);

function getFromLS(key: string): string | undefined {
    interface Ls {
        [key:string]: any; // Add index signature
    }
  let ls: Ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-7 DONT USE")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key] || "";
}

function saveToLS(key: string, value: any) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-7",
      JSON.stringify({
        [key]: value
      })
    );
  }
}
