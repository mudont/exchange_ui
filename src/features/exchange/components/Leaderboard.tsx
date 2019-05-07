import * as React from 'react'

import { LeaderBoard, RootState } from 'MyTypes';
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const RA: React.FC<{children: any}> = ({children}) => {
    return (<div style={{ textAlign: "right"}}> {children}</div>)
}

type Props = {
    leaderboard: ReadonlyArray<LeaderBoard>,
}
const Tbl: React.FC<Props> = (props) => {
    const data = Object.values(props.leaderboard)
    const columns = [{
        id: 'rank', // Required because our accessor is not a string
        Header: <RA>Rank</RA>,
        width: 30,
        Cell: (props:{value:number}) => <RA>{props.value}</RA>,
        accessor: (d: LeaderBoard) => d.rank // Custom value accessors!
       }, {
      Header: 'User',
      width:100,
      accessor: 'username' // String-based value accessors!
     }, {
      id: 'pnl', // Required because our accessor is not a string
      Header: <RA>P&L</RA>,
      width: 75,
      Cell: (props:{value:number}) => <RA>{props.value}</RA>,
      accessor: (d: LeaderBoard) => d.pnl // Custom value accessors!
     }, {
      Header: () => <RA>Crash Risk</RA>, // Custom header components!
      accessor: 'crash_pnl',
      width: 75,
      Cell: (props:{value:number}) => <RA>{props.value}</RA>
     },
    ]
  //style={{width: "100%", height: "100%", overflowX:'hidden', overflowY:'scroll'}}
    return <ReactTable style={{fontSize: '10px'}}
      data={data as any}
      columns={columns}
    />
  }
  const buyColor = '#cefdce'
  //const sellColor = '#fdd3ce'
  
const Leaderboard: React.FC<Props> = props => {
    const {leaderboard} = props    
    return (
    <div
        style={{
            height:"100%", overflow: "hidden",
            // display:"flex", flexDirection: "column",
            }}>
        <div style={{backgroundColor:buyColor, width:'100%'}}>
            <label style={{fontWeight: 'bold'}}> Leaderboard</label>
        </div>
        <div style={{overflowX:'hidden', height:'100%', width:'100%'}}> 
        <Tbl leaderboard={leaderboard}/>

        </div>
    </div>
    )
}
const mapStateToProps = (state: RootState,) => ({
    leaderboard: state.ws.leaderboard,
});
const dispatchProps = {};

export default connect(mapStateToProps, dispatchProps)(Leaderboard);