/// <reference types="Cypress" />

context("Basic", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should have Bus Tracker title", () => {
    cy.get(".info-box").should("have.text", "UIUC Bus Tracker");
  });

  it("typing into the main textbox on page", () => {
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
    cy.get(".react-autosuggest__input")
      .type("PAR")
      .should("have.value", "PAR")

      // .type() with special character sequences
      .type("{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}")
      .should("have.value", "PAR");
  });

  it("should autofill based on selection", () => {
    cy.get(".react-autosuggest__input")
      .type("PAR{downarrow}{uparrow}")
      .should("have.value", "PAR (Pennsylvania Ave. Residence Hall)")

      // .type() with special character sequences
      .type("{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}")
      .should("have.value", "PAR");
  });

  it("clicking enter should take to tracking page", () => {
    cy.get(".react-autosuggest__input").type("PAR{enter}");

    cy.get(".stop_name")
      .should("have.text", "Pennsylvania Ave. Residence Hall")
      .should("be.visible");
  });

  it("picking another result should take to appropriate tracking page", () => {
    cy.get(".react-autosuggest__input").type("PAR{downarrow}{enter}");

    cy.get(".stop_name")
      .should("have.text", "First and Lake Park North")
      .should("be.visible");
  });

  it("invalid result takes you nowhere", () => {
    cy.get(".react-autosuggest__input")
      .type("ajsldk{uparrow}{downarrow}{enter}")
      .should("have.value", "ajsldk");
  });

  it("empty result takes you nowhere", () => {
    cy.get(".react-autosuggest__input")
      .type("{enter}")
      .should("have.value", "")
      .get(".info-box")
      .should("have.text", "UIUC Bus Tracker");
  });

  it("backspace to correct search gets results", () => {
    cy.get(".react-autosuggest__input")
      .type("PARaaa{backspace}{backspace}{backspace}")
      .should("have.value", "PAR");
  });

  it("fuzzy search works as expected", () => {
    cy.get(".react-autosuggest__input").type("greg first");

    cy.get(".react-autosuggest__suggestions-list").should(
      "have.text",
      "First and Gregory"
    );
  });

  it("fuzzy search advanced", () => {
    cy.get(".react-autosuggest__input").type("fo gree an");

    cy.get(".react-autosuggest__suggestions-list")
      .should("have.text", "Green and Fourth")
      .click();
    cy.get(".stop_name")
      .should("have.text", "Green and Fourth")
      .should("be.visible");
  });
});
