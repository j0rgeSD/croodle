import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { next } from '@ember/runloop';

export default Component.extend({
  actions: {
    addOption(element) {
      let fragment = this.store.createFragment('option');
      let options = this.options;
      let position = this.options.indexOf(element) + 1;
      options.insertAt(
        position,
        fragment
      );
    },
    deleteOption(element) {
      let position = this.options.indexOf(element);
      this.options.removeAt(position);
    }
  },

  enforceMinimalOptionsAmount() {
    let options = this.options;

    while (options.length < 2) {
      options.pushObject(
        this.store.createFragment('option')
      );
    }
  },

  store: service('store'),

  init() {
    this._super(...arguments);

    // need to delay pushing fragments into options array to prevent
    // > You modified "disabled" twice on <(unknown):ember330> in a single render.
    // error.
    next(() => {
      this.enforceMinimalOptionsAmount();
    });
  }
});
