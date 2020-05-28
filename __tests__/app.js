"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-vuepress:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ name: "some great" });
  });

  it("creates files", () => {
    assert.file(["docs/README.md"]);
    assert.file(["docs/.vuepress/config.js"]);
    assert.file(["docs/.vuepress/components/Example.vue"]);
    assert.file(["docs/en/README.md"]);
    // Verifica que el package.json tiene los scripts necesarios
  });
});
