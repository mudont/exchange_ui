import React from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import DepthLadder from './DepthLadder';
import MyOrders from './MyOrders'
import MyPositions from './Mypositions'
import Order from './Order'
import { connect } from 'react-redux';
import { RootState } from 'MyTypes';
import Auth from '../../../services/auth0-service';
import { Instrument } from 'MyModels';
import TopBar from './TopBar'
import Ticks from './Ticks'
import { wsSend } from '../../ws/actions';

const ReactGridLayout = WidthProvider(RGL);
const originalLayout = getFromLS("layout") || [];
interface MyProps {
    onLayoutChange: any,
    username: string,
    auth: Auth,
    instruments: Instrument[],
    wsSend: typeof wsSend,
 }
/**
 * This layout demonstrates how to sync to localstorage.
 */
class LocalStorageLayout_ extends React.PureComponent<MyProps,{layout:Layout[]}> {
  static defaultProps = {
    className: "layout",
    username: 'unknown',
    instruments: [],
    cols: 24,
    rowHeight: 20,
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
    this.props.onLayoutChange(layout); // updates status display
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
         <TopBar isAuthenticated={isAuthenticated}
                 auth={this.props.auth}
                 wsSend={this.props.wsSend}
                 username={this.props.username}/>

         <ReactGridLayout
            //style={{backgroundImage, minHeight}}
            {...this.props}
            layout={this.state.layout}
            onLayoutChange={this.onLayoutChange}
            >
            <div style={{fontSize:'12px', height: '200px', border:'1px solid black'}} 
                    key="Order" data-grid={{ w:3, h:8, x: 0, y: 0,  static: true,}}>
                    <Order/>
            </div>
            <div style={{border:'1px solid black'}}
                key="MyOrders" data-grid={{ w: 12, h: 8, x: 0, y: 15, autoSize: true,}}>
                <MyOrders/>
            </div>
            <div style={{border:'1px solid black'}}
                key="MyPositions" data-grid={{ w: 12, h: 8, x: 0, y: 25, autoSize: true,}}>
                <MyPositions/>
            </div>

            <div style={{border:'1px solid black'}}
                key="Ticks" data-grid={{ w: 12, h: 8, x: 0, y: 25, autoSize: true,}}>
                <Ticks/>
            </div>
            {this.props.instruments.map((i, ix) => (
                <div style={{width:'100%', fontSize: '10px',border:'1px solid black',}} 
                    key={i.symbol} data-grid={{ w: 3, h: 8, x: 3*(ix+1), y: 0,  autoSize: true,  }}>
                    <DepthLadder symbol={i.symbol} name={i.name}></DepthLadder>
                </div>
            )) }
                
        </ReactGridLayout>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState) => ({
    username: state.ws.hello.username,
    instruments: state.exchange.instruments,
});
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
      ls = JSON.parse(global.localStorage.getItem("rgl-7")) || {};
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
