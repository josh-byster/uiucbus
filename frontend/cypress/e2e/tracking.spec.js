context('Tracking With Stops Available', () => {
  beforeEach(() => {
    cy.fixture('many_stops.json').as('IUStops');
    cy.fixture('getstop_iu.json').as('IUStopInfo');
    cy.fixture('getvehicle.json').as('IUVehicle');

    cy.intercept('GET', '*/getdeparturesbystop?stop_id=*', { fixture: 'many_stops.json' }).as('getDepartures');
    cy.intercept('GET', '*/getstop?stop_id=IU', { fixture: 'getstop_iu.json' });
    cy.intercept('GET', '*/getvehicle?vehicle_id=*', { fixture: 'getvehicle.json' });

    cy.visit('http://localhost:3000/#/track/IU');
  });

  it('should have proper title', () => {
    cy.get('[data-testid="stop-name"]').should('have.text', 'Illini Union');
  });

  it('can navigate to another tracking page', () => {
    cy.get('[data-testid="stop-search-input"]').type('First{enter}');

    cy.get('[data-testid="stop-name"]')
      .should('contain', 'First')
      .should('be.visible');
  });

  it("doesn't display the no results message", () => {
    cy.wait('@getDepartures').then(() => {
      cy.contains('No buses').should('not.exist');
    });
  });

  it('first row is correct headsign', () => {
    cy.get('[data-testid="bus-result-row"]')
      .first()
      .find('[data-testid="bus-headsign"]')
      .should('contain.text', '100S')
      .and('contain.text', 'E14');
  });

  it('first row has correct ETA', () => {
    cy.get('[data-testid="bus-result-row"]')
      .first()
      .find('[data-testid="bus-eta"]')
      .should('contain.text', '1m');
  });

  it('should have the correct number of rows', () => {
    cy.get('[data-testid="bus-result-row"]').should('have.length', 27);
  });

  it("should have a modal title that's correct", () => {
    cy.get('[data-testid="bus-result-row"]')
      .first()
      .click();

    cy.get('[data-testid="bus-modal-title"]')
      .should('be.visible')
      .should('contain.text', '100S')
      .and('contain.text', 'E14');
  });

  it('should have a modal image', () => {
    cy.get('[data-testid="bus-result-row"]')
      .first()
      .click();

    cy.get('[data-testid="bus-modal-image"]')
      .should('be.visible');
  });

  it('should have space for next stop and previous stop', () => {
    cy.get('[data-testid="bus-result-row"]')
      .first()
      .click();

    cy.contains('Next Stop');
    cy.contains('Previous Stop');
  });

  it('should be able to click on multiple locations', () => {
    cy.get('[data-testid="bus-result-row"]')
      .eq(1)
      .click();

    cy.get('[data-testid="bus-modal-title"]')
      .should('be.visible')
      .should('contain.text', '120W')
      .and('contain.text', 'Teal');

    // Close modal by clicking backdrop or close button
    cy.get('body').type('{esc}');

    cy.get('[data-testid="bus-result-row"]')
      .eq(2)
      .click();

    cy.get('[data-testid="bus-modal-title"]')
      .should('be.visible')
      .should('contain.text', '220S')
      .and('contain.text', 'Illini');
  });
});
