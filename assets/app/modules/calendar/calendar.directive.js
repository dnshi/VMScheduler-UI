class CalendarCtrl {
  static $inject = ['$scope', '$element', '$window']

  constructor(...args) {
    [{ reservation: this.reservation }, this.el, this.window] = args;
    setTimeout(() => this.init(), 500);
  }

  init() {
    let {el, window, reservation} = this;
    el
      .fullCalendar({
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        timezone: 'local',
        editable: true,
        selectable: true,
        unselectAuto: false,
        eventRender: (event, element) => {
          console.log(event);
          // let resource = el.fullCalendar('getResourceById', resourceId);
          // console.log(event.start);
          // Add class names
          // console.log(element);
        },
        select: (start, end, event, view, resource) => {
          reservation
            .trigger({start, end, resource})
            .then((evt) => {
              console.log('confirmed');
              this.el.fullCalendar('renderEvent', evt);
            })
            .catch(() => console.log('rejected'))
            .finally(() => this.el.fullCalendar('unselect'));
        },
        eventLimit: true,
        height: window.innerHeight - 75,
        windowResize: () => el.fullCalendar('option', 'height', window.innerHeight - 75),
        header: {
          left: 'prev,next today ',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
          // right: 'timelineDay,timelineThreeDays,agendaWeek,month'
        },
        eventClick: function(calEvent, jsEvent, view) {
          // change the border color just for fun
          // $(this).css('border-color', 'red');
        },
        resourceRender: function(dataTds, headerTd, eventTd) {
          // eventTd.css('background', 'blue');
        },
        // defaultView: 'timelineDay',
        defaultView: 'agendaWeek',
        views: {
          timelineDay: {
            slotLabelFormat: 'h a'
          },
          timelineThreeDays: {
            type: 'timeline',
            duration: { days: 3 }
          }
        },
        eventOverlap: false,
        resourceAreaWidth: '18%',
        resourceColumns: [{
          labelText: 'Virtual Machines',
          width: '5em',
          render({isOnline, name, ip}, el) {
            let label = `<span class="ui ${isOnline ? 'green' : 'grey'} tiny label">${isOnline ? 'online' : 'offline'}</span><span>${name}</span>`;
            el.html(label);
          }
        }],

        resources: [{
          id: 'a',
          ip: '10.0.10.1',
          name: 'Ubuntu',
          isOnline: false,
          eventColor: 'red'
        }, {
          id: 'b',
          ip: '10.0.10.2',
          name: 'Windows7',
          isOnline: true,
          eventColor: 'green',
          eventClassName: 'TESTING'
        }, {
          id: 'c',
          ip: '10.0.10.2',
          name: 'CentOS',
          isOnline: true,
          eventColor: 'orange'
        }, {
          id: 'd',
          ip: '10.0.10.2',
          name: 'Windows8',
          isOnline: true,
          eventColor: 'teal'
        }, {
          id: 'e',
          ip: '10.0.10.2',
          name: 'Debian',
          isOnline: true,
          eventColor: 'purple'
        }, {
          id: 'f',
          ip: '10.0.10.2',
          name: 'Ubuntu',
          isOnline: true,
          eventColor: 'red'
        }, {
          id: 'g',
          ip: '10.0.10.2',
          name: 'Ubuntu',
          isOnline: true,
          eventColor: 'red'
        }],

        events: [
          { id: '1', teamName: 'Diamond', resourceId: 'b', start: moment().utc().format(), title: 'event 1' },
          { id: '2', teamName: 'AX', resourceId: 'c', start: moment().utc().format(), title: 'event 2' },
          { id: '3', teamName: 'AN', resourceId: 'd', start: moment().utc().format(), title: 'event 3' },
          { id: '4', teamName: 'Titanium', resourceId: 'e', start: moment().utc().format(), title: 'event 4' },
          { id: '5', teamName: 'AX', resourceId: 'f', start: moment().utc().format(), title: 'event 5' }
        ]
      });
  }
}

export default () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  template: `<div id="vm-calendar"></div>`,
  scope: false,

  controllerAs: 'calendar',
  controller: CalendarCtrl
});
