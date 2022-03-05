// Imports useState and useEffect for data manipulation.
import { useState, useEffect } from 'react';
// Imports Axios for the API call.
import Axios from 'axios';
// Imports the Dropdown component to easily make a dropdown menu.
import Dropdown from 'react-dropdown';
// Imports the styling for the Dropdown component.
import 'react-dropdown/style.css';
// Imports the arrow icon.
import { BsArrowRepeat } from 'react-icons/bs';
// Imports this component's stylesheet.
import './App.scss';

function App() {

  // The apiData state holds the API data of the from state's currency conversion rate to other currencies.
  const [apiData, setApiData] = useState([]);
  // The input state holds what the user inputs in the Initial Amount input field.
  const [input, setInput] = useState(0);
  // The from state holds one currency in the From dropdown menu.
  const [from, setFrom] = useState('usd');
  // The to state holds one currency in the To dropdown menu.
  const [to, setTo] = useState('eur');
  // The currencies state holds the abbreviations of all the currencies from apiData.
  const [currencies, setCurrencies] = useState([]);
  // The currNames state holds the full names of the currencies.
  const [currNames, setCurrNames] = useState([]);
  // The output state holds what the user sees by Converted Amount.
  const [output, setOutput] = useState(0);

  // This will initially make an API call with usd as from's initial state (line 21).
  useEffect(() => {
    // Axios.get gets a promise from the API, and what is returned is a response object.
    Axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`)
      // The response object (res) has one key-value pair: data and all of the data from the API.
      .then(res => {
        /*
        The apiData state is set to the API data's (res.data) from state's currency's conversions ([from]), which is an object holding currency abbreviations as keys 
        and the conversion rate as a number for its value.
        */
        setApiData(res.data[from]);
      });
  // This useEffect will run again anytime the from state is changed.
  }, [from]);

  // This will initially set the currencies state to hold the currency abbreviations for usd (line 41).
  useEffect(() => {
    // Sets the currencies state as all of the keys/currency abbreviations (Object.keys()) in the apiData state.
    setCurrencies(Object.keys(apiData));
    // Runs the convert function.
    convert();
  // This useEffect will run again anytime the apiData state is changed.
  }, [apiData]);

  // This will make another API call to get all of the currency full names.
  useEffect(() => {
    Axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`)
      .then(res => {
        /*
        The data is an object of key-value pairs where the key is the currency's abbreviation, and the value is the currency's full name.
        Sets alll of the values in the currNames state.
        */
        setCurrNames(Object.values(res.data));
      });
  // This useEffect will only run once upon rendering.
  }, []);

  // Function to convert the Initial Amount in the From currency to the To currency.
  function convert() {
    // rate is the value (conversion rate) of the given key (the currency in the to state) from the apiData state.
    const rate = apiData[to];
    // Sets the output state as the input multiplied by the rate.
    setOutput(input * rate);
  }

  // Function to switch the two currency abbreviations in the From and To dropdown menus.
  function flip() {
    // temp holds the currency abbreviation in the from state.
    const temp = from;
    // Sets the from state to be the currency abbreviation in the to state.
    setFrom(to);
    // Sets the to state to be the currency abbreviation in temp (i.e. what was previously in the from state).
    setTo(temp);
  }

  // options is going to be the array we are passing into the Dropdown component (line 113).
  const options = currencies.map((key, value) => {
    /*
    We map over the currencies state's array and return a new array, options, where each element is a string interpolation of an element in currencies (key) and an 
    element in currNames (currNames[value]).
    */
    return `${key} - ${currNames[value]}`;
  });

  // Everything within return is what the user will visually see.
  return (
    // Whatever React returns must be enclosed within one parent tag.
    <div className="App">

      {/* This holds the title. */}
      <div id='header'>
        <h1 className='title'>Currency Calculator</h1>
      </div>

      {/* This holds the dropdown menus and the arrow icon. */}
      <div id='currencies'>
        <div id='from'>
          <h3 className='label'>From</h3>
          {/* The Dropdown component takes an array for its options (i.e. the options the user can select in the menu), onChange takes the event (abbreviated as e which 
              is the entire Dropdown component) and sets the from state as the value within the component, and a value which is tied to the currency abbreviation in the 
              from state. */}
          <Dropdown 
            options={options}
            /*
            onChange triggers whenever a different country abbreviation is selected.
            For the code to work, we are only grabbing the abbreviation by splitting the string by its whitespaces, and grabbing the abbreviation at the first index.
            */
            onChange={e => setFrom(e.value.split(' ')[0])}
            value={from}
            className='menu'
          />
        </div>
        {/* This is the arrow icon. */}
        <BsArrowRepeat
          // I used an inline function for all my functions even if it did not require arguments to make it easier for me. Could have put onClick={flip} instead.
          onClick={() => flip()} 
          className='icon'
        />
        <div id='to'>
          <h3 className='label'>To</h3>
          <Dropdown 
            options={options}
            onChange={e => setTo(e.value.split(' ')[0])}
            value={to}
            className='menu'
          />
        </div>
      </div>

      {/* This holds the input field, convert button, and displays the converted amount. */}
      <div id='amounts'>
        <div id='initial'>
          <h3 className='label'>Initial Amount</h3>
          <div className='form'>
            {/* I used type='number' to avoid the user from inputting a string, value is tied to the number in the input state, set the min to 0.00 to avoid negative 
                numbers, step increments/decrements the number by 0.01 if the user uses the arrow within the input, and onChange it takes the event's target's (The input 
                tag is the target that triggered the onChange event) value and sets it in the input state. */}
            <input 
              type='number'
              value={input}
              min='0.00'
              step='0.01'
              // onChange occurs whenever the user types or deletes a character.
              onChange={e => setInput(e.target.value)}
            />
            {/* onClick occurs when this button is clicked, and it runs the convert function. */}
            <button onClick={() => convert()}>Convert</button>
          </div>
        </div>
        <div id='convert'>
          <h3 className='label'>Converted Amount</h3>
          {/* Used string interpolation to display the values in the output (number) and to (currency abbreviation) state, and fixed output to two decimal places. */}
          <div>
            <p className='text'>{`${output.toFixed(2)} ${to}`}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

// Exports this component to be imported by other components.
export default App;