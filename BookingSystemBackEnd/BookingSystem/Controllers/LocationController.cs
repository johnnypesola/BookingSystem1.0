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
    public class LocationController : ApiController
    {
        // Set up Service.
        LocationService locationService = new LocationService();  

        // GET: api/Location
        public IHttpActionResult Get()
        {
            IEnumerable<Location> locations = locationService.GetLocations();

            if (locations == null)
            {
                return NotFound();
            }

            return Ok(locations);
        }

        // GET: api/Location/5
        public IHttpActionResult Get(int id)
        {
            Location location = locationService.GetLocation(id);
            if (location == null)
            {
                return NotFound();
            }
            return Ok(location);
        }

        // POST: api/Location
        public IHttpActionResult Post(Location location)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save location
            try
            {
                locationService.SaveLocation(location);
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

            // Respond that the booking was created and redirect
            return Ok(location); //CreatedAtRoute("DefaultApi", new { id = location.LocationId }, location);
        }

        // PUT: api/Location/5
        public IHttpActionResult Put(Location location)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return InternalServerError();
        }

        // DELETE: api/Location/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                locationService.LocationDelete(id);
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
