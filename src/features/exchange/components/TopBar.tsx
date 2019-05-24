import Auth from '../../../services/auth0-service';
import FlexRow from '../../../components/FlexRow';
import React from 'react'
import { wsSend } from '../../ws/actions';
import { connect } from 'react-redux'
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
    const { isAuthenticated, username, connected, auth, reconnect } = props
    const bg = (connected && username !== 'nobody') ? 'lightsteelblue' : 'red'
    return (<FlexRow style={{ backgroundColor: bg }}>
        <img src={logo} alt="logo" width="25" height="35" />
        <div className="container">
            {
                connected && (
                    <span>
                        {username !== 'nobody' && (`Hi ${username}. ${process.env.REACT_APP_TOP_MESSAGE} `)}
                        <button style={{ cursor: 'pointer' }}
                            onClick={auth.logout.bind(auth)}>
                            Log Out
                </button>
                    </span>
                )
            }
            {
                (!isAuthenticated()) && (
                    <span>
                        {' '} No currently Valid Token
                <button style={{ cursor: 'pointer' }}
                            onClick={auth.login.bind(auth)}>
                            Get Token
                </button>
                    </span>
                )
            }
            {
                isAuthenticated() && !connected && (
                    <span>
                        You have a token but don't appear to be connected. {' '}
                        <button style={{ cursor: 'pointer' }}
                            onClick={() => { return reconnect({ command: 'Hello' }) }}>
                            Reconnect
                </button>
                        {' '} to Server
              </span>
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
