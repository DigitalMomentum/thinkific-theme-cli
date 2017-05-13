
'use strict';

var path = require('path');
var fs = require('fs');
var command_path = path.resolve(__dirname, '..', 'commands');

var config_file = '.thinkific_config';

var command_runner = function (command, args) {
  var mod = require(path.resolve(command_path, command));
  var opts = mod.options;
  if(opts.hasOwnProperty('validate_args')) {
    opts.validate_args(args);
  }
  mod.run(args);
}

var validate_command = function(command) {
  return fs.existsSync(path.resolve(command_path, command + '.js'));
};

var get_config_path = function() {
  return path.resolve(process.env.HOME, config_file);
}

var get_config_data = function(){
  var config = {};
  // load previous credentials (if applicable)
  try {
    config = JSON.parse(fs.readFileSync(get_config_path(), 'utf8'));
  } catch (e) {}
  return config;
}

var set_config_data = function(data, callback) {
  var json_data = JSON.stringify(data)
  fs.writeFile(get_config_path(), json_data, callback);
};


var get_available_command_files = function() {
  return fs.readdirSync(command_path);
};

module.exports = {
  validate_command: validate_command,
  command_runner: command_runner,
  get_available_command_files: get_available_command_files,
  get_config_data: get_config_data,
  set_config_data: set_config_data
}