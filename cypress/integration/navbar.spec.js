/// <reference types="Cypress" />

context("Navbar", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should be able to click on links", () => {
    cy.get(".nav-item")
      .eq(0)
      .click()
      .get(".stop_name")
      .should("have.text", "Transit Plaza")
      .should("be.visible");

    cy.get(".nav-item")
      .eq(1)
      .click()
      .get(".stop_name")
      .should("have.text", "Illini Union")
      .should("be.visible");
  });

  it("should be able to get and clear recents", () => {
    cy.get(".nav-item")
      .eq(0)
      .click();

    cy.get(".nav-item")
      .eq(1)
      .click();

    cy.get(".dropdown-toggle")
      .click()
      .get(".dropdown-menu > :nth-child(1)")
      .should("have.text", "Illini Union")
      .get(".dropdown-menu > :nth-child(2)")
      .should("have.text", "Transit Plaza")
      .get(".dropdown-menu > :nth-child(4)")
      .should("have.text", "Clear All")
      .click(); // Clear all

    cy.get(".dropdown-toggle")
      .click()
      .get(".dropdown-menu > :nth-child(2)")
      .should("have.text", "Clear All");
  });

  it("pushes recents without duplicates (different order)", () => {
    cy.get(".nav-item")
      .eq(0) // Transit
      .click();

    cy.get(".nav-item")
      .eq(1) // Union
      .click();

    cy.get(".nav-item")
      .eq(2) // PAR
      .click();

    cy.get(".nav-item")
      .eq(1) // Union
      .click();

    cy.get(".dropdown-toggle")
      .click()
      .get(".dropdown-menu > :nth-child(1)")
      .should("have.text", "Illini Union")
      .get(".dropdown-menu > :nth-child(2)")
      .should("have.text", "PAR")
      .get(".dropdown-menu > :nth-child(3)")
      .should("have.text", "Transit Plaza");
  });

  it("pushes recents without duplicates (same element twice)", () => {
    cy.get(".nav-item")
      .eq(2) // PAR
      .click();

    cy.get(".nav-item")
      .eq(2) // PAR
      .click();

    cy.get(".dropdown-toggle")
      .click()
      .get(".dropdown-menu > :nth-child(1)")
      .should("have.text", "PAR")
      .get(".dropdown-menu > :nth-child(3)")
      .should("have.text", "Clear All");
  });

  it("has links that work", () => {
    cy.get(".nav-item")
      .eq(0)
      .click();

    cy.get(".nav-item")
      .eq(1)
      .click();

    cy.get(".dropdown-toggle")
      .click()
      .get(".dropdown-menu > :nth-child(1)")
      .click()
      .get(".stop_name")
      .should("have.text", "Illini Union");
  });

  it("has a home button that works", () => {
    cy.get(".nav-item")
      .eq(0)
      .click()
      .get(".navbar-brand")
      .click()
      .get("h1")
      .should("have.text", "UIUC Bus Tracker");
  });

  it("can toggle recents", () => {
    cy.get(".dropdown-toggle")
      .click()
      .get(".dropdown-menu > :nth-child(1)")
      .should("be.visible")
      .get(".dropdown-toggle")
      .click()
      .get(".dropdown-menu")
      .should("not.be.visible");
  });
});
