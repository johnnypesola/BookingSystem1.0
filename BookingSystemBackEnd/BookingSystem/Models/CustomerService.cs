using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class CustomerService
    {
    // Fields
        private CustomerDAL _customerDAL;

    // Properties
        private CustomerDAL CustomerDAL {
            get {
                return _customerDAL ?? (_customerDAL = new CustomerDAL());
            }
        }

    // Methods
        public void DeleteCustomer(Customer customer)
        {
            DeleteCustomer(customer.CustomerId);
        }

        public void DeleteCustomer(int customerId)
        {
            if(customerId < 0)
            {
                throw new ApplicationException("Ogiltigt kund-id påträffades vid borttagning.");
            }

            // Check that the customer exists before deletion
            Customer customer = CustomerDAL.GetCustomerById(customerId);

            // If there is no customer
            if (customer == null)
            {
                throw new ApplicationException("Kunden är redan borttagen.");
            }
            // If there are bookings using this customer
            else if (customer.TotalBookings > 0)
            {
                throw new ApplicationException(String.Format("Det går inte att ta ta bort kunden '{0}' eftersom det finns bokningar kopplade till den.", customer.Name));
            }
            // If there are child-customers to this customer
            else if (customer.ChildCustomers > 0)
            {
                throw new ApplicationException(String.Format("Det går inte att ta ta bort kunden '{0}' eftersom det finns andra kunder som ingår i denna kund.", customer.Name));
            }

            // Delete customer
            CustomerDAL.DeleteCustomer(customerId);

        }

        public Customer GetCustomer(int customerId)
        {
            if (customerId < 0)
            {
                throw new ApplicationException("Ogiltigt kund-ID påträffades vid hämtning.");
            }

            return CustomerDAL.GetCustomerById(customerId);
        }

        public IEnumerable<Customer> GetCustomers()
        {
            return CustomerDAL.GetCustomers();
        }

        public IEnumerable<Customer> SearchFor(SearchContainer searchContainer)
        {
            return CustomerDAL.SearchFor(searchContainer);
        }

        public IQueryable<Customer> GetCustomersPageWise(string sortColumns, int maximumRows, int startRowIndex, out int TotalRowCount)
        {
            // Calculate correct startpageIndex
            int startPageIndex = (startRowIndex / maximumRows) + 1;

            // Sort columns
            string sortColumnNames = (sortColumns != null ? sortColumns.Split(',')[0] : "");

            // Get customers from DAL
            return CustomerDAL.GetCustomersPageWise(sortColumnNames, maximumRows, startPageIndex, out TotalRowCount).AsQueryable();
        }

        public void SaveCustomer(Customer customer)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if(customer.Validate(out validationResults))
            {
                // If a new customer should be created
                if(customer.CustomerId == 0)
                {
                    CustomerDAL.InsertCustomer(customer);
                }
                // Existing customer should be updated
                else
                {
                    // Check that the customer exists before update
                    if(CustomerDAL.GetCustomerById(customer.CustomerId) == null)
                    {
                        throw new ApplicationException(String.Format("Kunden {0} som skulle uppdateras är tyvärr borttagen.", customer.Name));
                    }

                    // Update existing customer
                    CustomerDAL.UpdateCustomer(customer);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("Kundobjektet innehöll felaktiga värden. Var god försök igen.");
                
                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }
    }
}