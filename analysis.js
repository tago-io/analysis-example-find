const Analysis = require('tago/analysis');
const Utils    = require('tago/utils');
const Device   = require('tago/device');

// To run this analysis you need to add a device token to the environment variables,
// To do that, go to your device, then token and copy your token.
// Go the the analysis, then environment variables, 
// add a new one and type device_token on key, and paste your token on value

// This analysis reads the last value of the variable "water_level"
// then the analysis multiplies the value by two and posts it as water_level_double

// The function myAnalysis will run when you execute your analysis
function myAnalysis(context) {
  // reads the values from the environment and saves it in the variable env_vars
  const env_vars = Utils.env_to_obj(context.environment);

  const device = new Device(env_vars.device_token);

  // create the filter options to get the data from Tago
  const filter = {
    variable: 'water_level',
    query: 'last_item',
  };

  device.find(filter).then((result_array) => {
    // Check if the array is not empty
    if (!result_array[0]) return context.log('Empty Array');

    // query:last_item always returns only one value
    const value = result_array[0].value;
    const time = result_array[0].time;

    // print to the console at Tago
    context.log(`The last record of the water_level is ${value}. It was inserted at ${time}`);

    // Multiplies the water_level value by 2 and inserts it in another variable
    const obj_to_save = {
      variable: 'water_level_double',
      value: value * 2,
    };

    device.insert(obj_to_save).then(context.log('Successfully Inserted')).catch(error => context.log('Error when inserting:', error));

  }).catch(context.log); //just prints the error to the console at Tago
}

// The analysis token in only necessary to run the analysis outside Tago
module.exports = new Analysis(myAnalysis, 'MY-ANALYSIS-TOKEN-HERE');
