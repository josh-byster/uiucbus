/// <reference types="Cypress" />

context("Basic", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("typing into the main textbox on page", () => {
    // https://on.cypress.io/type
    cy.get(".react-autosuggest__input")
      .type("PAR")
      .should("have.value", "PAR")

      // .type() with special character sequences
      .type("{downarrow}")
      .should("have.value", "First and Lake Park North")
      .clear()
      .type("PAR{uparrow}")
      .should("have.value", "PAR");
  });

  it("cycling through results should work", () => {
    // https://on.cypress.io/type
    cy.get(".react-autosuggest__input")
      .type("PAR")
      .should("have.value", "PAR")

      // .type() with special character sequences
      .type("{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}")
      .should("have.value", "PAR");
  });

  it("clicking enter should take to tracking page", () => {
    // https://on.cypress.io/type
    cy.get(".react-autosuggest__input").type("PAR{enter}");

    cy.get(".stop_name").should(
      "have.text",
      "Pennsylvania Ave. Residence Hall"
    );
  });

  it("clicking enter should take to tracking page", () => {
    // https://on.cypress.io/type
    cy.get(".react-autosuggest__input").type("PAR{enter}");

    cy.get(".stop_name").should(
      "have.text",
      "Pennsylvania Ave. Residence Hall"
    );
  });

  it("picking another result should take to appropriate tracking page", () => {
    // https://on.cypress.io/type
    cy.get(".react-autosuggest__input").type("PAR{downarrow}{enter}");

    cy.get(".stop_name").should("have.text", "First and Lake Park North");
  });
});
