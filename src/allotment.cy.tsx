import React from "react";

import Allotment from "./allotment";

/* const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
}) */

describe("<Allotment>", () => {
  it("mounts", () => {
    cy.mount(
      <div style={{ height: "400px", width: "400px" }}>
        <Allotment>
          <div />
          <div />
          <div />
          <div />
        </Allotment>
      </div>
    ).then(({ rerender }) => {
      cy.wait(100);
      rerender(
        <div style={{ height: "400px", width: "400px" }}>
          <Allotment>
            <div />
            <div />
          </Allotment>
        </div>
      );
    });
  });
});
