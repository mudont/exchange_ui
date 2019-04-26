
import { Dispatch } from 'redux';
import { RootAction } from 'MyTypes';
import { wsReceive } from '../features/ws/actions';
//export const init = get_


export default function () {
    let ws: WebSocket;
    function init(dispatch: Dispatch<RootAction>): void {
        const jwt = localStorage.getItem('idToken')
        //const username = jwt ? `${jwt}@` : ""
        console.log(`Connecting to websocket jwt:${jwt}`);
        // ws = new WebSocket(
        //     `ws://${process.env.REACT_APP_WS_SERVER_URL}?token=${jwt}`,
        //     jwt||"");
        ws = new WebSocket(`ws://${process.env.REACT_APP_WS_SERVER_URL}`)
        ws.onopen = function (event: Event) {
            console.log(`WS Opened : ${JSON.stringify(event)}`)
        }
        ws.onmessage = (evt: MessageEvent) => {
            const json = JSON.parse(evt.data);
            console.log(`Received data: ${JSON.stringify(json)}`);
            dispatch(wsReceive(json))
        };
    };
    function send(data: object) {
        console.log(`Seding WS : ${JSON.stringify(data)}`)
        ws.send(JSON.stringify(data))
    };

    return {init, send}   
}