import Autosuggest from 'react-autosuggest';
import * as fuzzy from 'fuzzy'
import * as React from 'react'
import { Instrument } from 'MyModels';
import './FuzzyChooser.css'

// Imagine you have a list of events that you'd like to autosuggest.
// const events = [
//   {
//     symbol: 'IndWChamp19',
//     name: 'India to win World Cup 2019'
//   },
//   {
//     symbol: 'EngWChamp19',
//     name: 'England to win World Cup 2019'
//   },
  
// ];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value: string, events: ReadonlyArray<Instrument>): Array<Instrument> => {
  return /*value.length === 0? [] : */ (fuzzy.filter(
    value, 
    events as Array<Instrument>, 
    {extract: (e:Instrument) => `${e.symbol} ${e.name}` }
  ) as unknown as Array<Instrument>)
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion: {original: {symbol:string}}): string => 
  suggestion.original.symbol;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion: {original:{symbol:string}}) => (
  <div>
    {suggestion.original.symbol}
  </div>
);

type State = {
  //value: string,
  suggestions: Array<Instrument>
}
type Props = {
  events: ReadonlyArray<Instrument>,
  value: string,
  onChange: (e: React.FormEvent<any>, params: any) => any,
}
export class FuzzyChooser extends React.Component<Props,State> {
  constructor(props: Props) {
    super(props);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      //value: '',
      suggestions: []
    };
  }

  // onChange = (event: string, { newValue }:{newValue:string} ) => {
  //   this.setState({
  //     value: newValue
  //   });
  // };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value} : {value:string}) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.events)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    // const inputProps = {
    //   placeholder: 'Pick Event',
    //   value,
    //   onChange: this.onChange
    // };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions as any}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion as any}
        inputProps={{placeholder: 'Start typing a team', value: this.props.value, onChange: this.props.onChange}}
      />
    );
  }
}