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
        public IBookingService bookingService;

        // Constructor
        public BookingController(IBookingService testService = null)
        {
            // Set up Service.
            if (testService != null)
            {
                bookingService = testService;
            } else {
                bookingService = new BookingService();
            }
            //bookingService = testService as BookingService ?? new BookingService();
        }

        // GET: api/Booking
        public IHttpActionResult Get()
        {
            IEnumerable<Booking> bookings = bookingService.Get();

            if(bookings == null)
            {
                return NotFound();
            }

            return Ok(bookings);
        }

        // GET: api/Booking/5
        public IHttpActionResult Get(int id)
        {
            Booking booking = bookingService.Get(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        // Get detailed bookings for day
        [Route("api/Booking/day/{date:datetime?}")]
        [AcceptVerbs("GET", "POST")]
        public IHttpActionResult Get(string date)
        {
            DateTime startTime, endTime;

            startTime = Convert.ToDateTime(date).StartOfDay();
            endTime = Convert.ToDateTime(date).EndOfDay();

            IEnumerable<BookingContainer> bookings = bookingService.GetForPeriod(startTime, endTime);

            if (bookings == null)
            {
                return NotFound();
            }
            return Ok(bookings);
        }

        // Get info if there are any bookings for a period
        [Route("api/Booking/period/{fromDate:datetime}/{toDate:datetime}/{type}/{moreOrLess}")]
        [AcceptVerbs("GET", "POST")]
        public IHttpActionResult Get(string fromDate, string toDate, string type, String moreOrLess)
        {
            DateTime startTime, endTime;
            Regex typeRegex;

            startTime = Convert.ToDateTime(fromDate);
            endTime = Convert.ToDateTime(toDate);

            // Try to validate type
            typeRegex = new Regex(ValidationExtensions.BOOKING_TYPE_REGEXP);
            if(!typeRegex.IsMatch(type))
            {
                return NotFound();
            }

            // Check how much data is requested
            if(moreOrLess == "more")
            {
                // Get bookings
                IEnumerable<BookingContainer> bookings = bookingService.GetForPeriod(startTime, endTime);

                if (bookings == null)
                {
                    return NotFound();
                }

                return Ok(bookings);
            }
            else if(moreOrLess == "less")
            {
                // Get bookings
                IEnumerable<CalendarBookingDay> bookings = bookingService.CheckDaysForPeriod(startTime, endTime, type);

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

        // POST api/Booking
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
            return CreatedAtRoute("DefaultApi", new { id = booking.BookingId }, booking);

        }

        // PUT: api/Booking/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Booking/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                bookingService.Delete(id);
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            catch (DataBaseEntryNotFoundException)
            {
                return NotFound();
            }
            catch (ApprovedDataBaseException exception)
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
