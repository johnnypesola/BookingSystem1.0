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
    public class FurnituringController : ApiController
    {

        // Set up Service.
        FurnituringService furnituringService = new FurnituringService();  

        // GET: api/Furnituring
        public IHttpActionResult Get()
        {
            IEnumerable<Furnituring> furniturings = furnituringService.GetFurniturings();

            if (furniturings == null)
            {
                return NotFound();
            }

            return Ok(furniturings);
        }

        // GET: api/Furnituring/5
        public IHttpActionResult Get(int id)
        {
            Furnituring furnituring = furnituringService.GetFurnituring(id);
            if (furnituring == null)
            {
                return NotFound();
            }
            return Ok(furnituring);
        }

        // POST: api/Furnituring
        public IHttpActionResult Post(Furnituring furnituring)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save furnituring
            try
            {
                furnituringService.SaveFurnituring(furnituring);
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
            return Ok(furnituring); //CreatedAtRoute("DefaultApi", new { id = furnituring.FurnituringId }, furnituring);
        }

        // PUT: api/Furnituring/5
        public IHttpActionResult Put(Furnituring furnituring)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return InternalServerError();
        }

        // DELETE: api/Furnituring/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                furnituringService.FurnituringDelete(id);
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
