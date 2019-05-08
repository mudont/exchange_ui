## Bug
  - [x] crash pnl is wrong
  - [x] My Orders have no buy/sell
  - [x] Order quantity should not be changed when clicking on depth ladder

## Joshua comments
  - [x] Login should be more convenient
  - [n] Checkbox to show Odds rather than Probabilities
  - [n] Table row height should stay fixed on expand
  - [?] Order expiration options. Eg: expire orders a beginning of event
  - [ ] Wants to show the Help page first time, then have a Don't show again flag


## UI features
  - [ ] Credit Limit Check
  - [x] Leaderboard: Top p&l, volume trading, market making
  - [ ] Self match prevention
  - [?] Help text below the order dialog
  - [ ] Errors should be shown to users
  - [x] my orders
  - my trades
  - [x] Generic Feed Window
  - Top bar:
    - [x] name
    - [ ] pic?
    - [x] login/logout
    - [x] WebSocket state
    - [x] WS connect
  - [x] instruments
  - [x] my positons/pnl
  - [x] depth quotes for subscribed instruments
  - [.] prettify with CSS etc.
  - [ ] Create/Manage groups and instruments for private instruments

- [x] Order commands by API or WebSocket

- [x] Order form 

## Infra

### Server infra
- [x] Create SocialAccount, Org/Acc in all authentication paths
  [ ] It is there for WebSocket token auth, but not for awani.org auth0 nor for password login
- [x] How to send messages to specific clients. one way is
  is to have consumers filter out messages not meant for them
  But that could be slow. 
- [ ] Permanent tokens so that API users can submit orders
- [?] Subscriptions. This [GraphQL/Channels based lib ](https://github.com/eamigo86/graphene-django-subscriptions) may be interesting
  + Consumer class attribute groups looks relevant

### UI infra

- [x] WS connect should happen after authentication
- [x] Instrument subscription
- [x] Deploy as static files? 
- [x] REST API client

- [.] Redux state for everything

  - [ ] UI
  - [ ] Auth
  - [x] Initial WS connection should hydrate the store with data before push kicks in
  - [.] Subscriptions

- [ ] Use Toolbox pattern to add depth ladders and Orders/Trades/Positions. Add and close windows.
- [x] React Autosuggest plus fuzzyset.js  for finding instruments
- [x] Formik Forms
