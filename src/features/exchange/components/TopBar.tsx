import Auth from '../../../services/auth0-service';
import FlexRow from '../../../components/FlexRow';
import React from 'react'
import { wsSend } from '../../ws/actions';
import {connect} from 'react-redux'
import logo from '../../../assets/ICCWC.png'
type Props = {
    isAuthenticated: () => boolean,
    username: string,
    credit_limit: number,
    connected: boolean,
    auth: Auth,
    reconnect: typeof wsSend,
}
const TopBar: React.FC<Props> = (props) => {
    const {isAuthenticated, username, credit_limit, connected, auth, reconnect} = props
    const bg = (isAuthenticated() && username !== 'nobody')? 'lightsteelblue' : 'red'
    return (<FlexRow style={{backgroundColor: bg}}>
        <img src={logo}  alt="logo" width="25" height="35"/>
        <div className="container">
        {
        isAuthenticated() && (
            <div>
                {username !== 'nobody' && (`Hello ${username}. Your credit limit is ${(credit_limit||0).toFixed(2)}`)}
                <button style={{ cursor: 'pointer' }}
                    onClick={auth.logout.bind(auth)}>
                Log Out
                </button>
            </div>
            )
        }
        {
        !isAuthenticated() && (
            <span>
                You are not logged in! Please{' '}
                <button style={{ cursor: 'pointer' }}
                onClick={auth.login.bind(auth)}>
                Log In
                </button>
                {' '}to continue.
           </span>
            )
        }
        {
            !connected && (
                <button style={{ cursor: 'pointer' }}
                onClick={() => {return reconnect({command:'Hello'})}}>
                Reconnect
                </button>               
            )
        }
        </div>
    </FlexRow>)
}
const mapStateToProps = () => ({
});
const dispatchProps = {
    reconnect: wsSend
};

export default connect(mapStateToProps, dispatchProps)(TopBar);
