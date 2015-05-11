using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystem.Models;
using System.Web.Http.Cors;
using System.Data;
using System.Drawing;
using System.IO;
using System.Web;

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

        // POST a picture for a location
        [Route("api/Location/image/{id:int}")]
        [AcceptVerbs("POST")]
        [HttpPost]
        public IHttpActionResult Post(int id)
        {
            MemoryStream ms;
            string base64string;
            byte[] bytes;
            Image image;
            const string IMAGE_PATH = "Content/upload/img/location";
            string UploadImagePath;

            base64string = Request.Content.ReadAsStringAsync().Result;

            try
            {
                bytes = Convert.FromBase64String(base64string);

                using (ms = new MemoryStream(bytes))
                {
                    image = Image.FromStream(ms);

                    if (
                        image.Width > 400 ||
                        image.Height > 400 ||
                        image.Width < 10 ||
                        image.Height < 10
                       )
                    {
                        throw new BadImageFormatException();
                    }

                    UploadImagePath = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", IMAGE_PATH));

                    image.Save(String.Format("{0}/{1}.jpg", UploadImagePath, id), System.Drawing.Imaging.ImageFormat.Jpeg);
                }
            }
            catch
            {
                return BadRequest();
            }

            return Ok(String.Format("{0}.jpg", id));
        }
    }
}
