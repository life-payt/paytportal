/*
* Login Life-Payt
*/

"use strict";

var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var By = webdriver.By;
const chai = require('chai');
const expect = chai.expect;
var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();

function login(user,pass) {
	var username = browser.findElement(webdriver.By.name('username'));
	var password = browser.findElement(webdriver.By.name('password'));
	browser.wait(until.elementIsVisible(username),500);
	browser.wait(until.elementIsVisible(password),500);

	username.sendKeys(user);
	return password.sendKeys(pass);
}

function successLogin() {
	return browser.wait(function() {
	   	return browser.getTitle().then(function(title) {

	     	return title === 'LIFE-PAYT | Dashboard';
	   	});
	},5000).catch(function(err){
		throw Error('invalid login');
	});
}

function failLogin() {
	var denied = browser.findElement(By.name('denied'));
	browser.wait(until.elementIsVisible(denied),2000).catch( function(err) { 
		throw Error('Login valid')
	});;
	
	return denied.getText().then(function(text) {
		return text === 'Credenciais inválidas';
	});
}

function clickLogin(link) {
	return browser.findElement(By.name('submit')).click();
}

function handleFailure(err) {
	console.error('Something went wrong\n', err.stack, '\n');
}

describe('Test login form submit ', function() {
    // e2e tests are too slow for default Mocha timeout
    this.timeout(10000);

    beforeEach(function(done) {
        browser.get('http://payt.moreirahelder.com:5242/general.html').then(() => done());
    });
    
    it('login approved', function(done) {
        browser.findElement(By.name('btnLogin')).click();
      	login('business1','passwd').then(clickLogin).then(successLogin).then(function(res) {
      		expect(res).to.be.true;
      		done();
      	}).catch( (err) => done(err) );
    });
    
    it('login denied', function(done) {
        browser.findElement(By.name('btnLogin')).click();
        login('business1','pass').then(clickLogin).then(failLogin).then(function(res) {
      		expect(res).to.be.true;
      		done();
      	}).catch( (err) => done(err) );
    });

    after(() => browser.quit());
});


