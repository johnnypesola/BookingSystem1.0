﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class Resource
    {
        [Required(ErrorMessage = "ResourceId is required.")]
        [Range(0, Int32.MaxValue, ErrorMessage = "ResourceId is out of range.")]
        public int ResourceId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Name must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Count is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "Count is out of range.")]
        public int Count { get; set; }

        [Required(ErrorMessage = "BookingPricePerHour is required.")]
        [Range(0.00, int.MaxValue, ErrorMessage = "BookingPricePerHour is out of range.")]
        public decimal BookingPricePerHour { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginAfterBooking is out of range.")]
        public int MinutesMarginAfterBooking { get; set; }

        [Required(ErrorMessage = "WeekEndCount is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "WeekEndCount is out of range.")]
        public int WeekEndCount { get; set; }
    }
}