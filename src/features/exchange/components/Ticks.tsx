import * as React from 'react';
import { RootState } from 'MyTypes';
import { Trade } from 'MyModels'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

type Props = {
    trades: ReadonlyArray<Trade>,
}
const Tbl: React.FC<Props> = (props) => {
    const data = Object.values(props.trades)
    const columns = [{
        Header: 'Ts',
        accessor: 'ts', 
        width: 150,
     }, {
      Header: 'Event',
      accessor: 'symbol', 
      width: 125,
     }, {
      id: 'price', 
      Header: 'Price',
      width: 50,
      accessor: (d: Trade) => d.price 
    }, {
      Header: () => <span>Qty</span>, // Custom header components!
      accessor: 'quantity',
      width: 50,
      Cell: (props:{value:number}) => <span className='number'>{props.value}</span>
    }, {
        Header: () => <span>B/S</span>, // Custom header components!
        accessor: 'is_buy',
        width: 30,
        Cell: (props:{value:boolean}) => <span className='number'>{props.value?'Buy':'Sell'}</span>
    }]
  //style={{width: "100%", height: "100%", overflowX:'hidden', overflowY:'scroll'}}
    return <ReactTable style={{fontSize: '10px'}}
      data={data as any}
      columns={columns}
    />
  }
  //const buyColor = '#cefdce'
  //const sellColor = '#fdd3ce'
  
const Ticks: React.FC<Props> = props => {
    const {trades} = props    
    return (
    <div
        style={{
            height:"100%", overflow: "hidden",
            // display:"flex", flexDirection: "column",
            }}>
        <div style={{backgroundColor:'paleturquoise', width:'100%'}}>
            <label style={{fontWeight: 'bold'}}> Transactions since I connected, including mine</label>
        </div>
        <div style={{overflowX:'hidden', height:'100%', width:'100%'}}> 
        <Tbl trades={trades}/>

        </div>
    </div>
    )
}
const mapStateToProps = (state: RootState,) => ({
    trades: state.ws.trades,
});
const dispatchProps = {};

export default connect(mapStateToProps, dispatchProps)(Ticks);
