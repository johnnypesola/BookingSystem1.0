using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystem.Models;
using System.Web.Http.Cors;
using System.Text.RegularExpressions;

namespace BookingSystem.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BookingController : ApiController
    {
        // Set up Service.
        BookingService bookingService = new BookingService();       

        // GET single booking
        //api/Booking/[id]
        public IHttpActionResult GetBooking(int id)
        {
            Booking booking = bookingService.GetBooking(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        // GET all bookings
        //api/Booking
        public IHttpActionResult GetAllBookings()
        {
            IEnumerable<Booking> bookings = bookingService.GetBookings();

            if(bookings == null)
            {
                return NotFound();
            }

            return Ok(bookings);
        }

        // Get detailed bookings for day
        [Route("api/Booking/day/{date:datetime?}")]
        [AcceptVerbs("GET", "POST")]
        public IHttpActionResult Get(string date)
        {
            DateTime startTime, endTime;

            startTime = Convert.ToDateTime(date).StartOfDay();
            endTime = Convert.ToDateTime(date).EndOfDay();

            IEnumerable<BookingContainer> bookings = bookingService.GetBookingsForPeriod(startTime, endTime);

            if (bookings == null)
            {
                return NotFound();
            }
            return Ok(bookings);
        }

        // Get info if there are any bookings for a period
        [Route("api/Booking/period/{fromdate:datetime}/{todate:datetime}/{type}")]
        [AcceptVerbs("GET", "POST")]
        public IHttpActionResult Get(string fromdate, string todate, string type)
        {
            DateTime startTime, endTime;
            Regex typeRegex;

            startTime = Convert.ToDateTime(fromdate);
            endTime = Convert.ToDateTime(todate);

            // Try to validate type
            typeRegex = new Regex(ValidationExtensions.BOOKING_TYPE_REGEXP);
            if(!typeRegex.IsMatch(type))
            {
                return NotFound();
            }

            // Get bookings
            var bookings = bookingService.CheckDayBookingsForPeriod(startTime, endTime, type);
            if (bookings == null)
            {
                return NotFound();
            }
            return Ok(bookings);
        }
    }
}
