using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class LocationDAL : DALBase
    {
        public void DeleteLocation(int locationId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = locationId;

                    // Try to delete location from database.
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public Location GetLocationById(int locationId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = locationId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Get column indexes from known column names. Does not matter if columns change order.
                            int locationIdIndex = reader.GetOrdinal("LocationId");
                            int NameIndex = reader.GetOrdinal("Name");
                            int MaxPeopleIndex = reader.GetOrdinal("MaxPeople");
                            int GPSLongitudeIndex = reader.GetOrdinal("GPSLongitude");
                            int GPSLatitudeIndex = reader.GetOrdinal("GPSLatitude");
                            int ImageSrcIndex = reader.GetOrdinal("ImageSrc");
                            int BookingPricePerHourIndex = reader.GetOrdinal("BookingPricePerHour");
                            int totalBookingsIndex = reader.GetOrdinal("TotalBookings");
                            int totalBookingValueIndex = reader.GetOrdinal("TotalBookingValue");

                            // Create new Location object from database values and return a reference
                            return new Location
                            {
                                LocationId = reader.GetSafeInt32(locationIdIndex),
                                Name = reader.GetSafeString(NameIndex),
                                MaxPeople = reader.GetSafeInt16(MaxPeopleIndex),
                                GPSLongitude = reader.GetSafeDecimal(GPSLongitudeIndex),
                                GPSLatitude = reader.GetSafeDecimal(GPSLatitudeIndex),
                                ImageSrc= reader.GetSafeString(ImageSrcIndex),
                                BookingPricePerHour = reader.GetSafeDecimal(BookingPricePerHourIndex),
                                TotalBookings = reader.GetSafeInt32(totalBookingsIndex),
                                TotalBookingValue = reader.GetSafeDecimal(totalBookingValueIndex)
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

        public Location GetLocationByName(string locationName)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = locationName;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Get column indexes from known column names. Does not matter if columns change order.
                            int locationIdIndex = reader.GetOrdinal("LocationId");
                            int NameIndex = reader.GetOrdinal("Name");
                            int MaxPeopleIndex = reader.GetOrdinal("MaxPeople");
                            int GPSLongitudeIndex = reader.GetOrdinal("GPSLongitude");
                            int GPSLatitudeIndex = reader.GetOrdinal("GPSLatitude");
                            int ImageSrcIndex = reader.GetOrdinal("ImageSrc");
                            int BookingPricePerHourIndex = reader.GetOrdinal("BookingPricePerHour");
                            int totalBookingsIndex = reader.GetOrdinal("TotalBookings");
                            int totalBookingValueIndex = reader.GetOrdinal("TotalBookingValue");

                            // Create new Location object from database values and return a reference
                            return new Location
                            {
                                LocationId = reader.GetSafeInt32(locationIdIndex),
                                Name = reader.GetSafeString(NameIndex),
                                MaxPeople = reader.GetSafeInt16(MaxPeopleIndex),
                                GPSLongitude = reader.GetSafeDecimal(GPSLongitudeIndex),
                                GPSLatitude = reader.GetSafeDecimal(GPSLatitudeIndex),
                                ImageSrc = reader.GetSafeString(ImageSrcIndex),
                                BookingPricePerHour = reader.GetSafeDecimal(BookingPricePerHourIndex),
                                TotalBookings = reader.GetSafeInt32(totalBookingsIndex),
                                TotalBookingValue = reader.GetSafeDecimal(totalBookingValueIndex)
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

        public IEnumerable<Location> GetLocations()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Location> locationsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    locationsReturnList = new List<Location>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationListSimple");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get column indexes from known column names. Does not matter if columns change order.
                        int locationIdIndex = reader.GetOrdinal("LocationId");
                        int NameIndex = reader.GetOrdinal("Name");
                        int MaxPeopleIndex = reader.GetOrdinal("MaxPeople");
                        int GPSLongitudeIndex = reader.GetOrdinal("GPSLongitude");
                        int GPSLatitudeIndex = reader.GetOrdinal("GPSLatitude");
                        int ImageSrcIndex = reader.GetOrdinal("ImageSrc");
                        int BookingPricePerHourIndex = reader.GetOrdinal("BookingPricePerHour");

                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Location object from database values and add to list
                            locationsReturnList.Add(new Location
                            {
                                LocationId = reader.GetSafeInt32(locationIdIndex),
                                Name = reader.GetSafeString(NameIndex),
                                MaxPeople = reader.GetSafeInt16(MaxPeopleIndex),
                                GPSLongitude = reader.GetSafeDecimal(GPSLongitudeIndex),
                                GPSLatitude = reader.GetSafeDecimal(GPSLatitudeIndex),
                                ImageSrc = reader.GetSafeString(ImageSrcIndex),
                                BookingPricePerHour = reader.GetSafeDecimal(BookingPricePerHourIndex)
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    locationsReturnList.TrimExcess();

                    // Return list
                    return locationsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Location> GetLocationsPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Location> locationsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    locationsReturnList = new List<Location>(pageSize);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationList", DALOptions.closedConnection);

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
                        int locationIdIndex = reader.GetOrdinal("LocationId");
                        int NameIndex = reader.GetOrdinal("Name");
                        int MaxPeopleIndex = reader.GetOrdinal("MaxPeople");
                        int GPSLongitudeIndex = reader.GetOrdinal("GPSLongitude");
                        int GPSLatitudeIndex = reader.GetOrdinal("GPSLatitude");
                        int ImageSrcIndex = reader.GetOrdinal("ImageSrc");
                        int BookingPricePerHourIndex = reader.GetOrdinal("BookingPricePerHour");
                        int totalBookingsIndex = reader.GetOrdinal("TotalBookings");
                        int totalBookingValueIndex = reader.GetOrdinal("TotalBookingValue");

                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Location object from database values and add to list
                            locationsReturnList.Add(new Location
                            {
                                LocationId = reader.GetSafeInt32(locationIdIndex),
                                Name = reader.GetSafeString(NameIndex),
                                MaxPeople = reader.GetSafeInt16(MaxPeopleIndex),
                                GPSLongitude = reader.GetSafeDecimal(GPSLongitudeIndex),
                                GPSLatitude = reader.GetSafeDecimal(GPSLatitudeIndex),
                                ImageSrc = reader.GetSafeString(ImageSrcIndex),
                                BookingPricePerHour = reader.GetSafeDecimal(BookingPricePerHourIndex),
                                TotalBookings = reader.GetSafeInt32(totalBookingsIndex),
                                TotalBookingValue = reader.GetSafeDecimal(totalBookingValueIndex)
                            });
                        }
                    }

                    // Get total row count
                    totalRowCount = Convert.ToInt32(cmd.Parameters["@TotalRowCount"].Value);

                    // Remove unused list rows, free memory.
                    locationsReturnList.TrimExcess();

                    // Return list
                    return locationsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertLocation(Location location)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = location.Name;
                    cmd.Parameters.Add("@MaxPeople", SqlDbType.SmallInt).Value = location.MaxPeople;
                    cmd.Parameters.Add("@GPSLongitude", SqlDbType.Decimal).Value = location.GPSLongitude;
                    cmd.Parameters.Add("@GPSLatitude", SqlDbType.Decimal).Value = location.GPSLatitude;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 30).Value = location.ImageSrc;
                    cmd.Parameters.Add("@BookingPricePerHour", SqlDbType.Decimal).Value = location.BookingPricePerHour;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into location object.
                    location.LocationId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateLocation(Location location)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = location.LocationId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = location.Name;
                    cmd.Parameters.Add("@MaxPeople", SqlDbType.SmallInt).Value = location.MaxPeople;
                    cmd.Parameters.Add("@GPSLongitude", SqlDbType.Decimal).Value = location.GPSLongitude;
                    cmd.Parameters.Add("@GPSLatitude", SqlDbType.Decimal).Value = location.GPSLatitude;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 30).Value = location.ImageSrc;
                    cmd.Parameters.Add("@BookingPricePerHour", SqlDbType.Decimal).Value = location.BookingPricePerHour;

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