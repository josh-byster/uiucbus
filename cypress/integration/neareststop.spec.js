/// <reference types="Cypress" />

context("Nearest Stop", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should be able to click on nearest stop icon", () => {
    cy.get(".location-btn")
      .click()
      .get(".modal-title")
      .should("have.text", "Nearest Stops");
  });

  it("should be able to click on exit", () => {
    cy.get(".location-btn")
      .click()
      .get(".modal-footer > .btn")
      .should("be.visible")
      .click()
      .get("modal-title")
      .should("not.exist");
  });
});
