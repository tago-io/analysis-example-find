'use strict';
const Analysis = require('tago/analysis');
const Utils    = require('tago/utils');
const Device   = require('tago/device');

/**
 * The function presumes that you have a enviroment variable, that can be set in the admin website, in the Analysis configuration:
 * -> device_token: token
 * It's simple get the variable "water_level", prints it to the console, multiple the value by 2 and insert in a new variable called water_level_double.
 * @param  {object} context automatic received from Tago
 */
function run_analysis(context) {
    //Convert the environment variables into an object.
    //You can do this by yourself, we just added an easily way.
    const env_vars  = Utils.env_to_obj(context.environment);

    const my_device = new Device(env_vars.device_token);

    my_device.find({"variable":"water_level", "query":"last_item"}).then((result_array) => {
        //Check if array isn't empty
        if (!result_array[0]) return context.log("Empty Array");

        //query:last_item always return only one value
        const value = result_array[0].value;
        const time = result_array[0].time; //you can format time later

        //print to console
        context.log(`The last record of the water_level is ${value}. It was inserted at ${time}`);

        //Multiple the water_level value by 2 and insert in another variable
        const obj_to_save = {
            "variable": "water_level_double",
            "value": value * 2,
        };

        my_device.insert(obj_to_save).then(context.log("Successfully Inserted")).catch(error => context.log("Error when inserting:", error));

    }).catch(context.log); //just print error
}
module.exports = new Analysis(run_analysis, 'MY-ANALYSIS-TOKEN-HERE');
