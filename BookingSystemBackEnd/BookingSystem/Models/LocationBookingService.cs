using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class LocationBookingService
    {
        // Fields
        private LocationBookingDAL _locationBookingDAL;

        // Properties
        private LocationBookingDAL LocationBookingDAL
        {
            get
            {
                return _locationBookingDAL ?? (_locationBookingDAL = new LocationBookingDAL());
            }
        }

        public IEnumerable<CalendarBookingDay> CheckDayBookingsForPeriod(DateTime startTime, DateTime endTime)
        {
            return LocationBookingDAL.CheckDayBookingsForPeriod(startTime, endTime);
        }
    }

    /*
     *                 // Check that the location is not allready booked/busy.
                if (BookingDAL.IsLocationBooked(booking))
                {
                    throw new ApplicationException("Lokalen är tyvärr redan bokad under denna tillfälle.");
                }
     */
}