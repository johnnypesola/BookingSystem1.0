using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class BookingContainer
    {

        public int BookingId { get; set; }

        public string BookingName { get; set; }

        public int CustomerId { get; set; }

        public int NumberOfPeople { get; set; }

        public bool Provisional { get; set; }

        public string CustomerName { get; set; }

        public string TypeName { get; set; }

        public string Type { get; set; }

        public int TypeId { get; set; }

        public int Count { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public IEnumerable<LocationBooking> LocationBookings { get; set; }
    }
}