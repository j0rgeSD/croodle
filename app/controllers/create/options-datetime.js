import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import moment from 'moment';

@classic
export default class CreateOptionsDatetimeController extends Controller {
  @action
  nextPage() {
    this.normalizeOptions();

    this.transitionToRoute('create.settings');
  }

  @action
  previousPage() {
    this.transitionToRoute('create.options');
  }

  normalizeOptions() {
    const options = this.options;

    // remove all days from options which haven't a time but there is atleast
    // one option with time for that day
    const daysWithTime = options.map((option) => {
      if (moment(option.get('title'), 'YYYY-MM-DD', true).isValid()) {
        return null;
      } else {
        return moment(option.get('title')).format('YYYY-MM-DD');
      }
    }).uniq().filter((option) => option !== null);
    const removeObjects = options.filter((option) => {
      return daysWithTime.indexOf(option.get('title')) !== -1;
    });
    options.removeObjects(
      removeObjects
    );

    // sort options
    // ToDo: Find a better way without reseting the options
    this.set('options', options.sortBy('title'));
  }

  @alias('model.options')
  options;
}
