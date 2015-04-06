using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models.BLL
{
    public class Booking
    {
        public class Booking
        {
            [Required(ErrorMessage = "BokningsId måste anges.")]
            [Range(0, int.MaxValue, ErrorMessage = "BokningsId befinner sig utanför gränsvärdena.")]
            public int BookingId { get; set; }

            [Required(ErrorMessage = "KundId måste anges.")]
            [Range(0, int.MaxValue, ErrorMessage = "KundId befinner sig utanför gränsvärdena.")]
            public int CustomerId { get; set; }

            [Required(ErrorMessage = "Lokalid måste anges.")]
            [Range(0, int.MaxValue, ErrorMessage = "LokalId befinner sig utanför gränsvärdena.")]
            public int LocationId { get; set; }

            [Required(ErrorMessage = "Startdatum måste anges.")]
            [StringLength(10, ErrorMessage = "Startdatum får inte överstiga 10 tecken.")]
            [RegularExpression(ValidationExtensions.DATE_REGEXP, ErrorMessage = "Startdatum måste ha följande format: 'ÅÅÅÅ-MM-DD'")]
            public string StartDate { get; set; }

            [Required(ErrorMessage = "Starttid måste anges.")]
            [StringLength(5, ErrorMessage = "Starttid får inte överstiga 5 tecken.")]
            [RegularExpression(ValidationExtensions.TIME_REGEXP, ErrorMessage = "Starttid måste ha följande format: 'TT:MM'")]
            public string StartTime { get; set; }

            [Required(ErrorMessage = "Slutdatum måste anges.")]
            [StringLength(10, ErrorMessage = "Slutdatum får inte överstiga 10 tecken.")]
            [RegularExpression(ValidationExtensions.DATE_REGEXP, ErrorMessage = "Slutdatum måste ha följande format: 'ÅÅÅÅ-MM-DD'")]
            public string EndDate { get; set; }

            [Required(ErrorMessage = "Sluttid måste anges.")]
            [StringLength(5, ErrorMessage = "Sluttid får inte överstiga 5 tecken.")]
            [RegularExpression(ValidationExtensions.TIME_REGEXP, ErrorMessage = "Sluttid måste ha följande format: 'TT:MM'")]
            public string EndTime { get; set; }

            [Required(ErrorMessage = "Antal personer måste anges.")]
            //        [IsLessOrEqualThan("MaxPeople")]
            [Range(0, 32767, ErrorMessage = "Antal personer är utanför gränsvärdena.")]
            public int NumberOfPeople { get; set; }

            [Range(0, 1, ErrorMessage = "Rabatt är utanför gränsvärderna.")]
            public decimal Discount { get; set; }

            [StringLength(200, ErrorMessage = "Anteckningar får inte överstiga 200 tecken.")]
            [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Anteckningar får endast innehåll alfanumreriska tecken och följande specialtecken: &_-.,@")]
            public string Notes { get; set; }

            // Extra datafields retrieved from database
            [StringLength(50, ErrorMessage = "Kundnamn får inte överstiga 50 tecken.")]
            public string CustomerName { get; set; }

            [StringLength(50, ErrorMessage = "Lokalnamn får inte överstiga 10 tecken.")]
            public string LocationName { get; set; }

            [Range(0, 32767, ErrorMessage = "Max antal personer är utanför gränsvärdena.")]
            public int MaxPeople { get; set; }

            public decimal CalculatedBookingPrice { get; set; }

            public decimal TotalBookingValue { get; set; }
        }
    }
}