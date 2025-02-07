import * as React from 'react';
import { Ladder } from 'MyModels';
import { connect } from 'react-redux';
import { RootState, OrderFormValues } from 'MyTypes';
import { setCurrOrder } from '../actions';
import ReactTooltip from 'react-tooltip'
import { unsubscribeSymbol } from '../../ws/actions';

type Props = {
    symbol: string,
    name: string,
    ladder: Ladder,
    currOrder: OrderFormValues,
    handleClick: typeof setCurrOrder,
    unsubscribeSymbol: typeof unsubscribeSymbol,
}

const fmtNum = (n: number): string => {
    if (n === 0) {
        return ""
    } else {
        return (n + "")
    }
}

const buyColor = '#cefdce'
const sellColor = '#fdd3ce'
const DepthLadder: React.FC<Props> = props => {
    const { symbol, name, ladder, handleClick, currOrder, unsubscribeSymbol } = props
    const robustLadder: Ladder = ladder || []
    return (
        <div
            style={{
                height: "100%", overflow: "hidden",
                // display:"flex", flexDirection: "column",
            }}>
            <ReactTooltip />
            <div style={{ position: 'relative' }}>
                <label style={{ fontWeight: 'bold', float: 'left', }} data-tip={name}> {symbol}</label>
                <span style={{ float: 'right', color: 'red', cursor: 'pointer' }} onClick={() => unsubscribeSymbol(symbol)}> X</span>
            </div>
            <br></br>
            <div style={{ overflowX: 'hidden', height: '100%', width: '110%' }}>
                <table style={{ width: "100%", height: "100%", overflowX: 'hidden', borderSpacing: 1 }}>
                    <colgroup>
                        <col style={{ backgroundColor: buyColor, width: "40%", }} />
                        <col style={{ backgroundColor: "white", width: "20%" }} />
                        <col style={{ backgroundColor: sellColor, textAlign: "right", width: "40%" }} />
                    </colgroup>
                    <tbody>
                        {robustLadder.map((item, ix) => (
                            <tr key={ix} style={{ height: "10px", fontSize: "9px" }}>
                                <td style={{ textAlign: "right", }}>
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
                                            height: '12px', width: '100%', backgroundColor: buyColor, border: "0",
                                            fontSize: "10px",
                                            borderRadius: "0px"
                                            // position: "absolute",
                                            // right: "0",
                                            // top: "0",
                                            // borderTopLeftRadius: "0",
                                            // borderBottomLeftRadius: "0",
                                            // borderBottomRightRadius: "0",
                                        }}
                                    >{fmtNum(item[0])}</button>
                                </td>
                                <td style={{ textAlign: "right", }}> {fmtNum(item[1])}</td>
                                <td
                                    style={{ textAlign: "right", }}
                                    onClick={() => { console.log(`Sell clicked`) }}
                                >
                                    <button onClick={() => {
                                        console.log(`Sell @ ${item[1]} clicked`);
                                        return handleClick({
                                            symbol: symbol,
                                            is_buy: false,
                                            quantity: currOrder.quantity,
                                            limit_price: item[1],
                                            max_show_size: currOrder.max_show_size,
                                        })
                                    }}
                                        style={{
                                            height: '12px', width: '100%', backgroundColor: sellColor, border: "0",
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
const mapStateToProps = (state: RootState, ownProps: { symbol: string }) => {
    //console.log('mstp depth')
    return ({
        ladder: state.ws.depth[ownProps.symbol],
        currOrder: state.exchange.currOrder,
    })
};
const dispatchProps = {
    handleClick: setCurrOrder,
    unsubscribeSymbol: unsubscribeSymbol,
};

export default connect(mapStateToProps, dispatchProps)(DepthLadder);