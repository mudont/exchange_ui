## Infra

### Server infra

- How to send messages to specific clients. one way is
  is to have consumers filter out messages not meant for them
  But that could be slow. 
- Permanent tokens so that API users can submit orders
- Subscriptions. This [GraphQL/Channels based lib ](https://github.com/eamigo86/graphene-django-subscriptions) may be interesting
  + Consumer class attribute groups looks relevant

### UI infra

- REST API client

- Redux state for everything

  - UI
  - Auth
  - Initial WS connection should hydrate the store with data before      push kicks in
  - Subscriptions
  - Use Toolbox pattern to add depth ladders and Orders/Trades/Positions. Add and close windows.
  

## UI features

  - instruments
  - my orders
  - my trades
  - my positons/pnl
  - depth quotes for subscribed instruments
  - Leaderboard: Top p&l, volume trading, market making
  - prettify with CSS etc.
  - Create/Manage groups and instruments for private instruments

- Order commands by API or WebSocket

- Order form 
- Trades

- Need UI state in Redux

