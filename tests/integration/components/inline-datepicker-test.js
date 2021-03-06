import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inline-datepicker', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders an ember-power-calendar', async function(assert) {
    this.set('noop', () => {});
    await render(hbs`{{inline-datepicker onCenterChange=noop onSelect=noop}}`);

    assert.dom('.ember-power-calendar').exists();
  });
});
