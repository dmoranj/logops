var Benchmark = require('benchmark');
var logops = require('../');
var bunyan = require('bunyan');

var nullStream = {
  write: function() {}
};

var logopsLogger;
function setupLogops() {
  logops.getContext = function() {
    return {
      name: 'myapp',
      hostname: 'jmendiaraMac.hi.inet',
      pid: 12321
    };
  };
  logops.format = logops.formatters.json;
  logops.stream = nullStream;
  logops.setLevel('info');
  logopsLogger = logops;
}

var bunyanLogger;
function setupBunyan() {
  bunyanLogger = bunyan.createLogger({
    name: 'myapp',
    stream: nullStream
  });
  bunyanLogger.level('info')
}

setupLogops();
setupBunyan();

new Benchmark.Suite('Basic logging')
    .add('logops', function() {
      logopsLogger.info({custom: 'field'}, 'This is a String');
    })
    .add('bunyan', function() {
      bunyanLogger.info({custom: 'field'}, 'This is a String');
    })
    // add listeners
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('%s: Fastest is %s', this.name, this.filter('fastest').map('name'));
    })
    .run({ 'async': false });

new Benchmark.Suite('Disabled logging')
    .add('logops', function() {
      logopsLogger.debug({custom: 'field'}, 'This is a String');
    })
    .add('bunyan', function() {
      bunyanLogger.debug({custom: 'field'}, 'This is a String');
    })
    // add listeners
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('%s: Fastest is %s', this.name, this.filter('fastest').map('name'));
    })
    .run({ 'async': false });

