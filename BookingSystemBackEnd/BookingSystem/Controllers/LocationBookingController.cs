using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystem.Models;
using System.Web.Http.Cors;
using System.Data;

namespace BookingSystem.Controllers
{
    public class LocationBookingBookingController : ApiController
    {
        
        // Set up Service.
        LocationBookingService locationBookingService = new LocationBookingService();  

        // GET: api/LocationBooking
        [Route("api/LocationBooking")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<LocationBooking> locationBookings = locationBookingService.GetLocationBookings();

                if (locationBookings == null)
                {
                    return NotFound();
                }

                return Ok(locationBookings);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/LocationBooking/5
        [Route("api/LocationBooking/{LocationBookingId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int LocationBookingId)
        {
            try
            {
                LocationBooking locationBooking = locationBookingService.GetLocationBooking(LocationBookingId);
                if (locationBooking == null)
                {
                    return NotFound();
                }
                return Ok(locationBooking);
            }
            catch
            {
                return InternalServerError();
            }
            
        }

        // POST: api/LocationBooking
        [Route("api/LocationBooking")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(LocationBooking locationBooking)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save locationBooking
            try
            {
                locationBookingService.SaveLocationBooking(locationBooking);
            }
            catch (DataBaseEntryNotFoundException)
            {
                return NotFound();
            }
            catch (DuplicateNameException)
            {
                return Conflict();
            }
            catch (ApprovedException exception)
            {
                return BadRequest(exception.Message);
            }
            catch
            {
                return InternalServerError();
            }

            // Respond that the booking was created and redirect
            return Ok(locationBooking); //CreatedAtRoute("DefaultApi", new { id = locationBooking.LocationBookingId }, locationBooking);
        }

        // DELETE: api/LocationBooking/5
        [Route("api/LocationBooking/{LocationBookingId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int LocationBookingId)
        {
            try
            {
                locationBookingService.LocationBookingDelete(LocationBookingId);
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
