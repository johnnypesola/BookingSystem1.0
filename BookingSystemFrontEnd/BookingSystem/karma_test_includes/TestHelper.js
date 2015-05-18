/**
 * Created by jopes on 2015-05-01.
 */

// Create Namespaces
    TestHelper = {};
    TestHelper.JSON = {};


    // Method: Generate a promise object for mocked return data.
    TestHelper.addPromiseToObject = function(dataObj, q, mode, message) {
        var deferred, returnValue;

        mode = mode || 'success';
        message = message || '';

        deferred = q.defer();

        if(mode === 'success'){

            deferred.resolve(dataObj);
            returnValue = dataObj;
            returnValue.$promise = deferred.promise;
        }
        else {
            deferred.reject({status: mode, data: {Message: message}});
            returnValue = dataObj;
            returnValue.$promise = deferred.promise;
        }

        return returnValue
    };

    // Test fixtures

        // Bookings
        TestHelper.JSON.getBookings = {"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0};
        TestHelper.JSON.queryBookings = [{"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":10,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":26.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":29,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":5.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":58,"Name":"","BookingTypeId":0,"CustomerId":9,"Provisional":false,"NumberOfPeople":123,"Discount":0.00,"Notes":"En anteckning","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Kajsa Anka","MaxPeople":0,"CalculatedBookingPrice":2.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":60,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":300,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":23.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":61,"Name":"","BookingTypeId":0,"CustomerId":3,"Provisional":false,"NumberOfPeople":20,"Discount":0.00,"Notes":"hej","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Fagersta kommun","MaxPeople":0,"CalculatedBookingPrice":98.0,"TotalBookingValue":0.0,"PayMethodId":0}];
        TestHelper.JSON.queryMoreForPeriodBookings = [{"StartTime":"2015-04-01T00:00:00","EndTime":"2015-04-01T00:00:00","Type":"location"}];
        TestHelper.JSON.queryLessForPeriodBookings = [{"StartTime":"2015-01-01T00:00:00","EndTime":"2015-01-01T23:00:00","Type":"resource"},{"StartTime":"2015-01-02T00:00:00","EndTime":"2015-01-02T23:00:00","Type":"resource"},{"StartTime":"2015-04-01T00:00:00","EndTime":"2015-04-01T00:00:00","Type":"location"},{"StartTime":"2015-10-01T00:00:00","EndTime":"2015-10-01T00:00:00","Type":"meal"}];
        TestHelper.JSON.queryDayBookings = [{"BookingId":7,"BookingName":"","CustomerId":1,"NumberOfPeople":10,"Provisional":false,"CustomerName":"Atlas Copco","TypeName":"Whiteboard","Type":"Resource","TypeId":3,"Count":5,"StartTime":"2015-01-01T00:00:00","EndTime":"2015-01-01T23:00:00"}];

        // Furnituring
        TestHelper.JSON.getFurnituring = {"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0};
        TestHelper.JSON.queryFurnituring = [{"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":10,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":26.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":29,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":5.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":58,"Name":"","BookingTypeId":0,"CustomerId":9,"Provisional":false,"NumberOfPeople":123,"Discount":0.00,"Notes":"En anteckning","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Kajsa Anka","MaxPeople":0,"CalculatedBookingPrice":2.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":60,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":300,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":23.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":61,"Name":"","BookingTypeId":0,"CustomerId":3,"Provisional":false,"NumberOfPeople":20,"Discount":0.00,"Notes":"hej","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Fagersta kommun","MaxPeople":0,"CalculatedBookingPrice":98.0,"TotalBookingValue":0.0,"PayMethodId":0}];

        // Location
        TestHelper.JSON.getLocation = {"LocationId":21,"Name":"Bergsvillan","MaxPeople":50,"GPSLatitude":59.990940951137354,"GPSLongitude":15.807547867298126,"ImageSrc":"Content/upload/img/location/21.jpg","BookingPricePerHour":2000.00,"MinutesMarginAfterBooking":0,"TotalBookings":1,"TotalBookingValue":0.0};
        TestHelper.JSON.queryLocation = [{"LocationId":21,"Name":"Bergsvillan","MaxPeople":50,"GPSLatitude":59.990940951137354,"GPSLongitude":15.807547867298126,"ImageSrc":"Content/upload/img/location/21.jpg","BookingPricePerHour":2000.00,"MinutesMarginAfterBooking":0,"TotalBookings":1,"TotalBookingValue":0.0},{"LocationId":24,"Name":"Brukscafét","MaxPeople":10,"GPSLatitude":60.005199064712158,"GPSLongitude":15.792786329984663,"ImageSrc":"","BookingPricePerHour":500.00,"MinutesMarginAfterBooking":0,"TotalBookings":0,"TotalBookingValue":0.0}];
        TestHelper.JSON.queryForLocation = [{"LocationId":21,"FurnituringId":19,"MaxPeople":0,"LocationName":"Bergsvillan","FurnituringName":"Ommöbleringar"}]

        // Customer
        TestHelper.JSON.getCustomer = {"CustomerId":1,"Name":"Atlas Copco","Address":null,"PostNumber":null,"City":"FAGERSTA","EmailAddress":null,"PhoneNumber":null,"CellPhoneNumber":null,"ParentCustomerId":0,"ParentCustomerName":"","Notes":null,"TotalBookings":0,"TotalBookingValue":0.0,"ChildCustomers":0};
        TestHelper.JSON.queryCustomer = [{"CustomerId":1,"Name":"Atlas Copco","Address":null,"PostNumber":null,"City":"FAGERSTA","EmailAddress":null,"PhoneNumber":null,"CellPhoneNumber":null,"ParentCustomerId":0,"ParentCustomerName":"","Notes":null,"TotalBookings":0,"TotalBookingValue":0.0,"ChildCustomers":0},{"CustomerId":16,"Name":"Del av Atlas Copco","Address":null,"PostNumber":null,"City":"FAGERSTA","EmailAddress":null,"PhoneNumber":null,"CellPhoneNumber":null,"ParentCustomerId":1,"ParentCustomerName":"Atlas Copco","Notes":null,"TotalBookings":0,"TotalBookingValue":0.0,"ChildCustomers":0},{"CustomerId":4,"Name":"Ett namn","Address":null,"PostNumber":null,"City":"FAGERSTA","EmailAddress":null,"PhoneNumber":null,"CellPhoneNumber":null,"ParentCustomerId":0,"ParentCustomerName":"","Notes":null,"TotalBookings":0,"TotalBookingValue":0.0,"ChildCustomers":0}];

        // Resource
        TestHelper.JSON.getResource = {"ResourceId":4,"Name":"Testresursen","Count":10,"BookingPricePerHour":10.00,"MinutesMarginAfterBooking":0,"WeekEndCount":10,"TotalBookings":0,"TotalBookingValue":0.0};
        TestHelper.JSON.queryResource = [{"ResourceId":4,"Name":"Testresursen","Count":10,"BookingPricePerHour":10.00,"MinutesMarginAfterBooking":0,"WeekEndCount":10,"TotalBookings":0,"TotalBookingValue":0.0},{"ResourceId":5,"Name":"Testresursen5","Count":10,"BookingPricePerHour":10.00,"MinutesMarginAfterBooking":0,"WeekEndCount":10,"TotalBookings":0,"TotalBookingValue":0.0},{"ResourceId":2,"Name":"Vaktmästare","Count":2,"BookingPricePerHour":1000.00,"MinutesMarginAfterBooking":20,"WeekEndCount":0,"TotalBookings":0,"TotalBookingValue":0.0},{"ResourceId":3,"Name":"Whiteboard","Count":10,"BookingPricePerHour":100.00,"MinutesMarginAfterBooking":15,"WeekEndCount":0,"TotalBookings":1,"TotalBookingValue":0.0}];

