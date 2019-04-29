import React from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import DepthLadder from './DepthLadder';
import FlexRow from '../../../components/FlexRow';
import { connect } from 'react-redux';
import { RootState } from 'MyTypes';

const ReactGridLayout = WidthProvider(RGL);
const originalLayout = getFromLS("layout") || [];
interface MyProps {
    onLayoutChange: any,
    username: string,
 }
/**
 * This layout demonstrates how to sync to localstorage.
 */
class LocalStorageLayout_ extends React.PureComponent<MyProps,{layout:Layout[]}> {
  static defaultProps = {
    className: "layout",
    username: 'unknown',
    cols: 12,
    rowHeight: 30,
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
    return (
      <div>
        <FlexRow>
            <label>Hello {this.props.username}</label>
        </FlexRow>
        <ReactGridLayout
          {...this.props}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
        >
          <div style={{backgroundColor: 'skyblue', width:'100%', fontSize: '10px'}} 
                key="Order" data-grid={{ w: 2, h: 3, x: 0, y: 0, static: true, autoSize: true,}}>
                <span className="text">Order</span>
          </div>
          <div style={{width:'100%', fontSize: '10px',}} 
               key="IndPakWC19" data-grid={{ w: 1, h: 10, x: 2, y: 0,  autoSize: true,  }}>
            <DepthLadder symbol='IndPakWC19'></DepthLadder>
          </div>
          <div style={{width:'100%', fontSize: '10px',}} 
               key="IndWChamp19" data-grid={{ w: 1, h: 10, x: 4, y: 0, autoSize: true, }}>
            <DepthLadder symbol='IndWChamp19'></DepthLadder>
          </div>
          <div style={{backgroundColor: 'DarkOrange', width:'100%'}} 
               key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0, autoSize: true, }}>
            <span className="text">4</span>
          </div>
          <div style={{backgroundColor: 'DarkSlateBlue', width:'100%'}} 
               key="5" data-grid={{ w: 2, h: 3, x: 8, y: 0, autoSize: true, }}>
            <span className="text">5</span>
          </div>
        </ReactGridLayout>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState) => ({username: state.ws.hello.username});
const dispatchProps = {};

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
