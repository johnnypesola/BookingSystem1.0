using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BookingSystem
{
    public class DataBaseEntryNotFoundException : Exception
    {
        public DataBaseEntryNotFoundException(){}

        public DataBaseEntryNotFoundException(string message)
            : base(message){}

        public DataBaseEntryNotFoundException(string message, Exception inner)
            : base(message, inner){}
    }

    public class ApprovedDataBaseException : Exception
    {
        public ApprovedDataBaseException() { }

        public ApprovedDataBaseException(string message)
            : base(message) { }

        public ApprovedDataBaseException(string message, Exception inner)
            : base(message, inner) { }
    }
}