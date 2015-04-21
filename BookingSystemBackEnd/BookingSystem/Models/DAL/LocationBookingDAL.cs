using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class LocationBookingDAL : DALBase
    {
        public bool IsLocationBooked(Booking booking)
        {
         
            
            //// Create connection object
            //using (this.CreateConnection())
            //{
            //    try
            //    {
            //        SqlCommand cmd;

            //        // Connect to database and execute given stored procedure
            //        cmd = this.Setup("appSchema.usp_LocationBookedCheck", DALOptions.closedConnection);

            //        // Add parameters for Stored procedure
            //        if (booking.BookingId > 0)
            //        {
            //            cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = booking.BookingId;
            //        }
            //        cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = booking.LocationId;
            //        cmd.Parameters.Add("@StartDate", SqlDbType.VarChar, 10).Value = booking.StartDate;
            //        cmd.Parameters.Add("@StartTime", SqlDbType.VarChar, 5).Value = booking.StartTime;
            //        cmd.Parameters.Add("@EndDate", SqlDbType.VarChar, 10).Value = booking.EndDate;
            //        cmd.Parameters.Add("@EndTime", SqlDbType.VarChar, 5).Value = booking.EndTime;

            //        // Open DB connection
            //        connection.Open();

            //        // Get and evaluate response from stored procedure
            //        object returnValue = cmd.ExecuteScalar();

            //        if (returnValue.ToString() == "1")
            //        {
            //            return true;
            //        }

            //        return false;
            //    }
            //    catch
            //    {
            //        throw new ApplicationException(DAL_ERROR_MSG);
            //    }
            //}

            return false;
        }

        public IEnumerable<CalendarBookingDay> CheckDayBookingsForPeriod(DateTime startTime, DateTime endTime)
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
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = startTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = endTime;


                    // Open DB connection
                    connection.Open();

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get column indexes from known column names. Does not matter if columns change order.
                        int StarTimeIndex = reader.GetOrdinal("StartTime");
                        int EndTimeIndex = reader.GetOrdinal("EndTime");

                        // Get all data rows
                        while (reader.Read())
                        {
                            calendarBookingDayReturnList.Add(
                                new CalendarBookingDay
                                {
                                    // Create new Booking object from database values and add to list
                                    StartTime = reader.GetSafeDateTime(StarTimeIndex),
                                    EndTime = reader.GetSafeDateTime(EndTimeIndex)
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
    }
}