import * as React from 'react'
const ReactMarkdown = require('react-markdown/with-html')

const markdown = `
# Bet on Cricket World Cup for fun

## Login/Connect

There is no password or registration, but the site does require you to authenticate with
a social account such as Google, Facebook or LinkedIn.

Anytme you see a <span style="background-color:red;">red bar the the top</span>, it means you need to login and/or connect.
If you click the login/connect buttons as suggested you should get in. If that doesn't work, 
the site is probably down.

## The Concept

There are two types of things you can trade.

### 1. Binary Events

Binary events settle at a price of 0 (if the event doesn't happen) or 100 (if the event does happen).
This type of contracts were first made popular by the now defunct [InTrade](https://en.wikipedia.org/wiki/Intrade)

For example, there is an event with symbol 'Ind > Pak' with the description 'India to beat Pakistan'.
If India does beat Pakistan, the event's final settlement price woould be 100, and anyone who bought 
the event profits by the difference between 100 and their by price, multiplied by 0.01 x the quantity.
If Pakistan wins, the event would settle at 0, and anyone who sold the event profits by their
sale price x 0.01 x quantity.

To arrive at a fair price, you should think in probabilities of the events happening, and using probability
as a price to trade the event. 

- Estimate the probability of an Event happening.
- Say you believe India has a 20% to 35% chance of winning the world cup.
- That would translate on this site to : "I would be willing to buy **IndWChamp19** 
  at a price below 20 or sell at a price above 35"
- In the orderbook window, the white column is the "price" (a percentage probability)
  + Any number on the Green column on the left is a **bid** - the amount (you can think of it as
    dollars even though the site doesn't guarantee anything) that someone is willing to bet
    the event happening, at price level that is shown to its right. If that price level is
    higher than your probability estimate for the event, you might want to **hit** that bid
    by clicking on the Red column to the right of that bid, then go to the Order form at
    the top left, type the desired quantity, and click Submit.
  + Any number on the Red column on the right is an **offer** - the amount (you can think of it as
    dollars even though the site doesn't guarantee anything) that someone is willing to bet
    the event NOT happening, at price level that is shown to its left. If that price level is
    lower than your probability estimate for the event, you might want to **hit** that offer
    by clicking on the Green column to the left of that offer, then go to the Order form at
    the top left, type the desired quantity, and click Submit.
    
- If you don't see any existing bids/offers that you like, you can leave a standing bid/offer
    of your own. (expires in 24 hours) by following the same process as above.

- You can **CANCEL** any unfilled orders by clicking on the Red X in the "My Orders" window 

### 2. Team Performance contracts

These are the symbols like 'India*', with a country name and an asterisk 
They allow you to bet on a team's performance over the entire tournament (hat tip Tyler Steele).

The final settlement price is calculated as follows
- 6 points for each round robin win. So a maximum of 54 points available in RR.
- 14 points for winning the semi
- 32 points for winning the cup
- multiply the total by 0.01 

These numbers were chosen to ensure the trading range for these contracts would be
the same as for binary events - 0 to 100, and trading works and feels exactly like
binary contracts. The only difference is in final settlement procedure.

If I am doing the math right, there are a total of 330 points (6*45 + 14*2 + 32) points
available. If you manage to buy 1 contract of every team for a total less than 330 or sold for more than
330, you would make a riskless profit.

## Placing Orders

The Order window at the top left is where you Submit orders. 

If you start typing in the Event Field, you will see a Dropdown of all available events (fuzzy) matching your input.
If you choose one, A market orderbook window for that game should appear.

If you click on the Green(for Buy, Red for Sell) area of any orderbook window, the Instrument,
price level and direction of bet should be populated in the Order window. All you have to 
do is change the quantity

## Is the money real?

As of now, it is fake. There is a plan to change that. Though the site won't take responsibility 
for payments, the plan is publish a settlement list of who owes whom, and leave it to an honor
system.

`
const Help :React.FC<{}> = () => {
    return (<div> 
        <ReactMarkdown source={markdown} escapeHtml={false}/> 
    </div>)
}
export default Help