using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BookingSystem.Models
{
    [Serializable]
    public class Location
    {
        [Required(ErrorMessage = "LokalId måste anges.")]
        [Range(0, int.MaxValue, ErrorMessage = "LokalId befinner sig utanför gränsvärdena.")]
        public int LocationId { get; set; }

        [Required(ErrorMessage = "Namn måste anges.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Namn får endast innehåll alfanumreriska tecken och följande specialtecken: &_-.,@")]
        [StringLength(50, ErrorMessage = "Namn får inte överstiga 50 tecken.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "MaxPersoner måste anges.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "MaxPersoner befinner sig utanför gränsvärdena.")]
        public int MaxPeople { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        [Range(-86, 86, ErrorMessage = "GPSLatitude is out of range.")]
        public decimal GPSLatitude { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        [Range(-180, 180, ErrorMessage = "GPSLongitude is out of range.")]
        public decimal GPSLongitude { get; set; }

        [StringLength(30, ErrorMessage = "Bildsökvägen får inte överstiga 30 tecken.")]
        [RegularExpression(ValidationExtensions.IMG_PATH_REGEXP, ErrorMessage = "Bildsökvägen är inte giltig")]
        public string ImageSrc { get; set; }

        [Required(ErrorMessage = "Bokningspris per timme måste anges.")]
        [Range(0.00, int.MaxValue, ErrorMessage = "Bokningspris per timme befinner sig utanför gränsvärdena.")]
        public decimal BookingPricePerHour { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "Marginalminuter efter bokning befinner sig utanför gränsvärdena.")]
        public decimal MinutesMarginAfterBooking { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public int TotalBookings { get; set; }

        [DataType(DataType.Currency)]
        public decimal TotalBookingValue { get; set; }

    }
}