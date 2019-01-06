/// <reference types="Cypress" />
import { CUMTD_API_KEY } from "../../src/util/api";
context("Tracking With Stops Available", () => {
  beforeEach(() => {
    cy.fixture("many_stops.json").as("stops");
    cy.fixture("getstop_par.json").as("PARStopInfo");
    cy.server(); // enable response stubbing
    cy.route({
      method: "GET", // Route all GET requests
      url: `https://developer.cumtd.com/api/v2.2/json//getdeparturesbystop?key=${CUMTD_API_KEY}&stop_id=*`, // Mock a response for a stop ID
      response: "@stops"
    }).as("getDepartures");

    cy.route({
      method: "GET", // Route all GET requests
      url: `https://developer.cumtd.com/api/v2.2/json//getstop?key=${CUMTD_API_KEY}&stop_id=PAR`, // Mock a response for a stop ID
      response: "@PARStopInfo"
    });
    cy.visit("http://localhost:3000/#/track/PAR");
  });

  it("should have proper title", () => {
    cy.get(".stop_name").should(
      "have.text",
      "Pennsylvania Ave. Residence Hall"
    );
  });

  it("should have proper headers", () => {
    cy.get("#bus-name").should("have.text", "Bus Name");

    cy.get("#eta").should("have.text", "ETA");
  });

  it("can navigate to another tracking page", () => {
    cy.get(".react-autosuggest__input").type("First{enter}");

    cy.get(".stop_name")
      .should("contain", "First")
      .should("be.visible");
  });

  it("doesn't display the no results message", () => {
    cy.wait("@getDepartures").then(xhr => {
      cy.get("No buses").should("not.exist");
    });
  });

  it("first row is correct", () => {
    cy.get(".resultRow:first b").should("have.text", "22N Illini Limited");
    cy.get(".resultRow:first td:nth-child(2)").should(
      "have.text",
      "Arriving Now"
    );
    cy.get(".resultRow:first td:nth-child(3)").should("have.text", "5:24:56");
    cy.get(".resultRow:first")
      .should("have.css", "background-color")
      .and("equal", "rgb(90, 29, 90)");
  });

  it("should have the correct number of rows", () => {
    cy.get(".resultRow").should("have.length", 17);
  });

  it("should have a modal title that's correct", () => {
    cy.get(".resultRow:first td:nth-child(4) > .btn")
      .click()
      .get(".modal-title")
      .should("be.visible")
      .should("have.text", "22N Illini Limited");
  });

  it("should have a modal image", () => {
    cy.get(".resultRow:first td:nth-child(4) > .btn")
      .click()
      .get(".img-fluid")
      .should("be.visible");
  });

  it("should have space for next stop and previous stop", () => {
    cy.get(".resultRow:first td:nth-child(4) > .btn")
      .click()
      .get(".modal-body")
      .contains("Next Stop:")
      .get(".modal-body")
      .contains("Previous Stop:");
  });

  it("should be able to click on multiple locations ", () => {
    cy.get(".resultRow:nth-child(2) td:nth-child(4) > .btn")
      .click()
      .get(".modal-title")
      .should("be.visible")
      .should("have.text", "4W Blue");

    cy.get(".modal-footer > .btn").click();

    cy.get(".resultRow:nth-child(3) td:nth-child(4) > .btn")
      .click()
      .get(".modal-title")
      .should("be.visible")
      .should("have.text", "1N YELLOWhopper");
  });
});
