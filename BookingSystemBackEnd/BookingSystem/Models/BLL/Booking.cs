using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class Booking
    {
        [Required(ErrorMessage = "BokningsId måste anges.")]
        [Range(0, int.MaxValue, ErrorMessage = "BokningsId befinner sig utanför gränsvärdena.")]
        public int BookingId { get; set; }

        [StringLength(50, ErrorMessage = "Namn får inte överstiga 50 tecken.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Namnet får endast innehåll alfanumreriska tecken och följande specialtecken: &_-.,@")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Bokningstyp Id måste anges.")]
        [Range(0, int.MaxValue, ErrorMessage = "Bokningstyp Id:t befinner sig utanför gränsvärdena.")]
        public int BookingTypeId { get; set; }

        [Required(ErrorMessage = "Kund Id måste anges.")]
        [Range(0, int.MaxValue, ErrorMessage = "KundId befinner sig utanför gränsvärdena.")]
        public int CustomerId { get; set; }

        [Required(ErrorMessage = "Värde för preliminärbokning måste anges.")]
        public bool Provisional { get; set; }

        [Required(ErrorMessage = "Antal personer måste anges.")]
        [Range(0, 32767, ErrorMessage = "Antal personer är utanför gränsvärdena.")]
        public int NumberOfPeople { get; set; }

        [Range(0, 1, ErrorMessage = "Rabatt är utanför gränsvärderna.")]
        public decimal Discount { get; set; }

        [StringLength(200, ErrorMessage = "Anteckningar får inte överstiga 200 tecken.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Anteckningar får endast innehåll alfanumreriska tecken och följande specialtecken: &_-.,@")]
        public string Notes { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Skapad av AnvändarId:t befinner sig utanför gränsvärdena.")]
        public int CreatedByUserId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Redigerad av AnvändarId:t befinner sig utanför gränsvärdena.")]
        public int ModifiedByUserId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Ansvarig AnvändarId:t befinner sig utanför gränsvärdena.")]
        public int ResponsibleUserId { get; set; }

        // Extra datafields retrieved from database/stored procedure
        [StringLength(50, ErrorMessage = "Kundnamn får inte överstiga 50 tecken.")]
        public string CustomerName { get; set; }

        [Range(0, 32767, ErrorMessage = "Max antal personer är utanför gränsvärdena.")]
        public int MaxPeople { get; set; }

        public decimal CalculatedBookingPrice { get; set; }

        public decimal TotalBookingValue { get; set; }
    }
}