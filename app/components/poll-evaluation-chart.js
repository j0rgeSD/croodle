import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { isArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import moment from 'moment';

const addArrays = function() {
  let args = Array.prototype.slice.call(arguments);
  let basis = args.shift();
  if (!isArray(basis)) {
    return [];
  }

  args.forEach(function(array) {
    array.forEach(function(value, index) {
      if (isPresent(value)) {
        basis[index] = basis[index] + value;
      }
    });
  });

  return basis;
};

@classic
export default class PollEvaluationChart extends Component {
  @service
  intl;

  @computed
  get chartOptions() {
    return {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            callback(value) {
              return `${value} %`;
            },
            max: 100,
            min: 0
          }
        }]
      },
      tooltips: {
        mode: 'label',
        callbacks: {
          label(tooltipItem, data) {
            let { datasets } = data;
            let { datasetIndex } = tooltipItem;
            let { label } = datasets[datasetIndex];
            let value = tooltipItem.yLabel;
            return `${label}: ${value} %`;
          }
        }
      }
    }
  }

  @computed('users.[]', 'options.{[],each.title}', 'currentLocale')
  get data() {
    let labels = this.options.map((option) => {
      let value = get(option, 'title');
      if (!this.isFindADate) {
        return value;
      }

      let hasTime = value.length > 10; // 'YYYY-MM-DD'.length === 10
      let momentFormat = hasTime ? 'LLLL' : this.momentLongDayFormat;
      let timezone = this.timezone;
      let date = hasTime && isPresent(timezone) ? moment.tz(value, timezone) : moment(value);
      date.locale(this.currentLocale);
      return date.format(momentFormat);
    });

    let datasets = [];
    let participants = this.users.length;

    let yes = this.users.map(({ selections }) => {
      return selections.map(({ type }) => type === 'yes' ? 1 : 0);
    });
    datasets.push({
      label: this.intl.t('answerTypes.yes.label').toString(),
      backgroundColor: 'rgba(151,187,205,0.5)',
      borderColor: 'rgba(151,187,205,0.8)',
      hoverBackgroundColor: 'rgba(151,187,205,0.75)',
      hoverBorderColor: 'rgba(151,187,205,1)',
      data: addArrays.apply(this, yes).map((value) => Math.round(value / participants * 100))
    });

    if (this.answerType === 'YesNoMaybe') {
      let maybe = this.users.map(({ selections }) => {
        return selections.map(({ type }) => type === 'maybe' ? 1 : 0);
      });
      datasets.push({
        label: this.intl.t('answerTypes.maybe.label').toString(),
        backgroundColor: 'rgba(220,220,220,0.5)',
        borderColor: 'rgba(220,220,220,0.8)',
        hoverBackgroundColor: 'rgba(220,220,220,0.75)',
        hoverBorderColor: 'rgba(220,220,220,1)',
        data: addArrays.apply(this, maybe).map((value) => Math.round(value / participants * 100))
      });
    }

    return {
      datasets,
      labels
    };
  }

  @readOnly('poll.answerType')
  answerType;

  @readOnly('intl.primaryLocale')
  currentLocale;

  @readOnly('poll.isFindADate')
  isFindADate;

  @readOnly('poll.options')
  options;

  @readOnly('poll.users')
  users;
}
