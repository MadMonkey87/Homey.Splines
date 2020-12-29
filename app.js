'use strict';

const Homey = require('homey');
const Spline = require('cubic-spline');

class SplinesApp extends Homey.App {
  async onInit() {
    this.log('SplinesApp has been initialized');

    let queryCompletedAction = new Homey.FlowCardTrigger('query_completed').register();

    let querySplineAction = new Homey.FlowCardAction('query_spline');
    querySplineAction
      .register()
      .registerRunListener((args, state) => {
        return new Promise((resolve) => {
          const splines = Homey.ManagerSettings.get('splines');
          for (var i = 0; i < splines.length; i++) {
            if (splines[i].id === args.spline.id) {
              const xs = splines[i].vertices.map(v => v.x);
              const ys = splines[i].vertices.map(v => v.y);

              const splineCalculator = new Spline(xs, ys);

              const tokens = { result: splineCalculator.at(args.value) };
              this.log('query completed ', tokens);
              queryCompletedAction.trigger(tokens);

              resolve(true);
              break;
            }
          }
          this.log('No spline found for ', args.state.id);
          resolve(false);
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