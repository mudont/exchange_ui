import * as React from 'react';
import { MyPosition, RootState } from 'MyTypes';
import { connect } from 'react-redux'
import ReactTable from 'react-table'
//import 'react-table/react-table.css'

const RA: React.FC<{children: any}> = ({children}) => {
    return (<div style={{ textAlign: "right"}}> {children}</div>)
}

type Props = {
    my_positions: ReadonlyMap<string,MyPosition>,
}
const Tbl: React.FC<Props> = (props) => {
    const data = Object.values(props.my_positions)
    const columns = [{
      Header: 'Symbol',
      width:100,
      accessor: 'symbol' // String-based value accessors!
     }, {
      id: 'price', // Required because our accessor is not a string
      Header: <RA>Price</RA>,
      width: 40,
      accessor: (d: MyPosition) => d.price.toFixed(2) // Custom value accessors!
    }, {
      Header: () => <RA>Pos</RA>, // Custom header components!
      accessor: 'position',
      width: 40,
      Cell: (props:{value:number}) => <RA>{props.value.toFixed(2) }</RA>
    }, {
        Header: () => <RA>Cost</RA>, 
        width: 50,
        accessor: 'cost_basis',
        Cell: (props:{value:number}) => <RA>{props.value.toFixed(2) }</RA>
    }, {
        Header: <RA>MktVal</RA>,
        width:50,
        Cell: (props:{value:number}) => <RA>{props.value.toFixed(2) }</RA>,
        accessor: 'mkt_val',
    }, {
        Header: () => <RA>P&L</RA>, // Custom header components!
        accessor: 'pnl',
        width: 50,
        Cell: (props:{value:number}) => <RA>{props.value.toFixed(2) }</RA>
    }, {
        Header: () => <RA>CrshRsk</RA>, // Custom header components!
        accessor: 'crash_risk',
        width: 50,
        Cell: (props:{value:number}) => <RA>{props.value.toFixed(2) }</RA>
   }]
  //style={{width: "100%", height: "100%", overflowX:'hidden', overflowY:'scroll'}}
    return <ReactTable className='-striped' style={{fontSize: '10px'}}
        filterable
        data={data as any}
      columns={columns}
    />
  }
  const buyColor = '#cefdce'
  //const sellColor = '#fdd3ce'
  
const MyPositions: React.FC<Props> = props => {
    const {my_positions} = props    
    return (
    <div
        style={{
            height:"100%", overflow: "hidden",
            // display:"flex", flexDirection: "column",
            }}>
        <div className="dragHandle" style={{fontWeight: 'bold', backgroundColor:buyColor, width:'100%'}}>
            My Positions
        </div>
        <div style={{overflowX:'hidden', height:'100%', width:'100%'}}> 
        <Tbl my_positions={my_positions}/>

        </div>
    </div>
    )
}
const mapStateToProps = (state: RootState,) => ({
    my_positions: state.ws.my_positions,
});
const dispatchProps = {};

export default connect(mapStateToProps, dispatchProps)(MyPositions);
