﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class BookingDAL : DALBase
    {
        public void DeleteBooking(int bookingId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = bookingId;

                    // Try to delete booking from database.
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public Booking GetBookingById(int bookingId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = bookingId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Booking object from database values and return a reference
                            return new Booking
                            {
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                                CustomerName = reader.GetSafeString(reader.GetOrdinal("CustomerName")),
                                Provisional = reader.GetBoolean(reader.GetOrdinal("Provisional")),
                                NumberOfPeople = reader.GetSafeInt16(reader.GetOrdinal("NumberOfPeople")),
                                Discount = reader.GetSafeDecimal(reader.GetOrdinal("Discount")),
                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),
                                Notes = reader.GetSafeString(reader.GetOrdinal("Notes")),
                                CreatedByUserId = reader.GetSafeInt32(reader.GetOrdinal("CreatedByUserId")),
                                ModifiedByUserId = reader.GetSafeInt32(reader.GetOrdinal("ModifiedByUserId")),
                                ResponsibleUserId = reader.GetSafeInt32(reader.GetOrdinal("ResponsibleUserId"))
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

        public IEnumerable<Booking> GetBookings()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Booking> bookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    bookingsReturnList = new List<Booking>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingList");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Booking object from database values and add to list
                            bookingsReturnList.Add(new Booking
                            {
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                                CustomerName = reader.GetSafeString(reader.GetOrdinal("CustomerName")),
                                Provisional = reader.GetBoolean(reader.GetOrdinal("Provisional")),
                                NumberOfPeople = reader.GetSafeInt16(reader.GetOrdinal("NumberOfPeople")),
                                Discount = reader.GetSafeDecimal(reader.GetOrdinal("Discount")),
                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),
                                Notes = reader.GetSafeString(reader.GetOrdinal("Notes")),
                                CreatedByUserId = reader.GetSafeInt32(reader.GetOrdinal("CreatedByUserId")),
                                ModifiedByUserId = reader.GetSafeInt32(reader.GetOrdinal("ModifiedByUserId")),
                                ResponsibleUserId = reader.GetSafeInt32(reader.GetOrdinal("ResponsibleUserId"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    bookingsReturnList.TrimExcess();

                    // Return list
                    return bookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Booking> GetBookingsPageWise(string sortColumn, int pageSize, int pageIndex, DateTime? startTime = null, DateTime? endTime = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Booking> bookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    bookingsReturnList = new List<Booking>(pageSize);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@SortOrder", SqlDbType.VarChar, 25).Value = sortColumn;
                    cmd.Parameters.Add("@PageIndex", SqlDbType.Int).Value = pageIndex;
                    cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pageSize;
                    cmd.Parameters.Add("@TotalRowCount", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Optional parameters
                    if(startTime != null && endTime != null)
                    {
                        cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = startTime;
                        cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = endTime;
                    }

                    // Open DB connection
                    connection.Open();

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Booking object from database values and add to list
                            bookingsReturnList.Add(new Booking
                            {
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                                CustomerName = reader.GetSafeString(reader.GetOrdinal("CustomerName")),
                                Provisional = reader.GetBoolean(reader.GetOrdinal("Provisional")),
                                NumberOfPeople = reader.GetSafeInt16(reader.GetOrdinal("NumberOfPeople")),
                                Discount = reader.GetSafeDecimal(reader.GetOrdinal("Discount")),
                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),
                                Notes = reader.GetSafeString(reader.GetOrdinal("Notes")),
                                CreatedByUserId = reader.GetSafeInt32(reader.GetOrdinal("CreatedByUserId")),
                                ModifiedByUserId = reader.GetSafeInt32(reader.GetOrdinal("ModifiedByUserId")),
                                ResponsibleUserId = reader.GetSafeInt32(reader.GetOrdinal("ResponsibleUserId"))
                            });
                        }
                    }

                    // Get total row count
                    //totalRowCount = Convert.ToInt32(cmd.Parameters["@TotalRowCount"].Value);

                    // Remove unused list rows, free memory.
                    bookingsReturnList.TrimExcess();

                    // Return list
                    return bookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<BookingContainer> GetBookingsForPeriod(DateTime startTime, DateTime endTime)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<BookingContainer> bookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    bookingsReturnList = new List<BookingContainer>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingsForPeriod", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = startTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = endTime;

                    // Open DB connection
                    connection.Open();

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Booking object from database values and add to list
                            bookingsReturnList.Add(new BookingContainer
                            {
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                BookingName = reader.GetSafeString(reader.GetOrdinal("BookingName")),
                                NumberOfPeople = reader.GetSafeInt16(reader.GetOrdinal("NumberOfPeople")),
                                Provisional = reader.GetBoolean(reader.GetOrdinal("Provisional")),
                                CustomerName = reader.GetSafeString(reader.GetOrdinal("CustomerName")),
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                                TypeName = reader.GetSafeString(reader.GetOrdinal("TypeName")),
                                Type = reader.GetSafeString(reader.GetOrdinal("Type")),
                                TypeId = reader.GetSafeInt32(reader.GetOrdinal("TypeId")),
                                Count = reader.GetSafeInt32(reader.GetOrdinal("Count")),
                                StartTime = reader.GetSafeString(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeString(reader.GetOrdinal("EndTime"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    bookingsReturnList.TrimExcess();

                    // Return list
                    return bookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<CalendarBookingDay> CheckDayBookingsForPeriod(DateTime startTime, DateTime endTime, String type)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    // Declare List of objects
                    List<CalendarBookingDay> calendarBookingDayReturnList;
                    SqlCommand cmd;

                    // Create list object
                    calendarBookingDayReturnList = new List<CalendarBookingDay>(100);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingCheckDays", DALOptions.closedConnection);

                    // Add parameters for Stored procedure
                    cmd.Parameters.Add("@StartTime", SqlDbType.VarChar, 19).Value = startTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.VarChar, 19).Value = endTime;
                    cmd.Parameters.Add("@Type", SqlDbType.VarChar, 10).Value = type;

                    // Open DB connection
                    connection.Open();

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            calendarBookingDayReturnList.Add(
                                new CalendarBookingDay
                                {
                                    // Create new Booking object from database values and add to list
                                    StartTime = reader.GetSafeString(reader.GetOrdinal("StartTime")),
                                    EndTime = reader.GetSafeString(reader.GetOrdinal("EndTime")),
                                    Type = reader.GetSafeString(reader.GetOrdinal("Type"))
                                }
                            );
                        }
                    }

                    // Remove unused list rows, free memory.
                    calendarBookingDayReturnList.TrimExcess();

                    // Return list
                    return calendarBookingDayReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertBooking(Booking booking)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = booking.Name;
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = booking.BookingTypeId;
                    cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = booking.CustomerId;
                    cmd.Parameters.Add("@Provisional", SqlDbType.Bit).Value = booking.Provisional;
                    cmd.Parameters.Add("@NumberOfPeople", SqlDbType.SmallInt).Value = booking.NumberOfPeople;
                    cmd.Parameters.Add("@Discount", SqlDbType.Decimal).Value = booking.Discount;
                    cmd.Parameters.Add("@Notes", SqlDbType.VarChar, 200).Value = booking.Notes;
                    cmd.Parameters.Add("@CreatedByUserId", SqlDbType.Int).Value = booking.CreatedByUserId;
                    cmd.Parameters.Add("@ModifiedByUserId", SqlDbType.Int).Value = booking.ModifiedByUserId;
                    cmd.Parameters.Add("@ResponsibleUserId", SqlDbType.Int).Value = booking.ResponsibleUserId;
                    
                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into booking object.
                    booking.BookingId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateBooking(Booking booking)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = booking.Name;
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = booking.BookingTypeId;
                    cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = booking.CustomerId;
                    cmd.Parameters.Add("@Provisional", SqlDbType.Bit).Value = booking.Provisional;
                    cmd.Parameters.Add("@NumberOfPeople", SqlDbType.SmallInt).Value = booking.NumberOfPeople;
                    cmd.Parameters.Add("@Discount", SqlDbType.Decimal).Value = booking.Discount;
                    cmd.Parameters.Add("@Notes", SqlDbType.VarChar, 200).Value = booking.Notes;
                    cmd.Parameters.Add("@ModifiedByUserId", SqlDbType.Int).Value = booking.ModifiedByUserId;
                    cmd.Parameters.Add("@ResponsibleUserId", SqlDbType.Int).Value = booking.ResponsibleUserId;

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