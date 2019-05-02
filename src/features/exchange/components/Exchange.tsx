import React from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import DepthLadder from './DepthLadder';
import FlexRow from '../../../components/FlexRow';
import { connect } from 'react-redux';
import { RootState } from 'MyTypes';
import Auth from '../../../services/auth0-service';
import { Instrument } from 'MyModels';

const ReactGridLayout = WidthProvider(RGL);
const originalLayout = getFromLS("layout") || [];
interface MyProps {
    onLayoutChange: any,
    username: string,
    auth: Auth,
    instruments: Instrument[],
 }
/**
 * This layout demonstrates how to sync to localstorage.
 */
class LocalStorageLayout_ extends React.PureComponent<MyProps,{layout:Layout[]}> {
  static defaultProps = {
    className: "layout",
    username: 'unknown',
    instruments: [],
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
    const { isAuthenticated } = this.props.auth;
    return (
        <div>
            <FlexRow>
            <div className="container">
            {
            isAuthenticated() && (
                <h4>
                    Hello {this.props.username}
                    <button style={{ cursor: 'pointer' }}
                        onClick={this.props.auth.logout.bind(this.props.auth)}>
                    Log Out
                    </button>
                </h4>
                )
            }
            {
            !isAuthenticated() && (
                <h4>
                    You are not logged in! Please{' '}
                    <button style={{ cursor: 'pointer' }}
                    onClick={this.props.auth.login.bind(this.props.auth)}>
                    Log In
                    </button>
                    {' '}to continue.
                </h4>
                )
            }
        </div>

            
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
          {this.props.instruments.map((i, ix) => (
              <div style={{width:'100%', fontSize: '10px',}} 
                key={i.symbol} data-grid={{ w: 1, h: 10, x: 2*(ix+1), y: 0,  autoSize: true,  }}>
                <DepthLadder symbol={i.symbol}></DepthLadder>
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
