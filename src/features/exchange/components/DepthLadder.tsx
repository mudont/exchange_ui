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
    <div>
        <label> {symbol}</label> <br></br>
        <table>
            <colgroup>
            <col style={{backgroundColor:"palegreen", width:"50px",}}/>
            <col style={{backgroundColor:"white", width:"50px"}}/>
            <col style={{backgroundColor:"salmon", textAlign:"right", width:"50px"}}/>
            </colgroup>
            <tbody>
            {ladder.map((item, ix) => (
                <tr key={ix}> 
                    <td style={{textAlign:"right",}}>{fmtNum(item[0])}</td>
                    <td style={{textAlign:"right",}}> {fmtNum(item[1])}</td>
                    <td style={{textAlign:"right",}}>{fmtNum(item[2])}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    )
}
const mapStateToProps = (state: RootState) => ({depth: state.ws.depth});
const dispatchProps = {};

export default connect(mapStateToProps, dispatchProps)(DepthLadder);