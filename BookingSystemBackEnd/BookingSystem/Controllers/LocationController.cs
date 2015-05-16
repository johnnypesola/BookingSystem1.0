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
using Newtonsoft.Json.Linq;

namespace BookingSystem.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LocationController : ApiController
    {
        // Shared variables
        const string IMAGE_PATH = "Content/upload/img/location";

        // Set up Service.
        LocationService locationService = new LocationService();

        // GET: api/Location
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Location> locations = locationService.GetLocations();

                if (locations == null)
                {
                    return NotFound();
                }

                return Ok(locations);
            }
            catch
            {
                return InternalServerError();
            }
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
        /*
        public IHttpActionResult Put(Location location)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return InternalServerError();
        }
         */

        // DELETE: api/Location/5
        public IHttpActionResult Delete(int id)
        {
            string UploadImagePath, imageLocation;

            try
            {
                // Delete info from database
                locationService.LocationDelete(id);
                
                // Get uploadpath
                UploadImagePath = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", IMAGE_PATH));

                // Build full image path
                imageLocation = String.Format("{0}/{1}.jpg", UploadImagePath, id);

                // Remove uploaded file if it exists
                if(File.Exists(@imageLocation))
                {
                    File.Delete(@imageLocation);
                }
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
            string UploadImagePath;
            JObject returnData;

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
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            // Build return JSON object
            returnData = JObject.Parse(String.Format("{{ 'imgpath' : '{0}/{1}.jpg'}}", IMAGE_PATH, id));

            // Return path to uploaded image
            return Ok(returnData);
        }
    }
}
