/// <reference types="Cypress" />
import { CUMTD_API_KEY } from "../../src/util/api";

context("Mobile", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.viewport("iphone-6");

    cy.fixture("many_stops.json").as("stops");
    cy.fixture("getstop_par.json").as("PARStopInfo");
    cy.server(); // enable response stubbing
    cy.route({
      method: "GET", // Route all GET requests
      url: `https://developer.cumtd.com/api/v2.2/json//getdeparturesbystop?key=${CUMTD_API_KEY}&stop_id=*`, // Mock a response for a stop ID
      response: "@stops"
    }).as("getDepartures");
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

    cy.get(".stop_name").should(
      "have.text",
      "Pennsylvania Ave. Residence Hall"
    );
  });

  it("has a working navbar", () => {
    cy.get(".navbar-toggler")
      .click()
      .get(".nav-item")
      .eq(0)
      .click()
      .get(".stop_name")
      .should("have.text", "Transit Plaza");
  });

  it("has a navbar which collapses on click", () => {
    cy.get(".navbar-toggler")
      .click()
      .get(".nav-item")
      .eq(0)
      .click()
      .get(".navbar-collapse")
      .should("have.css", "display")
      .and("equal", "none"); // check that the navbar collapses on click
  });

  it("has a navbar which stays open after click", () => {
    cy.get(".navbar-toggler")
      .click()
      .get(".navbar-collapse")
      .should("have.css", "display")
      .and("not.equal", "none"); // check that the navbar collapses on click
  });

  it("has a navbar which collapses on clicking hamburger icon", () => {
    cy.get(".navbar-toggler")
      .click()
      .click()
      .get(".navbar-collapse")
      .should("have.css", "display")
      .and("not.equal", "none"); // check that the navbar collapses on click
  });
});
