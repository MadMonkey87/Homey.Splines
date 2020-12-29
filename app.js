'use strict';

const Homey = require('homey');

class SplinesApp extends Homey.App {
  async onInit() {
    this.log('SplinesApp has been initialized');

    let queryCompletedAction = new Homey.FlowCardTrigger('query_completed').register();

    let querySplineAction = new Homey.FlowCardAction('query_spline');
    querySplineAction
      .register()
      .registerRunListener(async (args, state) => {
        return new Promise((resolve) => {
          const tokens = { result: args.value };
          this.log('query completed ', tokens);
          queryCompletedAction.trigger(tokens);

          resolve(true);
        });
      });

    querySplineAction.getArgument('spline')
      .registerAutocompleteListener((query, args) => {
        return new Promise((resolve) => {
          let splines = Homey.ManagerSettings.get('splines');
          if (splines == undefined || splines === null) {
            splines = [];
          }
          resolve(splines);
        });
      });
  }
}

module.exports = SplinesApp;