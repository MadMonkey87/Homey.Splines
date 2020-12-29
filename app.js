'use strict';

const Homey = require('homey');

class SplinesApp extends Homey.App {
  async onInit() {
    this.log('SplinesApp has been initialized');
  }
}

module.exports = SplinesApp;