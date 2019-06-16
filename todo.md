## Bug
- [ ] ladder layout in last column . should use real estate better
- [ ] toasts should get logged to a window
## Features
- Instrument Table
  * [ ] Volume, Open Interest, last price, up/down arrow
  + [ ] show position? Maybe overkill
- User prefs
  + [ ] units probabilities or odds (only if price unit is %prob)
  + [ ] nickname
- [ ] Don't sucbsribe any symbols by default. Show depth ladder for all subscribed symbols
- [ ] back up database regularly and save it somewhere
- [ ] "settle" instruments that expire
- [ ] standard way of copying production db to development machine

  - [ ] Self match prevention
  - [ ] Private Groups
  - [?] Help text below the order dialog
  - my trades
  - Top bar:
    - [ ] pic?
  - [.] prettify with CSS etc.
  - [ ] Create/Manage groups and instruments for private instruments

### Server infra

- [ ] FusionAuth self hosted opensource authentication/authorization solution
  [ ] It is there for WebSocket token auth, but not for awani.org auth0 nor for password login
- [ ] Permanent tokens so that API users can submit orders
- [?] Subscriptions. This [GraphQL/Channels based lib ](https://github.com/eamigo86/graphene-django-subscriptions) may be interesting
  + Consumer class attribute groups looks relevant

### UI infra

- [ ] Jest/Enzyme tests 
- [.] Redux state for everything

  - [ ] UI
  - [ ] Auth
  - [.] Subscriptions

- [ ] Use Toolbox pattern to add depth ladders and Orders/Trades/Positions. Add and close windows.

## Joshua comments
  - [?] Order expiration options. Eg: expire orders a beginning of event
  - [ ] Wants to show the Help page first time, then have a Don't show again flag
