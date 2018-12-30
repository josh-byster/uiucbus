import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import stops from "../util/allstops.js";
import { Redirect } from "react-router-dom";
import { Button } from "reactstrap";
import "../styles/StopSearch.scss";
import { appendRecentStop } from "../util/CookieHandler";
import NearestStop from "./NearestStop.js";

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : stops
        .filter(stop => stop.stop_name.toLowerCase().includes(inputValue))
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
      value: "",
      suggestions: [],
      selectionID: "",
      selectionName: "",
      nearestStopModalOpen: false
    };
  }

  toggleNearestStopModal = () => {
    this.setState({
      nearestStopModalOpen: !this.state.nearestStopModalOpen
    });
  };

  innerRef;
  getInnerRef = ref => {
    this.innerRef = ref;
  };

  getLocation = () => {
    this.innerRef && this.innerRef.getLocation();
  };

  componentDidUpdate(prevProps) {
    if (this.state.shouldRedirect) {
      this.setState({ shouldRedirect: false, value: "" });
    }
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionSelected = (
    e,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
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

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Type the name of a stop",
      value,
      onChange: this.onChange
    };

    if (this.state.shouldRedirect) {
      appendRecentStop({
        name: this.state.selectionName,
        id: this.state.selectionID
      });
      return <Redirect push to={`/track/${this.state.selectionID}`} />;
    }

    // Finally, render it!
    return (
      <div className="search-wrapper">
        <Autosuggest
          style={this.props.style}
          onSuggestionSelected={this.onSuggestionSelected}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          highlightFirstSuggestion={true}
          className="form-control"
          inputProps={inputProps}
        />
        <Button
          onClick={e => {
            this.getLocation();
            this.toggleNearestStopModal();
          }}
        >
          Hello
        </Button>
        <NearestStop
          isOpen={this.state.nearestStopModalOpen}
          toggle={this.toggleNearestStopModal}
          ref={this.getInnerRef}
        />
      </div>
    );
  }
}

export default StopSearch;
