/// <reference types="Cypress" />

context('Navbar', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should be able to click on links', () => {
    cy.get('[data-testid="nav-stop-link"]')
      .eq(0)
      .click();

    cy.get('[data-testid="stop-name"]')
      .should('have.text', 'Transit Plaza')
      .should('be.visible');

    cy.get('[data-testid="nav-stop-link"]')
      .eq(1)
      .click();

    cy.get('[data-testid="stop-name"]')
      .should('have.text', 'Illini Union')
      .should('be.visible');
  });

  it('should be able to get and clear recents', () => {
    cy.get('[data-testid="nav-stop-link"]')
      .eq(0)
      .click();

    cy.get('[data-testid="nav-stop-link"]')
      .eq(1)
      .click();

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(0)
      .should('contain.text', 'Illini Union');

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(1)
      .should('contain.text', 'Transit Plaza');

    cy.get('[data-testid="recents-clear-all"]')
      .should('have.text', 'Clear All')
      .click();

    // Wait for dropdown to close and reopen
    cy.wait(300);

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-menu"]')
      .should('contain.text', 'No recent stops');
  });

  it('pushes recents without duplicates (different order)', () => {
    cy.get('[data-testid="nav-stop-link"]')
      .eq(0) // Transit
      .click();

    cy.get('[data-testid="nav-stop-link"]')
      .eq(1) // Union
      .click();

    cy.get('[data-testid="nav-stop-link"]')
      .eq(2) // PAR
      .click();

    cy.get('[data-testid="nav-stop-link"]')
      .eq(1) // Union
      .click();

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(0)
      .should('contain.text', 'Illini Union');

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(1)
      .should('contain.text', 'PAR');

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(2)
      .should('contain.text', 'Transit Plaza');
  });

  it('pushes recents without duplicates (same element twice)', () => {
    cy.get('[data-testid="nav-stop-link"]')
      .eq(2) // PAR
      .click();

    cy.get('[data-testid="nav-stop-link"]')
      .eq(2) // PAR
      .click();

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-item"]')
      .should('have.length', 1)
      .should('contain.text', 'PAR');
  });

  it('has recents links that work', () => {
    cy.get('[data-testid="nav-stop-link"]')
      .eq(0)
      .click();

    cy.get('[data-testid="nav-stop-link"]')
      .eq(1)
      .click();

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(0)
      .click();

    cy.get('[data-testid="stop-name"]')
      .should('have.text', 'Illini Union');
  });

  it("doesn't change order when clicking a recent link", () => {
    cy.get('[data-testid="nav-stop-link"]')
      .eq(0)
      .click();

    cy.get('[data-testid="nav-stop-link"]')
      .eq(1)
      .click();

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(1)
      .click();

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(0)
      .should('contain.text', 'Illini Union');

    cy.get('[data-testid="recents-dropdown-item"]')
      .eq(1)
      .should('contain.text', 'Transit Plaza');
  });

  it("clearall doesn't break on empty set", () => {
    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-clear-all"]')
      .should('have.text', 'Clear All')
      .click();

    cy.wait(300);

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-menu"]')
      .should('contain.text', 'No recent stops');
  });

  it('has a home button that works', () => {
    cy.get('[data-testid="nav-stop-link"]')
      .eq(0)
      .click();

    cy.get('[data-testid="navbar-home-link"]')
      .click();

    cy.get('h1')
      .should('have.text', 'UIUC Bus Tracker');
  });

  it('can toggle recents', () => {
    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    cy.get('[data-testid="recents-dropdown-menu"]')
      .should('be.visible');

    cy.get('[data-testid="recents-dropdown-toggle"]')
      .click();

    // Headless UI removes the element from DOM when closed
    cy.get('[data-testid="recents-dropdown-menu"]')
      .should('not.exist');
  });
});
