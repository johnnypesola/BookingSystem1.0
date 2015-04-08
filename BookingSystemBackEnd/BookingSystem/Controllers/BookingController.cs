using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystem.Models;

namespace BookingSystem.Controllers
{
    public class BookingController : ApiController
    {
        // Set up Service.
        BookingService bookingService = new BookingService();       

        // GET single booking
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
        public IHttpActionResult GetAllBookings()
        {
            var bookings = bookingService.GetBookings();

            if(bookings == null)
            {
                return NotFound();
            }

            return Ok(bookings);
        }
    }
}
