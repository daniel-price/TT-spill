const config = require("./jest.config");
config.testRegex = "ispec\\.ts$"; //Override testRegex option
module.exports = config;
