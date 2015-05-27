/**
 * Created by jopes on 2015-04-19.
 */

$BookSysUtil = {};

// Date functions
    $BookSysUtil.Date = {};

    $BookSysUtil.Date.convertStringsToDates = function (input) {

        // Regex string
        //var regexIso8601 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d$/;
        var regexIso8601 = /(\d{4})-([01]\d)-([0-3]\d)T([0-2]\d):([0-5]\d):([0-5]\d)$/;

        // Ignore things that aren't objects.
        if (typeof input !== "object") return input;

        for (var key in input) {
            if (!input.hasOwnProperty(key)) {
                continue;
            }

            // Variable  init
            var that = this,
                value = input[key];

            // Check for string properties which look like dates.
            if (typeof value === "string" && (value.match(regexIso8601))) {

                // Use Moment lib to convert date string to date object
                input[key] = moment(value);

            } else if (typeof value === "object") {

                // Recurse into object
                that.convertStringsToDates(value);
            }
        }
    };

// String functions
    $BookSysUtil.String = {};

    // Add leading zero
    $BookSysUtil.String.addLeadingZero = function(str){
        return ("0" + str).slice(-2);
    };