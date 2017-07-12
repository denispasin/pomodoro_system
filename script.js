// setTimeout(function, milliseconds, param1, param2, ...)

// setInterval()

// clearInterval()

function StopWatch(settings) {
  // this.minuteField =
  // this.secondField =
  this.settings = settings;
  this.minutes = settings.work_minutes;
  this.seconds = 0
  this.work_mode = true;
}

StopWatch.prototype = {
  removeOneSecond: function() {
    this.seconds -= 1;
    if(this.seconds < 0) {
      this.minutes -= 1;
      this.seconds = 59;
    }
    if(this.minutes < 0) {
      this.pause();
      if(this.work_mode) {
        this.minutes = this.settings.break_minutes;
      }
      else {
        this.minutes = this.settings.work_minutes;
      }
      this.work_mode = !this.work_mode;
      this.seconds = 0;
      this.start();
    }
    this.updateTimer();
  },
  reset: function() {
    this.pause();
    this.minutes = this.settings.work_minutes;
    this.seconds = 0
    this.updateTimer();
    this.work_mode = true;
  },
  timerNotRunning: function() {
    return this.interval === undefined || this.interval === null;
  },
  start: function() {
    if(this.timerNotRunning()) {
      this.interval = setInterval(this.removeOneSecond.bind(this), 1000);
    }
  },
  pause: function() {
    clearInterval(this.interval);
    this.interval = null;
  },
  updateTimer : function() {
    var minutesToPrint = this.add_zero(this.minutes);
    var secondsToPrint = this.add_zero(this.seconds);
    $('#minutes').text(minutesToPrint);
    $('#seconds').text(secondsToPrint);
    var titleLetter = "B"
    if(this.work_mode) {
      titleLetter = "W"
    }
    document.title = titleLetter + " => " + minutesToPrint + " : " + secondsToPrint;

  },
  add_zero : function(num) {
    if(num < 10) {num = "0"+num; }
    return num
  },

}

function Settings() {
  this.work_minutes = 25;
  this.break_minutes = 5;
}

Settings.prototype = {
  add_work_minutes : function() {
    if(this.work_minutes < 60) {
      this.work_minutes += 1;
    }
    this.updateTimer();
  },
  remove_work_minutes : function() {
    if(this.work_minutes > 0)  {
      this.work_minutes -= 1;
    }
    this.updateTimer();
  },
  add_break_minutes : function() {
    if(this.break_minutes < 60) {
      this.break_minutes += 1;
    }
    this.updateTimer();
  },
  remove_break_minutes : function() {
    if(this.break_minutes > 0)  {
      this.break_minutes -= 1;
    }
    this.updateTimer();
  },
  updateTimer : function() {
    $('#work_minutes').text(this.work_minutes);
    $('#break_minutes').text(this.break_minutes);
  },
}

var settings = new Settings();
var stopWatch = new StopWatch(settings);
$('#start').on('click', function(event) {
  event.preventDefault();
  if(stopWatch.timerNotRunning()) {
    stopWatch.removeOneSecond.bind(stopWatch)();
    stopWatch.start.bind(stopWatch)();
  }
});
$('#pause').on('click', function(event) {
  stopWatch.pause.bind(stopWatch)();
});
$('#reset').on('click', stopWatch.reset.bind(stopWatch));
$('#work_up').on('click', settings.add_work_minutes.bind(settings));
$('#work_down').on('click', settings.remove_work_minutes.bind(settings));
$('#break_up').on('click', settings.add_break_minutes.bind(settings));
$('#break_down').on('click', settings.remove_break_minutes.bind(settings));

stopWatch.updateTimer();
