'use strict';

const Homey = require('homey');
const Spline = require('cubic-spline');
const { util } = require('./util');
const { HomeyAPI } = require('athom-api');

class SplinesApp extends Homey.App {

  async onInit() {
    this.log('SplinesApp has been initialized');

    this.globalDropTokens = {};

    let splines = this.homey.settings.get('splines');
    for (var i = 0; i < splines.length; i++) {
      // migrate if necessary
      if (!splines[i].digits) {
        this.log('Set digits for ' + splines[i].id);
        splines[i].digits = 2;
      }

      this.globalDropTokens[splines[i].id] = await this.homey.flow.createToken(splines[i].id, {
        type: "number",
        title: splines[i].name
      });
    }
    this.homey.settings.set('splines', splines);

    this.homey.settings.on('set', this.onSettingsChanged.bind(this))

    this.queryCompletedTrigger = this.homey.flow.getTriggerCard('query_completed')
      .registerRunListener((args, state) => {
        return Promise.resolve(args.spline.id === state.spline);
      });

    this.queryCompletedTrigger.getArgument('spline')
      .registerAutocompleteListener((query, args) => {
        return new Promise((resolve) => {
          let splines = this.homey.settings.get('splines');
          if (splines == undefined || splines === null) {
            splines = [];
          }
          resolve(splines);
        });
      });

    let querySplineCondition = this.homey.flow.getConditionCard('query_spline_condition');
    querySplineCondition
      .registerRunListener(async (args, state) => {
        return new Promise((resolve) => {
          const splines = this.homey.settings.get('splines');
          for (var i = 0; i < splines.length; i++) {
            if (splines[i].id === args.spline.id) {
              const xs = splines[i].vertices.map(v => v.x);
              const ys = splines[i].vertices.map(v => v.y);

              const splineCalculator = new Spline(xs, ys);
              const result = util.clamp(+splineCalculator.at(args.value).toFixed(splines[i].digits), splines[i].miny, splines[i].maxy);

              const tokens = { result: result };
              const state = { spline: args.spline.id };
              this.log('query completed ', tokens, state);

              // this.queryCompletedTrigger.trigger(tokens, state);
              await this.globalDropTokens[args.spline.id].setValue(result);

              resolve(true);
              break;
            }
          }
          this.log('No spline found for ', args.state.id);
          resolve(false);
        });
      });

    querySplineCondition.getArgument('spline')
      .registerAutocompleteListener((query, args) => {
        return new Promise((resolve) => {
          let splines = this.homey.settings.get('splines');
          if (splines == undefined || splines === null) {
            splines = [];
          }
          resolve(splines);
        });
      });

    let querySplineTimeBasedCondition = this.homey.flow.getConditionCard('query_spline_time_based_condition');
    querySplineTimeBasedCondition
      .registerRunListener(async (args, state) => {
        return new Promise((resolve) => {
          const splines = this.homey.settings.get('splines');
          for (var i = 0; i < splines.length; i++) {
            if (splines[i].id === args.spline.id) {

              try {
                const xs = splines[i].vertices.map(v => v.x);
                const ys = splines[i].vertices.map(v => v.y);

                const now = new Date();
                let value = now.getHours() + (now.getMinutes() / 60) + (now.getSeconds() / 3600);
                value = value / 24 * (splines[i].maxx - splines[i].minx);

                const splineCalculator = new Spline(xs, ys);
                const result = util.clamp(+splineCalculator.at(value).toFixed(splines[i].digits), splines[i].miny, splines[i].maxy);

                const tokens = { result: result };
                const state = { spline: args.spline.id };
                this.log('time based query completed ', tokens, state, value);

                //this.queryCompletedTrigger.trigger(tokens, state);
                await this.globalDropTokens[args.spline.id].setValue(result);

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

    querySplineTimeBasedCondition.getArgument('spline')
      .registerAutocompleteListener((query, args) => {
        return new Promise((resolve) => {
          let splines = this.homey.settings.get('splines');
          if (splines == undefined || splines === null) {
            splines = [];
          }
          resolve(splines);
        });
      });

    let querySplineAction = this.homey.flow.getActionCard('query_spline');
    querySplineAction
      .registerRunListener(async (args, state) => {
        return new Promise((resolve) => {
          const splines = this.homey.settings.get('splines');
          for (var i = 0; i < splines.length; i++) {
            if (splines[i].id === args.spline.id) {
              const xs = splines[i].vertices.map(v => v.x);
              const ys = splines[i].vertices.map(v => v.y);

              const splineCalculator = new Spline(xs, ys);
              const result = util.clamp(+splineCalculator.at(args.value).toFixed(splines[i].digits), splines[i].miny, splines[i].maxy);

              const tokens = { result: result };
              const state = { spline: args.spline.id };
              this.log('query completed ', tokens, state);

              this.queryCompletedTrigger.trigger(tokens, state);
              await this.globalDropTokens[args.spline.id].setValue(result);

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
          let splines = this.homey.settings.get('splines');
          if (splines == undefined || splines === null) {
            splines = [];
          }
          resolve(splines);
        });
      });

    let querySplineTimeBasedAction = this.homey.flow.getActionCard('query_spline_time_based');
    querySplineTimeBasedAction
      .registerRunListener(async (args, state) => {
        return new Promise((resolve) => {
          const splines = this.homey.settings.get('splines');
          for (var i = 0; i < splines.length; i++) {
            if (splines[i].id === args.spline.id) {

              try {
                const xs = splines[i].vertices.map(v => v.x);
                const ys = splines[i].vertices.map(v => v.y);

                const now = new Date();
                let value = now.getHours() + (now.getMinutes() / 60) + (now.getSeconds() / 3600);
                value = value / 24 * (splines[i].maxx - splines[i].minx);

                const splineCalculator = new Spline(xs, ys);
                const result = util.clamp(+splineCalculator.at(value).toFixed(splines[i].digits), splines[i].miny, splines[i].maxy);

                const tokens = { result: result };
                const state = { spline: args.spline.id };
                this.log('time based query completed ', tokens, state, value);

                this.queryCompletedTrigger.trigger(tokens, state);
                await this.globalDropTokens[args.spline.id].setValue(result);

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
          let splines = this.homey.settings.get('splines');
          if (splines == undefined || splines === null) {
            splines = [];
          }
          resolve(splines);
        });
      });
  }

  onSettingsChanged(modifiedKey) {
    if (modifiedKey == 'splines') {
      let splines = this.homey.settings.get('splines');
      for (var i = 0; i < splines.length; i++) {
        if (this.globalDropTokens[splines[i].id] == null || this.globalDropTokens[splines[i].id] == undefined) {
          this.globalDropTokens[splines[i].id] = await this.homey.flow.createToken(splines[i].id, {
            type: "number",
            title: splines[i].name
          });
        }
      }
    }
  }

  async liveTest(spline) {
    this.log('live testing ', spline);
    try {
      const xs = spline.vertices.map(v => v.x);
      const ys = spline.vertices.map(v => v.y);

      const value = spline.value / 100 * (spline.maxx - spline.minx);

      const splineCalculator = new Spline(xs, ys);
      const result = util.clamp(+splineCalculator.at(value).toFixed(spline.digits), spline.miny, spline.maxy);

      const tokens = { result: result };
      const state = { spline: spline.id };
      this.log('live testing query completed ', tokens, state);

      this.queryCompletedTrigger.trigger(tokens, state);
      await this.globalDropTokens[spline.id].setValue(result);

      return { error: null, result: result };
    } catch (error) {
      this.log('live testing failed', error);
      return { error: error, result: null };
    }
  }

  getApi() {
    if (!this.api) {
      this.api = HomeyAPI.forCurrentHomey(this.homey);
    }
    return this.api;
  }

}

module.exports = SplinesApp;