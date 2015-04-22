/**
 * Created by jopes on 2015-04-19.
 */

Date.prototype.BookingSystemGetYearsMonthsDays = function () {
    var years = this.getFullYear(),
        months = ('0' + (this.getMonth() + 1)).slice(-2),
        days = ('0' + this.getDate()).slice(-2);

    return years + "-" + months + "-" + days;
};

Date.prototype.BookingSystemGetSmallDateTime = function () {
    var years = this.getFullYear(),
        months = ('0' + (this.getMonth() + 1)).slice(-2),
        days = ('0' + this.getDate()).slice(-2),
        hours = ('0' + this.getHours()).slice(-2),
        minutes = ('0' + this.getMinutes()).slice(-2),
        seconds = ('0' + this.getSeconds()).slice(-2);

    return years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + "seconds";
};

Date.prototype.convertDateStringsToDates = function (input) {

    // Regex string
    var regexIso8601 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d$/;

    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) {
            continue;
        }

        // Variable  init
        var match,
            that = this;
            value = input[key];

        // Check for string properties which look like dates.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {

            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {

                tmpDateObj = new Date(milliseconds);

                // Need to to this in order to avoid timezone difference
                input[key] = new Date(
                    tmpDateObj.getUTCFullYear(),
                    tmpDateObj.getUTCMonth(),
                    tmpDateObj.getUTCDate(),
                    tmpDateObj.getUTCHours(),
                    tmpDateObj.getUTCMinutes(),
                    tmpDateObj.getUTCSeconds()
                );
            }
        } else if (typeof value === "object") {
            // Recurse into object
            that.convertDateStringsToDates(value);
        }
    }
};

// Month names
Date.prototype.monthNamesArray = ["Januari", "Februari", "Mars", "April", "Maj", "Juni",
    "Juli", "Augusti", "September", "Oktober", "November", "December"];

// Day names
Date.prototype.dayNamesArray = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

