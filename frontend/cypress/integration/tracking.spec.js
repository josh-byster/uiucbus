
context('Tracking With Stops Available', () => {
  beforeEach(() => {
    cy.fixture('many_stops.json').as('IUStops');
    cy.fixture('getstop_iu.json').as('IUStopInfo');
    cy.fixture('getvehicle.json').as('IUVehicle');

    cy.server(); // enable response stubbing

    cy.route({
      method: 'GET', // Route all GET requests
      url: `*/getdeparturesbystop?stop_id=*`, // Mock a response for a stop ID
      response: '@IUStops'
    }).as('getDepartures');

    cy.route({
      method: 'GET', // Route all GET requests
      url: `*/getstop?stop_id=IU`, // Mock a response for a stop ID
      response: '@IUStopInfo'
    });

    cy.route({
      method: 'GET', // Route all GET requests
      url: `*/getvehicle?vehicle_id=*`, // Mock a response for a stop ID
      response: '@IUVehicle'
    });

    cy.visit('http://localhost:3000/#/track/IU');
  });

  it('should have proper title', () => {
    cy.get('.stop_name').should('have.text', 'Illini Union');
  });

  it('should have proper headers', () => {
    cy.get('#bus-name').should('have.text', 'Bus Name');

    cy.get('#eta').should('have.text', 'ETA');
  });

  it('can navigate to another tracking page', () => {
    cy.get('.react-autosuggest__input').type('First{enter}');

    cy.get('.stop_name')
      .should('contain', 'First')
      .should('be.visible');
  });

  it("doesn't display the no results message", () => {
    cy.wait('@getDepartures').then(() => {
      cy.get('No buses').should('not.exist');
    });
  });

  it('first row is correct', () => {
    cy.get('.resultRow:first b').should('have.text', '100S Yellow E14');
    cy.get('.resultRow:first td:nth-child(2)').should('have.text', '1m');
    cy.get('.resultRow:first td:nth-child(3)').should('have.text', '9:47:03');
    cy.get('.resultRow:first')
      .should('have.css', 'background-color')
      .and('equal', 'rgb(252, 238, 31)');
  });

  it('should have the correct number of rows', () => {
    cy.get('.resultRow').should('have.length', 27);
  });

  it("should have a modal title that's correct", () => {
    cy.get('.resultRow:first td:nth-child(4) > .btn')
      .click()
      .get('.modal-title')
      .should('be.visible')
      .should('have.text', '100S Yellow E14');
  });

  it('should have a modal image', () => {
    cy.get('.resultRow:first td:nth-child(4) > .btn')
      .click()
      .get('.img-fluid')
      .should('be.visible');
  });

  it('should have space for next stop and previous stop', () => {
    cy.get('.resultRow:first td:nth-child(4) > .btn')
      .click()
      .get('.modal-body')
      .contains('Next Stop:')
      .get('.modal-body')
      .contains('Previous Stop:');
  });

  it('should be able to click on multiple locations ', () => {
    cy.get('.resultRow:nth-child(2) td:nth-child(4) > .btn')
      .click()
      .get('.modal-title')
      .should('be.visible')
      .should('have.text', '120W Teal');

    cy.get('.modal-footer > .btn').click();

    cy.get('.resultRow:nth-child(3) td:nth-child(4) > .btn')
      .click()
      .get('.modal-title')
      .should('be.visible')
      .should('have.text', '220S Illini');
  });
});
