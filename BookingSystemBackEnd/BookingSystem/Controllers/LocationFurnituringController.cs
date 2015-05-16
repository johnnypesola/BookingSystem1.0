using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BookingSystem.Models;
using System.Data;

namespace BookingSystem.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LocationFurnituringController : ApiController
    {
        // Set up Service.
        LocationFurnituringService locationFurnituringService = new LocationFurnituringService();

        // GET: api/LocationFurnituring
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<LocationFurnituring> locationFurniturings = locationFurnituringService.GetLocationFurniturings();

                if (locationFurniturings == null)
                {
                    return NotFound();
                }

                return Ok(locationFurniturings);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/LocationFurnituring/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                LocationFurnituring locationFurnituring = locationFurnituringService.GetLocationFurnituring(id);
                if (locationFurnituring == null)
                {
                    return NotFound();
                }
                return Ok(locationFurnituring);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/LocationFurnituring
        public IHttpActionResult Post(LocationFurnituring locationFurnituring)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save locationFurnituring
            try
            {
                locationFurnituringService.SaveLocationFurnituring(locationFurnituring);
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
            return Ok(locationFurnituring); //CreatedAtRoute("DefaultApi", new { id = locationFurnituring.LocationFurnituringId }, locationFurnituring);
        }

        // PUT: api/LocationFurnituring/5
        public IHttpActionResult Put(LocationFurnituring locationFurnituring)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return InternalServerError();
        }

        // DELETE: api/LocationFurnituring/5
        [Route("api/LocationFurnituring/{LocationId:int}/{FurnituringId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int LocationId, int FurnituringId)
        {
            try
            {
                // Delete info from database
                locationFurnituringService.LocationFurnituringDelete(LocationId, FurnituringId);
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

        /*
        // GET: api/LocationFurnituring
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/LocationFurnituring/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/LocationFurnituring
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/LocationFurnituring/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/LocationFurnituring/5
        public void Delete(int id)
        {
        }
         */
    }
}
