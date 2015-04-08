using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class CustomerDAL : DALBase
    {
        public void DeleteCustomer(int customerId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_CustomerDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = customerId;

                    // Try to delete customer from database.
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public Customer GetCustomerById(int customerId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_CustomerList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = customerId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Get column indexes from known column names. Does not matter if columns change order.
                            int customerIdIndex = reader.GetOrdinal("CustomerId");
                            int nameIndex = reader.GetOrdinal("Name");
                            int addressIndex = reader.GetOrdinal("Address");
                            int postNumberIndex = reader.GetOrdinal("PostNumber");
                            int cityIndex = reader.GetOrdinal("City");
                            int emailAddressIndex = reader.GetOrdinal("EmailAddress");
                            int phoneNumberIndex = reader.GetOrdinal("PhoneNumber");
                            int cellPhoneNumberIndex = reader.GetOrdinal("CellPhoneNumber");
                            int parentCustomerIdIndex = reader.GetOrdinal("ParentCustomerId");
                            int parentCustomerNameIndex = reader.GetOrdinal("ParentCustomerName");
                            int notesIndex = reader.GetOrdinal("Notes");
                            int totalBookingsIndex = reader.GetOrdinal("TotalBookings");
                            int totalBookingValueIndex = reader.GetOrdinal("TotalBookingValue");
                            int childCustomersIndex = reader.GetOrdinal("ChildCustomers");

                            // Create new Customer object from database values and return a reference
                            return new Customer
                            {
                                CustomerId = reader.GetSafeInt32(customerIdIndex),
                                Name = reader.GetSafeString(nameIndex),
                                Address = reader.GetSafeString(addressIndex),
                                PostNumber = reader.GetSafeString(postNumberIndex),
                                City = reader.GetSafeString(cityIndex),
                                EmailAddress = reader.GetSafeString(emailAddressIndex),
                                PhoneNumber = reader.GetSafeString(phoneNumberIndex),
                                CellPhoneNumber = reader.GetSafeString(cellPhoneNumberIndex),
                                ParentCustomerId = reader.GetSafeInt32(parentCustomerIdIndex),
                                ParentCustomerName = reader.GetSafeString(parentCustomerNameIndex),
                                Notes = reader.GetSafeString(notesIndex),
                                TotalBookings = reader.GetSafeInt32(totalBookingsIndex),
                                TotalBookingValue = reader.GetSafeDecimal(totalBookingValueIndex),
                                ChildCustomers = reader.GetSafeInt32(childCustomersIndex)
                            };
                        }
                    }

                    return null;
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            } // Connection is closed here
        }

        public IEnumerable<Customer> GetCustomers()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Customer> customersReturnList;
                    SqlCommand cmd;

                    // Create list object
                    customersReturnList = new List<Customer>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_CustomerListSimple");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get column indexes from known column names. Does not matter if columns change order.
                        int customerIdIndex = reader.GetOrdinal("CustomerId");
                        int nameIndex = reader.GetOrdinal("Name");
                        int cityIndex = reader.GetOrdinal("City");
                        int parentCustomerIdIndex = reader.GetOrdinal("ParentCustomerId");
                        int parentCustomerNameIndex = reader.GetOrdinal("ParentCustomerName");

                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Customer object from database values and add to list
                            customersReturnList.Add(new Customer
                            {
                                CustomerId = reader.GetSafeInt32(customerIdIndex),
                                Name = reader.GetSafeString(nameIndex),
                                City = reader.GetSafeString(cityIndex),
                                ParentCustomerId = reader.GetSafeInt32(parentCustomerIdIndex),
                                ParentCustomerName = reader.GetSafeString(parentCustomerNameIndex)
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    customersReturnList.TrimExcess();

                    // Return list
                    return customersReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Customer> GetCustomersPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Customer> customersReturnList;
                    SqlCommand cmd;

                    // Create list object
                    customersReturnList = new List<Customer>(pageSize);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_CustomerList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@SortOrder", SqlDbType.VarChar, 25).Value = sortColumn; 
                    cmd.Parameters.Add("@PageIndex", SqlDbType.Int).Value = pageIndex;
                    cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pageSize;
                    cmd.Parameters.Add("@TotalRowCount", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get column indexes from known column names. Does not matter if columns change order.
                        int customerIdIndex = reader.GetOrdinal("CustomerId");
                        int nameIndex = reader.GetOrdinal("Name");
                        int addressIndex = reader.GetOrdinal("Address");
                        int postNumberIndex = reader.GetOrdinal("PostNumber");
                        int cityIndex = reader.GetOrdinal("City");
                        int emailAddressIndex = reader.GetOrdinal("EmailAddress");
                        int phoneNumberIndex = reader.GetOrdinal("PhoneNumber");
                        int cellPhoneNumberIndex = reader.GetOrdinal("CellPhoneNumber");
                        int parentCustomerIdIndex = reader.GetOrdinal("ParentCustomerId");
                        int parentCustomerNameIndex = reader.GetOrdinal("ParentCustomerName");
                        int notesIndex = reader.GetOrdinal("Notes");
                        int totalBookingsIndex = reader.GetOrdinal("TotalBookings");
                        int totalBookingValueIndex = reader.GetOrdinal("TotalBookingValue");

                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Customer object from database values and add to list
                            customersReturnList.Add(new Customer
                            {
                                CustomerId = reader.GetSafeInt32(customerIdIndex),
                                Name = reader.GetSafeString(nameIndex),
                                Address = reader.GetSafeString(addressIndex),
                                PostNumber = reader.GetSafeString(postNumberIndex),
                                City = reader.GetSafeString(cityIndex),
                                EmailAddress = reader.GetSafeString(emailAddressIndex),
                                PhoneNumber = reader.GetSafeString(phoneNumberIndex),
                                CellPhoneNumber = reader.GetSafeString(cellPhoneNumberIndex),
                                ParentCustomerId = reader.GetSafeInt32(parentCustomerIdIndex),
                                ParentCustomerName = reader.GetSafeString(parentCustomerNameIndex),
                                Notes = reader.GetSafeString(notesIndex),
                                TotalBookings = reader.GetSafeInt32(totalBookingsIndex),
                                TotalBookingValue = reader.GetSafeDecimal(totalBookingValueIndex)
                            });
                        }
                    }

                    // Get total row count
                    totalRowCount = Convert.ToInt32(cmd.Parameters["@TotalRowCount"].Value);

                    // Remove unused list rows, free memory.
                    customersReturnList.TrimExcess();

                    // Return list
                    return customersReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertCustomer(Customer customer)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_CustomerCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = customer.Name;
                    cmd.Parameters.Add("@Address", SqlDbType.VarChar, 40).Value = customer.Address;
                    cmd.Parameters.Add("@PostNumber", SqlDbType.VarChar, 6).Value = customer.PostNumber;
                    cmd.Parameters.Add("@City", SqlDbType.VarChar, 30).Value = customer.City;
                    cmd.Parameters.Add("@EmailAddress", SqlDbType.VarChar, 50).Value = customer.EmailAddress;
                    cmd.Parameters.Add("@PhoneNumber", SqlDbType.VarChar, 20).Value = customer.PhoneNumber;
                    cmd.Parameters.Add("@CellPhoneNumber", SqlDbType.VarChar, 20).Value = customer.CellPhoneNumber;
                    cmd.Parameters.Add("@ParentCustomerId", SqlDbType.Int).Value = customer.ParentCustomerId;
                    cmd.Parameters.Add("@Notes", SqlDbType.VarChar, 200).Value = customer.Notes;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into customer object.
                    customer.CustomerId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateCustomer(Customer customer)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_CustomerUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = customer.CustomerId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = customer.Name;
                    cmd.Parameters.Add("@Address", SqlDbType.VarChar, 40).Value = customer.Address;
                    cmd.Parameters.Add("@PostNumber", SqlDbType.VarChar, 6).Value = customer.PostNumber;
                    cmd.Parameters.Add("@City", SqlDbType.VarChar, 30).Value = customer.City;
                    cmd.Parameters.Add("@EmailAddress", SqlDbType.VarChar, 50).Value = customer.EmailAddress;
                    cmd.Parameters.Add("@PhoneNumber", SqlDbType.VarChar, 20).Value = customer.PhoneNumber;
                    cmd.Parameters.Add("@CellPhoneNumber", SqlDbType.VarChar, 20).Value = customer.CellPhoneNumber;
                    cmd.Parameters.Add("@ParentCustomerId", SqlDbType.Int).Value = customer.ParentCustomerId;
                    cmd.Parameters.Add("@Notes", SqlDbType.VarChar, 200).Value = customer.Notes;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }
    }
}