'use strict';

const Homey = require('homey');
const Spline = require('cubic-spline');

class SplinesApp extends Homey.App {
  async onInit() {
    this.log('SplinesApp has been initialized');

    let queryCompletedAction = new Homey.FlowCardTrigger('query_completed')
      .registerRunListener((args, state) => {
        return Promise.resolve(args.spline.id === state.spline);
      })
      .register();

    queryCompletedAction.getArgument('spline')
      .registerAutocompleteListener((query, args) => {
        return new Promise((resolve) => {
          let splines = Homey.ManagerSettings.get('splines');
          if (splines == undefined || splines === null) {
            splines = [];
          }
          resolve(splines);
        });
      });

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
              const result = +splineCalculator.at(args.value).toFixed(2);

              const tokens = { result: result };
              const state = { spline: args.spline.id };
              this.log('query completed ', tokens, state);
              queryCompletedAction.trigger(tokens, state);

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

    let querySplineTimeBasedAction = new Homey.FlowCardAction('query_spline_time_based');
    querySplineTimeBasedAction
      .register()
      .registerRunListener((args, state) => {
        return new Promise((resolve) => {
          const splines = Homey.ManagerSettings.get('splines');
          for (var i = 0; i < splines.length; i++) {
            if (splines[i].id === args.spline.id) {

              try {
                const xs = splines[i].vertices.map(v => v.x);
                const ys = splines[i].vertices.map(v => v.y);

                const now = new Date();
                const value = now.getHours() + (now.getMinutes() / 60) + (now.getSeconds() / 3600);

                const splineCalculator = new Spline(xs, ys);
                const result = +splineCalculator.at(value).toFixed(2);

                const tokens = { result: result };
                const state = { spline: args.spline.id };
                this.log('time based query completed ', tokens, state);
                queryCompletedAction.trigger(tokens, state);

                resolve(true);

              } catch (e) {
                this.log(e);
              }
              break;
            }
          }
          this.log('No spline found for ', args.state.id);
          resolve(false);
        });
      });

    querySplineTimeBasedAction.getArgument('spline')
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