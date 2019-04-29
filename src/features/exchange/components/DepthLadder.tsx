import * as React from 'react';
import { Depth } from 'MyModels';
import { connect } from 'react-redux';
import { RootState } from 'MyTypes';

type Props = {
    symbol: string,
    depth: Depth
}

const fmtNum = (n: number): string => {
    if (n === 0) {
        return ""
    } else { 
        return (n+"")
    }
} 


const DepthLadder: React.FC<Props> = props => {
    const {symbol, depth} = props
    const ladder = depth[symbol] || [];
    return (
    <div
        style={{
            height:"100%", width: "100%", overflow: "hidden",
            // display:"flex", flexDirection: "column",
            }}>
        <label style={{fontWeight: 'bold'}}> {symbol}</label> <br></br>
        <div>
        <table style={{width: "100%", height: "100%",}}>
            <colgroup>
            <col style={{backgroundColor:"palegreen", width:"40%",}}/>
            <col style={{backgroundColor:"white", width:"20%"}}/>
            <col style={{backgroundColor:"salmon", textAlign:"right", width:"40%"}}/>
            </colgroup>
            <tbody>
            {ladder.map((item, ix) => (
                <tr key={ix} style={{height: "12px", fontSize: "10px"}}> 
                    <td style={{textAlign:"right",}}>
                        <button onClick={() => {console.log(`Buy @ ${item[1]} clicked`)}}
                            style={{
                                height: '12px', width:'100%', backgroundColor:"palegreen",border:"0",
                                fontSize: "10px",
                                // position: "absolute",
                                // right: "0",
                                // top: "0",
                                // borderTopLeftRadius: "0",
                                // borderBottomLeftRadius: "0",
                                // borderBottomRightRadius: "0",
                            }}
                        >{fmtNum(item[0])}</button>
                    </td>
                    <td style={{textAlign:"right",}}> {fmtNum(item[1])}</td>
                    <td
                        style={{textAlign:"right",}}
                        onClick={() => {console.log(`Sell clicked`)}}
                    >
                    <button onClick={() => {console.log(`Sell @ ${item[1]} clicked`)}}
                        style={{height: '12px', width:'100%', backgroundColor:"salmon",border:"0",
                        fontSize: "10px"
                    }}
                    >{fmtNum(item[2])} </button> </td>
                </tr>
            ))}
            </tbody>
        </table></div>
    </div>
    )
}
const mapStateToProps = (state: RootState) => ({depth: state.ws.depth});
const dispatchProps = {};

export default connect(mapStateToProps, dispatchProps)(DepthLadder);