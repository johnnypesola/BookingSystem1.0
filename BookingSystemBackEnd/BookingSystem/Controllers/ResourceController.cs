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
    public class ResourceController : ApiController
    {
        // Shared variables
        const string IMAGE_PATH = "Content/upload/img/resource";

        // Set up Service.
        ResourceService resourceService = new ResourceService();

        // GET: api/Resource
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Resource> resources = resourceService.GetResources();

                if (resources == null)
                {
                    return NotFound();
                }

                return Ok(resources);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Resource/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                Resource resource = resourceService.GetResource(id);
                if (resource == null)
                {
                    return NotFound();
                }
                return Ok(resource);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/Resource
        public IHttpActionResult Post(Resource resource)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save resource
            try
            {
                resourceService.SaveResource(resource);
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
            return Ok(resource); //CreatedAtRoute("DefaultApi", new { id = resource.ResourceId }, resource);
        }

        // PUT: api/Resource/5
        public IHttpActionResult Put(Resource resource)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return InternalServerError();
        }

        // DELETE: api/Resource/5
        public IHttpActionResult Delete(int id)
        {
            string UploadImagePath, imageResource;

            try
            {
                // Delete info from database
                resourceService.ResourceDelete(id);

                // Get uploadpath
                UploadImagePath = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", IMAGE_PATH));

                // Build full image path
                imageResource = String.Format("{0}/{1}.jpg", UploadImagePath, id);

                // Remove uploaded file if it exists
                if (File.Exists(@imageResource))
                {
                    File.Delete(@imageResource);
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

        // POST a picture for a resource
        [Route("api/Resource/image/{id:int}")]
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
