var schedule = {
  initialize: function () {
    schedule.activities.set();
  },
  options: {
    schedule: '#schedule',
    breaks: [5, 5, 10, 20, 10, 20, 10, 5, 5], // breaks duration
    s_breaks: [475, 525, 575, 630, 695, 750, 815, 870, 920], // the time after which the break begins
    lesson_time: 60, // lesson duration (minutes)
    lessons: 15, // number of lessons per week
    start: function () { // start at 7.10 
      return schedule.general.toMin(9, 40)
    },
    end: function () { // start at 16.10 
      return schedule.general.toMin(23, 00)
    },
    h_width: $('.s-hour-row').width(), // get a width of hour div
    minToPx: function () { // divide the box width by the duration of one lesson
      return schedule.options.h_width / schedule.options.lesson_time;
    },
  },
  general: {
    hoursRegEx: function (hours) {
      var regex = /([0-9]{1,2}).([0-9]{1,2})-([0-9]{1,2}).([0-9]{1,2})/;
      if (regex.test(hours)) {
        return true;
      } else {
        return false;
      }

    },
    toMin: function (hours, minutes, string) {
      // change time format (10,45) to minutes (645)
      if (!string) {
        return (hours * 60) + minutes;
      }

      if (string.length > 0) {
        // "7.10"
        var h = parseInt(string.split('.')[0]),
          m = parseInt(string.split('.')[1]);

        return schedule.general.toMin(h, m);
      }
    },
    getPosition: function (start, duration, end) {
      var translateX = (start - schedule.options.start()) * schedule.options.minToPx(),
        width = duration * schedule.options.minToPx(),
        breaks = schedule.options.breaks,
        s_breaks = schedule.options.s_breaks;

      $.each(breaks, function (index, item) {
        if (start < s_breaks[index] && duration > item && end > (s_breaks[index] + item)) {
          width -= item * schedule.options.minToPx();
        }
        if (start > s_breaks[index] && duration > item && end > (s_breaks[index] + item)) {
          translateX -= item * schedule.options.minToPx();
        }
      });

      return [translateX, width];
    }
  },
  activities: {
    find: function (week, hours, id) {

    },
    delete: function (week, hours) {
      /* week: 0-4 << remove all activities from a day 
         hours: "7.10-16.10" << remove all activities from a choosed hours
      */
      function finalize(message) {
        if (confirm(message)) {
          return true;
        }
      }

      if (week && !hours) {
        if (finalize("Do you want to delete all activities on the selected day?")) {
          $('.s-activities .s-act-row:eq(' + week + ')').empty();
        }
      }

      if (!week && !hours) {
        console.log('Error. You have to add variables like a week (0-4) or hours ("9.10-10.45")!')
      }
      // if day is not defined and hours has got a correct form
      if (!week && schedule.general.hoursRegEx(hours)) {

        console.log('Week not defined and hours are defined!');

        $(schedule.options.schedule + ' .s-act-tab').each(function (i, v) {
          var t = $(this), // get current tab
            name = t.children('.s-act-name').text(), // get tab name
            h = t.attr('data-hours').split('-'), // get tab hours
            s = schedule.general.toMin(0, 0, h[0]), // get tab start time (min)
            e = schedule.general.toMin(0, 0, h[1]), // get tab end time (min)
            uh = hours.split('-'), // user choosed time
            us = schedule.general.toMin(0, 0, uh[0]), // user choosed start time (min)
            ue = schedule.general.toMin(0, 0, uh[1]); // user choosed end time (min)

          if (us <= s && ue >= e) {
            $(this).remove();
          }

        })

      }

      if (week && hours) {
        // if week and hours is defined 
        console.log('Week is defined and hours are defined too!');

        $('#schedule .s-act-row:eq(' + week + ') .s-act-tab').each(function (i, v) {
          var t = $(this), // get current tab
            name = t.children('.s-act-name').text(), // get tab name
            h = t.attr('data-hours').split('-'), // get tab hours
            s = schedule.general.toMin(0, 0, h[0]), // get tab start time (min)
            e = schedule.general.toMin(0, 0, h[1]), // get tab end time (min)
            uh = hours.split('-'), // user choosed time
            us = schedule.general.toMin(0, 0, uh[0]), // user choosed start time (min)
            ue = schedule.general.toMin(0, 0, uh[1]); // user choosed end time (min)

          if (us <= s && ue >= e) {
            $(this).remove();
          }

        })


      };

    },
    add: function (week, lesson, hours, classroom, group, teacher, color) {
      /* EXAMPLES --> week: 0-4, lesson: "Math", hours: "9.45-12.50", 
      classroom: 145, group: "A", teacher: "A. Badurski", color: "orange" */
      var tab = "<div class='s-act-tab " + color + "' data-hours='" + hours + "'>\
            <div class='s-act-name'>"+ lesson + "</div>\
            <div class='s-wrapper'>\
              <div class='s-act-teacher'>"+ teacher + "</div>\
              <div class='s-act-room'>"+ classroom + "</div>\
              <div class='s-act-group'>"+ group + "</div>\
            </div>\
          </div>";
      $('.s-activities .s-act-row:eq(' + week + ')').append(tab);
      schedule.activities.set();
    },
    set: function () {
      $(schedule.options.schedule + ' .s-act-tab').each(function (i) {
        var hours = $(this).attr('data-hours').split("-"),
          start = /* HOURS */ parseInt(hours[0].split(".")[0] * 60)
            + /* MINUTES */ parseInt(hours[0].split(".")[1]),
          end = /* HOURS */ parseInt(hours[1].split(".")[0] * 60)
            + /* MINUTES */ parseInt(hours[1].split(".")[1]),
          duration = end - start,
          translateX = schedule.general.getPosition(start, duration, end)[0],
          width = schedule.general.getPosition(start, duration, end)[1];

        $(this)
          .attr({ "data-start": start, "data-end": end })
          .css({ "transform": "translateX(" + translateX + "px)", "width": width + "px" });
      });
    }
  }

}
schedule.initialize();

var day = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var date = new Date();
var weekday = date.getDay();

var MSPinIS = [2, 2, 3]
var OSystem = [1, 3, 2, 2]
var KBaseD = [0, 3, 1]
var DPinIS = [2, 1]
var ISMandM = [1, 1, 1, 1]

var lesson_schedule = [15, 20]

function daily_schedule() {

  for (let i = 0; i < day.length; i++) {
    if (i <= 8) {
      continue
    }
    else {
      day[i] = 0
    }
  }

  //   Время на посешение пар
  for (let i = lesson_schedule[0]; i < lesson_schedule[1] + 1; i++) {
    day[i] = 3;
  }

  //   Время для перекуса
  if (day[13] == 0) {
    day[13] = 2
  }
  else if (day[12] == 0) {
    day[12] = 2
  }
  if (day[20] == 0) {
    day[20] = 2
  }
  else if (day[21] == 0) {
    day[21] = 2
  }

  //   Время для выполнения Лабораторок
  var starttime;
  var endtime;
  if (weekday == 1) {
    let temp = 0
    for (let i = 0; i < MSPinIS.length; i++) {
      if (temp) {
        break
      }
      if (MSPinIS[i] != 0) {
        temp = 1
        starttime = 0
        endtime = 0
        for (let j = 0; j < MSPinIS.length; j++) {
          for (let k = 10; k < day.length; k++) {
            if (day[k] == 0) {
              day[k] = 4;
              endtime = starttime
              starttime = k;
              break
            }
          }
        }
        schedule.activities.add(weekday, "МРЗвИС", `${starttime} - ${endtime}`, (starttime + starttime), "Высокая", "В.П. Ивашенко", "blue");
      }

    }
  }
  if (weekday == 2) {
    let temp = 0
    for (let i = 0; i < OSystem.length; i++) {
      if (temp) {
        break
      }
      if (OSystem[i] != 0) {
        temp = 1
        starttime = 0
        endtime = 0
        for (let j = 0; j < OSystem[i]; j++) {
          for (let k = 9; k < day.length; k++) {
            if (day[k] == 0) {
              day[k] = 4;
              endtime = starttime
              starttime = k;
              break
            }
          }
          if (endtime == 0) {
            endtime = starttime + 1;
          }
        }
        console.log(starttime)
        console.log(endtime)
        var score = starttime + starttime;
        
        schedule.activities.add(0, "ОС", "10.00-12.00", 2, "Легкая", "М.В. Ковалёв", "blue");
      }
    }
  }
  if (weekday == 3) {
    let temp = 0
    for (let i = 0; i < KBaseD.length; i++) {
      if (temp) {
        break
      }
      if (KBaseD[i] != 0) {
        temp = 1
        starttime = 0
        endtime = 0
        for (let j = 0; j < KBaseD[i]; j++) {
          for (let k = 10; k < day.length; k++) {
            if (day[k] == 0) {
              day[k] = 4;
              endtime = starttime
              starttime = k;
              break
            }
          }
        }
        schedule.activities.add(weekday, "ПБЗ", `${starttime} - ${endtime}`, (starttime + starttime), "Средняя", "Д.В. Шункевич", "green");
      }
    }
  }
  if (weekday == 4) {
    let temp = 0
    for (let i = 0; i < DPinIS.length; i++) {
      if (temp) {
        break
      }
      if (DPinIS[i] != 0) {
        temp = 1
        starttime = 0
        endtime = 0
        for (let j = 0; j < DPinIS[i]; j++) {
          for (let k = 10; k < day.length; k++) {
            if (day[k] == 0) {
              day[k] = 4;
              endtime = starttime
              starttime = k;
              break
            }
          }
        }
        schedule.activities.add(weekday, "ППвИС", `${starttime} - ${endtime}`, (starttime + starttime), "Высокая", "А. Баснина", "blue");
      }
    }
  }
  if (weekday == 5) {
    let temp = 0
    for (let i = 0; i < ISMandM.length; i++) {
      if (temp) {
        break
      }
      if (ISMandM[i] != 0) {
        temp = 1
        starttime = 0
        endtime = 0
        for (let j = 0; j < ISMandM[i]; j++) {
          for (let k = 10; k < day.length; k++) {
            if (day[k] == 0) {
              day[k] = 4;
              endtime = starttime
              starttime = k;
              break
            }
          }
        }
        schedule.activities.add(weekday, "СиМОИБ", `${starttime} - ${endtime}`, (starttime + starttime), "Высокая", "В.В. Захаров", "pink");
      }
    }
  }
  if (weekday == 6) {
    let temp = 0
    for (let i = 0; i < MSPinIS.length; i++) {
      if (temp) {
        break
      }
      if (MSPinIS[i] != 0) {
        temp = 1
        starttime = 0
        endtime = 0
        for (let j = 0; j < MSPinIS[i]; j++) {
          for (let k = 10; k < day.length; k++) {
            if (day[k] == 0) {
              day[k] = 4;
              endtime = starttime
              starttime = k;
              break
            }
          }
        }
        schedule.activities.add(weekday, "МРЗвИС", `${starttime} - ${endtime}`, (starttime + starttime), "Высокая", "В.П. Ивашенко", "blue");
      }
    }
  }
  // if (weekday == 7) {

  // }

}
daily_schedule();


