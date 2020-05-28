"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const _ = require("lodash");
const fs = require("fs");

let pkgJson = {
  scripts: {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
  devDependencies: {
    vuepress: "^1.3.0"
  }
};
const PACKAGE_JSON = "package.json";
module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`
      Bienvenido al ${chalk.red("VuePress Generator")}!
      `)
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "El nombre de tu componente",
        default: _.upperFirst(_.camelCase(this.appname)),
        validate: async function(input) {
          if (!input) {
            return false;
          }

          return true;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  configuring() {
    this.props.name = _.upperFirst(_.camelCase(this.props.name));
    this.props.nameKebab = _.kebabCase(this.props.name);
    this.props.nameSnake = _.snakeCase(this.props.name);
    const packageJsonPath = this.destinationPath(PACKAGE_JSON);
    if (fs.existsSync(packageJsonPath)) {
      this.props.packageJson = this.fs.readJSON(packageJsonPath);
    }
  }

  writing() {
    // Copia los archivos
    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("docs/README.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("docs/en/README.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("vuepress/config.js.ejs"),
      this.destinationPath("docs/.vuepress/config.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("vuepress/components/ComponentExample.vue.ejs"),
      this.destinationPath("docs/.vuepress/components/Example.vue"),
      this.props
    );
    const packageJson = this.props.packageJson;

    if (packageJson) {
      // Agrega scripts al package.json
      this.fs.extendJSON(this.destinationPath(PACKAGE_JSON), pkgJson);
      // Lee la versión de vue y vue-template-compiler que se está utilizando
      let vueVersion =
        packageJson.devDependencies &&
        packageJson.devDependencies["vue-template-compiler"]
          ? packageJson.devDependencies["vue-template-compiler"]
          : "";

      // Corrige versión de vue-template-compiler
      if (vueVersion.includes("2.6.10")) {
        this.log(
          `
          vue-press requiere ${chalk.red("vue-template-compiler@2.6.11")}
          `
        );
      }
    }
  }

  install() {
    this.npmInstall("vue-template-compiler@^2.6.11");
    this.npmInstall("vue@^2.6.11");
    this.npmInstall();
  }

  end() {
    this.log(
      `Ejecuta ${chalk.red("npm run docs:dev")} para empezar a documentar
      `
    );
  }
};
