// <reference types="Cypress" />
import { CUMTD_API_URI } from '../../src/util/api';

context('Tracking No Stops', () => {
  beforeEach(() => {
    cy.fixture('no_stops.json').as('stops');
    cy.fixture('getstop_par.json').as('PARStopInfo');
    cy.server(); // enable response stubbing
    cy.route({
      method: 'GET',
      url: `${CUMTD_API_URI}/getdeparturesbystop?stop_id=*`, // Mock a response for a stop ID
      response: '@stops'
    }).as('getDepartures');

    // Using this to reduce load on MTD's API
    cy.route({
      method: 'GET',
      url: `${CUMTD_API_URI}/getstop?stop_id=PAR`, // Mock a response for getting stops
      response: '@PARStopInfo'
    });
    cy.visit('http://localhost:3000/#/track/PAR');
  });

  it('should have proper title', () => {
    cy.get('.stop_name').should(
      'have.text',
      'Pennsylvania Ave. Residence Hall'
    );
  });

  it('can navigate to another tracking page', () => {
    cy.get('.react-autosuggest__input').type('First{enter}');

    cy.get('.stop_name')
      .should('contain', 'First')
      .should('be.visible');
  });

  it('displays no results', () => {
    cy.get('h4')
      .should('have.text', 'No buses coming in the next hour.')
      .should('be.visible');
  });

  it('displays no results', () => {
    cy.wait('@getDepartures').then(() => {
      cy.get('Mins').should('not.exist');
    });
  });
});
