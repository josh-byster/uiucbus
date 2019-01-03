/// <reference types="Cypress" />
import { CUMTD_API_KEY } from "../../src/util/api";
context("Tracking No Stops", () => {
  beforeEach(() => {
    cy.fixture("no_stops.json").as("stops");
    cy.server(); // enable response stubbing
    cy.route({
      method: "GET", // Route all GET requests
      url: `https://developer.cumtd.com/api/v2.2/json//getdeparturesbystop?key=${CUMTD_API_KEY}&stop_id=*`, // Mock a response for a stop ID
      response: "@stops"
    }).as("getDepartures");
    cy.visit("http://localhost:3000/#/track/PAR");
  });

  it("should have proper title", () => {
    cy.get(".stop_name").should(
      "have.text",
      "Pennsylvania Ave. Residence Hall"
    );
  });

  it("can navigate to another tracking page", () => {
    cy.get(".react-autosuggest__input").type("First{enter}");

    cy.get(".stop_name")
      .should("contain", "First")
      .should("be.visible");
  });

  it("displays no results", () => {
    cy.get("h4")
      .should("have.text", "No buses coming in the next hour.")
      .should("be.visible");
  });

  it("displays no results", () => {
    cy.wait("@getDepartures").then(xhr => {
      cy.get("Mins").should("not.exist");
    });
  });
});
