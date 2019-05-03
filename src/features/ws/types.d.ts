declare module 'MyModels' {
    export type Hello = {
        _type: 'Hello';
        username: string;
    }
    export type Instrument = {
        _type: 'Instrument';
        symbol: string;
        name: string;
    };
    export type Order = {
        _type: 'Order';
        ts: string;
        symbol: string;
        account: string;
        trader: string;
        begin_time: string;
        is_buy: boolean;
        quantity: number;
        limit_price: number;
        max_show_size: number;
        filled_quantity: number;
        status: string;
    };
    export type Trade = {
        _type: 'Trade';
        ts: string;
        symbol: string;
        quantity: string;
        price: string;
        bs: string;
    }
    export type LadderItem = [number, number, number]
    export type Ladder = LadderItem[] 
    export interface Depth {
        [symbol: string]: Ladder
    }
    export type WsObject = Hello | Instrument | Order | Trade | Depth;
  }
  