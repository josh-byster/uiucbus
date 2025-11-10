import React, { useState, useCallback, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../styles/StopSearch.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { appendRecentStop } from '../util/CookieHandler';
import NearestStop from './NearestStop';
import stops from '../util/allstops.json';

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  const words = inputValue.split(' ');

  return inputLength === 0
    ? []
    : stops
        .filter((stop) => {
          return words.every((word) => stop.stop_name.toLowerCase().includes(word));
        })
        .slice(0, 5);
};

const getSuggestionValue = (suggestion) => suggestion.stop_name;

const renderSuggestion = (suggestion) => <div>{suggestion.stop_name}</div>;

const StopSearch = ({ style }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [nearestStopModalOpen, setNearestStopModalOpen] = useState(false);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(null);

  const nearestStopRef = useRef(null);

  const onChange = useCallback((event, { newValue }) => {
    setValue(newValue);
  }, []);

  const onSuggestionSelected = useCallback((e, { suggestion }) => {
    appendRecentStop({
      name: suggestion.stop_name,
      id: suggestion.stop_id,
    });
    setValue('');
    navigate(`/track/${suggestion.stop_id}`);
  }, [navigate]);

  const onSuggestionsFetchRequested = useCallback(({ value }) => {
    setSuggestions(getSuggestions(value));
  }, []);

  const onSuggestionsClearRequested = useCallback(() => {
    setSuggestions([]);
  }, []);

  const onSuggestionHighlighted = useCallback(({ suggestion }) => {
    setHighlightedSuggestion(suggestion);
  }, []);

  const toggleNearestStopModal = useCallback(() => {
    setNearestStopModalOpen((prev) => !prev);
  }, []);

  const getLocation = useCallback(() => {
    if (nearestStopRef.current) {
      nearestStopRef.current.getLocation();
    }
  }, []);

  const inputProps = {
    placeholder: 'Type the name of a stop',
    value,
    onChange,
    'aria-label': 'Search for bus stop',
  };

  return (
    <div className="search-wrapper">
      <Autosuggest
        style={style}
        onSuggestionSelected={onSuggestionSelected}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionHighlighted={onSuggestionHighlighted}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        highlightFirstSuggestion={
          !highlightedSuggestion || suggestions.indexOf(highlightedSuggestion) < 1
        }
        inputProps={inputProps}
      />
      <Button
        className="location-btn"
        onClick={() => {
          getLocation();
          toggleNearestStopModal();
        }}
        aria-label="Find nearest bus stops"
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </Button>
      {nearestStopModalOpen && (
        <NearestStop
          isOpen={nearestStopModalOpen}
          toggle={toggleNearestStopModal}
          ref={nearestStopRef}
        />
      )}
    </div>
  );
};

StopSearch.propTypes = {
  style: PropTypes.object,
};

export default StopSearch;
