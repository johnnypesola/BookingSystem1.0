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
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CustomerController : ApiController
    {
        // Set up Service.
        CustomerService customerService = new CustomerService();

        // GET: api/Customer
        [Route("api/Customer")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Customer> customers = customerService.GetCustomers();

                if (customers == null)
                {
                    return NotFound();
                }

                return Ok(customers);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Customer/5
        [Route("api/Customer/{CustomerId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int CustomerId)
        {
            try
            {
                Customer customer = customerService.GetCustomer(CustomerId);
                if (customer == null)
                {
                    return NotFound();
                }
                return Ok(customer);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/Customer
        [Route("api/Customer")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(Customer customer)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save customer
            try
            {
                customerService.SaveCustomer(customer);
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
            return Ok(customer); //CreatedAtRoute("DefaultApi", new { id = customer.CustomerId }, customer);
        }

        // DELETE: api/Customer/5
        [Route("api/Customer/{CustomerId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int CustomerId)
        {
            try
            {
                customerService.DeleteCustomer(CustomerId);
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
