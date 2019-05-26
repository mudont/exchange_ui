import * as React from 'react'

import { LeaderBoard, RootState } from 'MyTypes';
import { connect } from 'react-redux'
import ReactTable from 'react-table'
//import 'react-table/react-table.css'

const RA: React.FC<{children: any}> = ({children}) => {
    return (<div style={{ textAlign: "right"}}> {children}</div>)
}

type Props = {
    leaderboardData: ReadonlyArray<LeaderBoard>,
}
const Tbl: React.FC<Props> = (props) => {
    const data = Object.values(props.leaderboardData)
    const columns = [{
        id: 'rank', // Required because our accessor is not a string
        Header: <RA>Rank</RA>,
        width: 40,
        Cell: (props:{value:number}) => <RA>{props.value}</RA>,
        accessor: (d: LeaderBoard) => d.rank // Custom value accessors!
       }, {
      Header: 'User',
      width:100,
      accessor: 'username' // String-based value accessors!
     }, {
      id: 'pnl', // Required because our accessor is not a string
      Header: <RA>P&L</RA>,
      width: 100,
      Cell: (props:{value:number}) => <RA>{props.value}</RA>,
      accessor: (d: LeaderBoard) => d.pnl.toFixed(2) // Custom value accessors!
     }, {
      Header: () => <RA>Crash Risk</RA>, // Custom header components!
      accessor: 'crash_pnl',
      width: 100,
      Cell: (props:{value:number}) => <RA>{props.value.toFixed(2)}</RA>
     },
    ]
  //style={{width: "100%", height: "100%", overflowX:'hidden', overflowY:'scroll'}}
    return <ReactTable className='-striped' style={{fontSize: '12px'}}
      filterable
      data={data as any}
      columns={columns}
    />
  }
  const buyColor = '#cefdce'
  //const sellColor = '#fdd3ce'
  
const Leaderboard: React.FC<Props> = props => {
    const {leaderboardData} = props    
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
        <Tbl leaderboardData={leaderboardData}/>

        </div>
    </div>
    )
}
const mapStateToProps = (state: RootState,) => ({
    leaderboardData: state.ws.leaderboard.data,
});
const dispatchProps = {};

export default connect(mapStateToProps, dispatchProps)(Leaderboard);