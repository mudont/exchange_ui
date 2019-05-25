import * as React from 'react';
import { MyOrder, RootState } from 'MyTypes';
import { connect } from 'react-redux'
import ReactTable from 'react-table'
//import 'react-table/react-table.css'
import { wsSend } from '../../ws/actions';

type Props = {
  my_orders: ReadonlyMap<number, MyOrder>,
  wsSend: typeof wsSend,
}
const RA: React.FC<{ children: any }> = ({ children }) => {
  return (<div style={{ textAlign: "right" }}> {children}</div>)
}
const Tbl: React.FC<Props> = (props) => {
  const { wsSend } = props
  const data = Object.values(props.my_orders).filter(o => o.status !== 'CANCELED')
  const columns = [{
    Header: () => <RA> Id </RA>,
    accessor: 'id',
    Cell: (props: { value: number }) => <RA>{props.value}</RA>,
    width: 35,
  }, {
    Header: 'Event',
    accessor: 'symbol',
    width: 100,
  }, {
    id: 'limit_price', // Required because our accessor is not a string
    Header: () => <RA> Price </RA>,
    width: 40,
    Cell: (props: { value: number }) => <RA>{props.value}</RA>,
    accessor: (d: MyOrder) => d.limit_price // Custom value accessors!
  }, {
    Header: () => <RA> Qty </RA>, // Custom header components!
    accessor: 'quantity',
    width: 40,
    Cell: (props: { value: number }) => <RA>{props.value}</RA>
  }, {
    Header: () => 'B/S', // Custom header components!
    accessor: 'is_buy',
    width: 35,
    Cell: (props: { value: boolean }) => <div>{props.value ? 'BUY' : 'SELL'}</div>
  }, {
    Header: () => <RA>Fills</RA>, // Custom header components!
    accessor: 'filled_quantity',
    width: 40,
    Cell: (props: { value: number }) => <RA>{props.value}</RA>
  }, {
    Header: 'Cancel',
    width: 50,
    accessor: 'status',

    Cell: (props: { row: MyOrder, value: string }) => <div>
      {
        props.row.status === 'WORKING' ?
          <button onClick={() => wsSend({ command: 'cancel', id: props.row.id })}
            style={{ backgroundColor: 'red', fontSize: 12, padding: "0px 2px" }}>
            Cancel
            </button>
          : <span className='number'>{props.value}</span>
      }

    </div>
  }, {
    Header: () => <RA>Show</RA>, // Custom header components!
    accessor: 'max_show_size',
    width: 50,
    Cell: (props: { value: number }) => <RA>{props.value}</RA>
  }]
  //style={{width: "100%", height: "100%", overflowX:'hidden', overflowY:'scroll'}}
  return <ReactTable style={{ fontSize: '10px' }}
    data={data as any}
    columns={columns}
  />
}

const MyOrders: React.FC<Props> = props => {
  const { my_orders, wsSend } = props

  //console.log("DBG Myorders", JSON.stringify(Object.values(my_orders), null, 4))

  //.map((order) => console.log(`entry ord:${order}`))

  return (
    <div
      style={{
        height: "100%", overflow: "hidden",
        // display:"flex", flexDirection: "column",
      }}>
      <div className="dragHandle" style={{ backgroundColor: 'lightyellow', width: '100%' }}><label style={{ fontWeight: 'bold' }}>
        My Acitve Orders</label>
      </div>
      <div style={{ overflowX: 'hidden', height: '100%', width: '100%' }}>
        <Tbl my_orders={my_orders} wsSend={wsSend} />
      </div>
    </div>
  )
}
const mapStateToProps = (state: RootState, ) => ({
  my_orders: state.ws.my_orders,
});
const dispatchProps = {
  wsSend: wsSend,
};

export default connect(mapStateToProps, dispatchProps)(MyOrders);
