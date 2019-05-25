import * as React from 'react'
import emoji from 'emoji-dictionary'
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
the event profits by the difference between 100 and their buy price, multiplied by 0.01 x the quantity.
If Pakistan wins, the event would have a final settlement price of 0, and anyone who sold the event profits by their
sale price x 0.01 x quantity.

So if you buy a quantity 10 of "Ind > Pak" at a price of 65 (yes, I think India are favorites :wink:) , you make (100 - 65) x 0.01 x 10 = 3.50 if India 
wins, and you lose 65 x 0.01 x 10 = 6.50 if Pakistan wins

To arrive at a fair price, you should think in probabilities of the events happening, and using probability
as a price to trade the event. 

- Estimate the probability of an Event happening.
- Say you believe India has a 20% to 35% probability of winning the world cup.
- That should translate to : "I should be willing to buy **IndWChamp19** 
  at any price below 20 or sell at any price above 35"
- In the orderbook window ("price ladder"), the white column is the "price" (a percent probability)
  + Any number on the <span style="background-color:#cefdce;">Green column</span> on the left is a **bid** - the amount 
    that someone is willing to bet
    the event happening, at price level that is shown to its right. If that price level is
    higher than your probability estimate for the event, you might want to **hit** that bid
    by clicking on the <span style="background-color:#fdd3ce;">Red column</span> to the right of that bid, then go to the Order form at
    the top left, type the desired quantity, and click Submit.
  + Any number on the Red column on the right is an **offer** - the amount (you can think of it as
    dollars even though the site doesn't guarantee anything) that someone is willing to bet
    the event NOT happening, at price level that is shown to its left. If that price level is
    lower than your probability estimate for the event, you might want to **hit** that offer
    by clicking on the Green column to the left of that offer, then go to the Order form at
    the top left, type the desired quantity, and click Submit.
    
- If you don't see any existing bids/offers that you like, you can leave a standing bid/offer
    of your own. by following the same process as above.

- You can **CANCEL** any unfilled and partially filled orders by clicking on the Red <span style="background-color:red;">X</span> in the "My Orders" window 

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

If I am doing the math right, there are a total of 330 points (6x45 + 14x2 + 32) points
available in the 2019 World Cup. If you manage to buy 1 contract of every team for a total less than 330 or sold for more than
330, you would make a riskless profit.

## Placing Orders

The Order form at the top left is where you Submit orders. 

You can fill out the fields in that form and click on Submit, but perhaps the more intuitive way to choose the 'instrument' 
is via the Instrument panel. You can find the instrument by typing some part of the name/symbol in the search fields at the
top left. Then if you click Lift, the instrument, the best offered price and the available quantity will be filled in the
Order form for you. You may then adjust the quantity (or any oher field) ad click Submit. You should get filled unless
someone else beat you to the offer or the offerer canceld their order

## Is the money real?

Let us just say the currency is "runs". This is a small private site. If you don't know the exchange rate, you probably shouldn't be using the site :wink:

`
//var emojified = markdown.replace(/:(\w+):/g, '![:$1:](http://some.emoji.host/$1.png)')
const emojiSupport = (text: { value: string }) => text.value.replace(/:\w+:/gi, (name: string) => emoji.getUnicode(name))

const Help: React.FC<{}> = () => {
    return (<div>
        <ReactMarkdown source={markdown} escapeHtml={false} renderers={{ text: emojiSupport }} />
    </div>)
}
export default Help
