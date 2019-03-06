
var webdriver = require("selenium-webdriver"),
    By = webdriver.By,
    until = webdriver.until;
var driver = new webdriver.Builder()
    .forBrowser("chrome").build();


describe('basic GUI test', () => {
    it('first test', (done) => {
        driver.get("localhost:3000");
        done();
    });


});