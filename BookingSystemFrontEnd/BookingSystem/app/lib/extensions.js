/**
 * Created by jopes on 2015-04-19.
 */

Date.prototype.getYearsMonthsDays = function () {
    var years = this.getFullYear(),
        months = ('0' + (this.getMonth() + 1)).slice(-2),
        days = ('0' + this.getDate()).slice(-2);

    return years + "-" + months + "-" + days;
};