using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystem.Models;
using System.Web.Http.Cors;

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
            var booking = bookingService.GetBooking(id);
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
            var bookings = bookingService.GetBookings();

            if(bookings == null)
            {
                return NotFound();
            }

            return Ok(bookings);
        }

        [Route("api/Booking/day/{date:datetime?}")]
        [AcceptVerbs("GET", "POST")]
        public IHttpActionResult Get(string date)
        {
            DateTime startTime, endTime;

            startTime = Convert.ToDateTime(date).StartOfDay();
            endTime = Convert.ToDateTime(date).EndOfDay();

            var bookings = bookingService.GetBookingsForPeriod(startTime, endTime);
            if (bookings == null)
            {
                return NotFound();
            }
            return Ok(bookings);

            //return "hello " + date;

        }
    }
}
