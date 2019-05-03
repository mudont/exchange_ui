import * as React from 'react';
import { Ladder } from 'MyModels';
import { connect } from 'react-redux';
import { RootState, OrderFormValues } from 'MyTypes';
import { setCurrOrder } from '../actions';

type Props = {
    symbol: string,
    ladder: Ladder,
    currOrder: OrderFormValues,
    handleClick: typeof setCurrOrder,
}

const fmtNum = (n: number): string => {
    if (n === 0) {
        return ""
    } else { 
        return (n+"")
    }
} 


const DepthLadder: React.FC<Props> = props => {
    const {symbol, ladder, handleClick, currOrder} = props
    return (
    <div
        style={{
            height:"100%", overflow: "hidden",
            // display:"flex", flexDirection: "column",
            }}>
        <label style={{fontWeight: 'bold'}}> {symbol}</label> <br></br>
        <div style={{overflowX:'hidden', height:'100%', width:'118%'}}> 
        <table style={{width: "100%", height: "100%", overflowX:'hidden'}}>
            <colgroup>
            <col style={{backgroundColor:"palegreen", width:"40%",}}/>
            <col style={{backgroundColor:"white", width:"20%"}}/>
            <col style={{backgroundColor:"salmon", textAlign:"right", width:"40%"}}/>
            </colgroup>
            <tbody>
            {ladder.map((item, ix) => (
                <tr key={ix} style={{height: "10px", fontSize: "9px"}}> 
                    <td style={{textAlign:"right",}}>
                        <button onClick={() => {
                            console.log(`Buy @ ${item[1]} clicked`)
                            return handleClick({
                                symbol: symbol,
                                is_buy: true,
                                quantity: currOrder.quantity,
                                limit_price: item[1],
                                max_show_size: currOrder.max_show_size,
                            })
                        }}
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
                    <button onClick={() => {
                            console.log(`Sell @ ${item[1]} clicked`);
                            return handleClick({
                                symbol: symbol,
                                is_buy: false,
                                quantity: currOrder.quantity,
                                limit_price: item[1],
                                max_show_size: currOrder.max_show_size,
                            })}}
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
const mapStateToProps = (state: RootState, ownProps: {symbol:string}) => ({
    ladder: state.ws.depth[ownProps.symbol],
    currOrder: state.exchange.currOrder,
});
const dispatchProps = {handleClick: setCurrOrder};

export default connect(mapStateToProps, dispatchProps)(DepthLadder);