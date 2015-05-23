using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookingSystem;
using BookingSystem.Models;

namespace BookingSystem
{
    public interface IBookingService
    {
        void Delete(Booking booking);

        void Delete(int bookingId);

        Booking Get(int bookingId);

        IEnumerable<Booking> Get();

        IQueryable<BookingContainer> GetForPeriod(DateTime startTime, DateTime endTime);

        IEnumerable<CalendarBookingDay> CheckDaysForPeriod(DateTime startTime, DateTime endTime);

        IQueryable<Booking> GetPageWise(string sortColumns, int maximumRows, int startRowIndex);

        void Save(Booking booking);
    }
}
