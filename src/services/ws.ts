
import { RootAction } from 'MyTypes';
import { wsReceive } from '../features/ws/actions';
import { Dispatch } from 'redux';
//export const init = get_

export const ws = (function () {
    let ws: WebSocket;
    let connected: boolean = false;
    let myDispatch : Dispatch<RootAction>

    const init = (dispatch: Dispatch<RootAction>) => {
        const jwt = localStorage.getItem('idToken')
        myDispatch = dispatch
        //const username = jwt ? `${jwt}@` : ""
        if (!jwt) {
            console.error(`Cannot connect to WS server without a token`)
        }

        if (ws) {ws.close()}
        console.log(`Connecting to websocket jwt:${jwt}`);
        ws = new WebSocket(
            `${process.env.REACT_APP_WS_SERVER_URL}?token=${jwt}`);
        //ws = new WebSocket(`ws://${process.env.REACT_APP_WS_SERVER_URL}`)
        ws.onopen = function (evt: Event) {
            console.log(`WS Opened : ${JSON.stringify(evt)}`)
            connected = true
            ws.onclose = function (evt: CloseEvent) {
                const json = evt;
                console.log(`WS Closed: ${JSON.stringify(json)}`);
                dispatch(wsReceive({_type: 'Close', message: 'WS closed:' + JSON.stringify(json)}))
                connected = false
            }
            ws.onmessage = (evt: MessageEvent) => {
                const json = JSON.parse(evt.data);
                console.log(`Received data: ${JSON.stringify(json)}`);
                dispatch(wsReceive(json))
            }
            ws.onerror = function (evt: Event) {
                const json = evt;
                console.log(`Received WS Error: ${JSON.stringify(json)}`);
                dispatch(wsReceive({_type: 'Error', message: 'WS error:' + JSON.stringify(json)}))
            }
        }
    };

    function send(data: object) {
        console.log(`Seding WS : ${JSON.stringify(data)}`)
        if (! connected && myDispatch) {
            // Reconnect
            console.log(`Reconnecting WS`)
            init(myDispatch)
        } else {
            ws.send(JSON.stringify(data))
        }
    };

    return {init, send}   
}())