﻿using System;
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
        public IBookingService bookingService;
        public LocationBookingService locationBookingService;

        // Constructor
        public BookingController()
        {
            bookingService = new BookingService();
            locationBookingService = new LocationBookingService();
        }

        // Constructor for testing (mocking service)
        public BookingController(IBookingService testService = null)
        {
            // Set up Service.
            if (testService != null)
            {
                bookingService = testService;
            } else {
                bookingService = new BookingService();
            }
        }

        // GET: api/Booking
        [Route("api/Booking")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Booking> bookings = bookingService.Get();

                if (bookings == null)
                {
                    return NotFound();
                }

                return Ok(bookings);
            }
            catch
            {
                return InternalServerError();
            }
            
        }

        // GET: api/Booking/5
        [Route("api/Booking/{BookingId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int BookingId)
        {
            try
            {
                // Get booking
                Booking booking = bookingService.Get(BookingId);

                if (booking == null)
                {
                    return NotFound();
                }

                // Create list to cointain location bookings
                booking.LocationBookings = new List<LocationBooking>(50);

                // Get all location bookings
                booking.LocationBookings = locationBookingService.GetLocationBookings(booking.BookingId);

                return Ok(booking);
            }
            catch
            {
                return InternalServerError();
            }
            
        }

        // Get detailed bookings for day
        /*
        [Route("api/Booking/day/{date:datetime?}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(string date)
        {
            DateTime startTime, endTime;

            try
            {
                startTime = Convert.ToDateTime(date).StartOfDay();
                endTime = Convert.ToDateTime(date).EndOfDay();

                IEnumerable<Booking> bookings = bookingService.GetForPeriod(startTime, endTime);

                if (bookings == null)
                {
                    return NotFound();
                }
                return Ok(bookings);
            }
            catch
            {
                return InternalServerError();
            }
            
        }
        */
         
        // Get info if there are any bookings for a period
        [Route("api/Booking/period/{fromDate:datetime}/{toDate:datetime}/{moreOrLess}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(string fromDate, string toDate, String moreOrLess)
        {
            DateTime startTime, endTime;

            try
            {
                startTime = Convert.ToDateTime(fromDate);
                endTime = Convert.ToDateTime(toDate);

                // Check how much data is requested
                if (moreOrLess == "more")
                {
                    // Get bookings
                    IEnumerable<Booking> bookings = bookingService.GetForPeriod(startTime, endTime);

                    if (bookings == null)
                    {
                        return NotFound();
                    }

                    // Get location bookings for bookings.
                    foreach (Booking booking in bookings)
                    {
                        // Create list to cointain location bookings
                        booking.LocationBookings = new List<LocationBooking>(50);

                        // Get all location bookings
                        booking.LocationBookings = locationBookingService.GetLocationBookings(booking.BookingId);
                    }

                    return Ok(bookings);
                }
                else if (moreOrLess == "less")
                {
                    // Get bookings
                    IEnumerable<CalendarBookingDay> bookings = bookingService.CheckDaysForPeriod(startTime, endTime);

                    if (bookings == null)
                    {
                        return NotFound();
                    }

                    return Ok(bookings);
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST api/Booking
        [Route("api/Booking")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(Booking booking)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Try to save booking
            try
            {
                bookingService.Save(booking);
            }
            catch
            {
                return InternalServerError();
            }

            // Respond that the booking was created and redirect
            return Ok(booking);  //CreatedAtRoute("DefaultApi", new { id = booking.BookingId }, booking);

        }

        // DELETE: api/Booking/5
        [Route("api/Booking/{BookingId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingId)
        {
            try
            {
                bookingService.Delete(BookingId);
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            catch (DataBaseEntryNotFoundException)
            {
                return NotFound();
            }
            catch (ApprovedException exception)
            {
                return BadRequest(exception.Message);
            }
            catch
            {
                return InternalServerError();
            }

            return Ok();
        }

    }
}
