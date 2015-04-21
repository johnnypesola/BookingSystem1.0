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