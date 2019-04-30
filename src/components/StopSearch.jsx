import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../styles/StopSearch.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { appendRecentStop } from '../util/CookieHandler';
import NearestStop from './NearestStop';

const stops = require('../util/allstops.json');

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  const words = inputValue.split(' ');

  return inputLength === 0
    ? []
    : stops
        .filter(stop => {
          let containsWord = true;
          // loop through every word in the input and see if it's included in the stop name
          words.forEach(word => {
            if (!stop.stop_name.toLowerCase().includes(word))
              containsWord = false;
          });

          return containsWord;
        })
        .slice(0, 5);
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.stop_name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.stop_name}</div>;

class StopSearch extends Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: [],
      selectionID: '',
      selectionName: '',
      nearestStopModalOpen: false
    };
  }

  componentDidUpdate() {
    const { shouldRedirect } = this.state;
    if (shouldRedirect) {
      this.setState({ shouldRedirect: false, value: '' });
    }
  }

  getLocation = () => {
    if (this.innerRef) {
      this.innerRef.getLocation();
    }
  };

  getInnerRef = ref => {
    this.innerRef = ref;
  };

  toggleNearestStopModal = () => {
    this.setState(prevState => ({
      nearestStopModalOpen: !prevState.nearestStopModalOpen
    }));
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionSelected = (e, { suggestion }) => {
    this.setState({
      shouldRedirect: true,
      selectionID: suggestion.stop_id,
      selectionName: suggestion.stop_name
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionHighlighted = ({ suggestion }) => {
    this.setState({
      highlightedSuggestion: suggestion
    });
  };

  innerRef;

  render() {
    const {
      value,
      suggestions,
      shouldRedirect,
      selectionName,
      selectionID,
      nearestStopModalOpen,
      highlightedSuggestion
    } = this.state;
    const { style } = this.props;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type the name of a stop',
      value,
      onChange: this.onChange
    };

    if (shouldRedirect) {
      appendRecentStop({
        name: selectionName,
        id: selectionID
      });
      return <Redirect push to={`/track/${selectionID}`} />;
    }

    // Finally, render it!
    return (
      <div className="search-wrapper">
        <Autosuggest
          style={style}
          onSuggestionSelected={this.onSuggestionSelected}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionHighlighted={this.onSuggestionHighlighted}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          highlightFirstSuggestion={!highlightedSuggestion}
          className="form-control"
          inputProps={inputProps}
        />
        <Button
          className="location-btn"
          onClick={() => {
            this.getLocation();
            this.toggleNearestStopModal();
          }}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} />
        </Button>
        <NearestStop
          isOpen={nearestStopModalOpen}
          toggle={this.toggleNearestStopModal}
          ref={this.getInnerRef}
        />
      </div>
    );
  }
}

StopSearch.propTypes = {
  style: PropTypes.object
};

export default StopSearch;
