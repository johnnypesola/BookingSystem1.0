USE [master]
GO
/****** Object:  Database [BookingSystem]    Script Date: 2015-05-27 03:09:19 ******/
CREATE DATABASE [BookingSystem]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'BookingSystem', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\BookingSystem.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'BookingSystem_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\BookingSystem_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [BookingSystem] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BookingSystem].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BookingSystem] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BookingSystem] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BookingSystem] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BookingSystem] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BookingSystem] SET ARITHABORT OFF 
GO
ALTER DATABASE [BookingSystem] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [BookingSystem] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BookingSystem] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BookingSystem] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BookingSystem] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BookingSystem] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BookingSystem] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BookingSystem] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BookingSystem] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BookingSystem] SET  DISABLE_BROKER 
GO
ALTER DATABASE [BookingSystem] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BookingSystem] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BookingSystem] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BookingSystem] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BookingSystem] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BookingSystem] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BookingSystem] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BookingSystem] SET RECOVERY FULL 
GO
ALTER DATABASE [BookingSystem] SET  MULTI_USER 
GO
ALTER DATABASE [BookingSystem] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BookingSystem] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BookingSystem] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BookingSystem] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [BookingSystem] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'BookingSystem', N'ON'
GO
USE [BookingSystem]
GO
/****** Object:  User [appUser]    Script Date: 2015-05-27 03:09:19 ******/
CREATE USER [appUser] FOR LOGIN [appUser] WITH DEFAULT_SCHEMA=[appSchema]
GO
/****** Object:  DatabaseRole [appRole]    Script Date: 2015-05-27 03:09:19 ******/
CREATE ROLE [appRole]
GO
ALTER ROLE [appRole] ADD MEMBER [appUser]
GO
/****** Object:  Schema [appSchema]    Script Date: 2015-05-27 03:09:19 ******/
CREATE SCHEMA [appSchema]
GO
/****** Object:  UserDefinedFunction [appSchema].[IsEnoughResources]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[IsEnoughResources](

	-- Required parameters
	@ResourceId int,
	@Count smallint,

	-- Optional parameter
	@ExceptionBookingId int = 0
)
RETURNS int
AS
BEGIN

	DECLARE @BookedCount smallint
	DECLARE @MaxCount smallint

	-- Get Maxcount of total available resources
	SET @MaxCount = (SELECT [Count]
						FROM [appSchema].[Resource] 
						WHERE ResourceId = @ResourceId)

	-- Get current total booked resource count
	SET @BookedCount = (SELECT SUM(ResourceCount)
						FROM [appSchema].[ResourceBooking]
						WHERE ResourceId = @ResourceId
						AND BookingId != @ExceptionBookingId)
	
	-- If previous statement didnt return anything, set value to 0
	IF (@BookedCount IS NULL)
		BEGIN
			SET @BookedCount = 0;
		END

	-- If given resource count surpasses the available free resource count.
	IF (@Count + @BookedCount > @MaxCount)
		BEGIN
			-- Return false
			RETURN 0
		END

	-- Return true
	RETURN 1
		
END


GO
/****** Object:  UserDefinedFunction [appSchema].[IsLocationAlreadyBooked]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [appSchema].[IsLocationAlreadyBooked](

	-- Required parameters
	@LocationId int,
	@StartTime smalldatetime,
	@EndTime smalldatetime,

	-- Optional parameter
	@ExceptionBookingId int = 0
)
RETURNS bit
AS
BEGIN
    DECLARE @TemporaryTable TABLE (LocationBookingId int) 

	-- Try to get bookings that interferes with period and location
	INSERT @TemporaryTable
		SELECT LocationBookingId 
				FROM appSchema.LocationBooking 
				WHERE
					LocationId = @LocationId AND
					StartTime < @EndTime AND EndTime > @EndTime OR
					LocationId = @LocationId AND
					StartTime < @StartTime AND EndTime > @StartTime OR
					LocationId = @LocationId AND
					StartTime >= @StartTime AND EndTime <= @EndTime 

	-- Save rowcount, in case it magically disappeares after use.
	DECLARE @rowcount INT = @@ROWCOUNT

	-- If more than one booking is found
	IF (@rowcount > 1)
		BEGIN
			RETURN 1
		END
	
	-- If one booking is found, but its the wrong one.
	IF (@rowcount = 1 AND (SELECT LocationBookingId FROM @TemporaryTable) != @ExceptionBookingId )
		BEGIN
			RETURN 1
		END
	
	-- No booking was found, or one exception booking was found. Location is free for booking
	RETURN 0
END


GO
/****** Object:  UserDefinedFunction [appSchema].[IsValidEmail]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[IsValidEmail](
	@EmailAddress varchar(255)
)
RETURNS bit
AS
BEGIN
RETURN
( 
	SELECT 
		CASE 
			WHEN	-- Check for invalid characters and NULL
					@EmailAddress IS NULL OR
					charindex(' ', @EmailAddress) <> 0 OR
					charindex('/', @EmailAddress) <> 0 OR 
					charindex(':', @EmailAddress) <> 0 OR 
					charindex(';', @EmailAddress) <> 0 OR

					-- Check for '%._' at end of string
					len(@EmailAddress)-1 <= charindex('.', @EmailAddress)  OR

					-- Check for marformed @ or double dots
					@EmailAddress LIKE '%@%@%' OR 
					@EmailAddress LIKE '%..%' OR 

					-- General check
					@EmailAddress NOT LIKE '%@%.%'
			THEN 0 
		ELSE 1
	END
)
END


GO
/****** Object:  Table [appSchema].[Location]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[Location](
	[LocationId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[MaxPeople] [smallint] NOT NULL,
	[GPSPosition] [geography] NULL,
	[ImageSrc] [varchar](50) NULL,
	[BookingPricePerHour] [decimal](12, 2) NOT NULL,
	[MinutesMarginAfterBooking] [smallint] NOT NULL CONSTRAINT [DF_Location_MinutesMarginAfterBooking]  DEFAULT ((0)),
	[ParentLocationId] [int] NULL,
 CONSTRAINT [PK_Location] PRIMARY KEY CLUSTERED 
(
	[LocationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UN_Name] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  UserDefinedFunction [appSchema].[GetLocationBookingPrice]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[GetLocationBookingPrice](
	@StartTime smalldatetime, 
	@EndTime smalldatetime,
	@LocationId int,
	@BookingId int
)
RETURNS decimal(12,2)
WITH SCHEMABINDING
AS
BEGIN

	DECLARE @Price decimal(12,2) = 0.00;
	
	SELECT @Price = (CAST(DATEDIFF(minute, @StartTime, @EndTime) AS decimal(12,2)) / 60.00) * CAST(Location.BookingPricePerHour AS decimal(12,2))
	FROM appSchema.Location
	WHERE LocationId = @LocationId
	
	RETURN @Price;
	
END


GO
/****** Object:  Table [appSchema].[LocationBooking]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [appSchema].[LocationBooking](
	[LocationBookingId] [int] IDENTITY(1,1) NOT NULL,
	[BookingId] [int] NOT NULL,
	[LocationId] [int] NOT NULL,
	[FurnituringId] [smallint] NULL,
	[StartTime] [smalldatetime] NOT NULL,
	[EndTime] [smalldatetime] NOT NULL,
	[NumberOfPeople] [smallint] NOT NULL CONSTRAINT [DF_LocationBooking_NumberOfPeople]  DEFAULT ((0)),
	[CalculatedBookingPrice]  AS ([appSchema].[GetLocationBookingPrice]([StartTime],[EndTime],[LocationId],[BookingId])),
 CONSTRAINT [PK_LocationBooking] PRIMARY KEY CLUSTERED 
(
	[LocationBookingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [appSchema].[Resource]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[Resource](
	[ResourceId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Count] [smallint] NOT NULL,
	[BookingPricePerHour] [decimal](12, 2) NOT NULL,
	[MinutesMarginAfterBooking] [smallint] NOT NULL,
	[WeekEndCount] [smallint] NULL,
 CONSTRAINT [PK_Resource] PRIMARY KEY CLUSTERED 
(
	[ResourceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  UserDefinedFunction [appSchema].[GetResourceBookingPrice]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[GetResourceBookingPrice](
	@StartTime smalldatetime, 
	@EndTime smalldatetime,
	@ResourceId int,
	@BookingId int
)
RETURNS decimal(12,2)
WITH SCHEMABINDING
AS
BEGIN

	DECLARE @Price decimal(12,2) = 0.00;
		
	SELECT @Price = (CAST(DATEDIFF(minute, @StartTime, @EndTime) AS decimal(12,2)) / 60.00) * CAST([Resource].BookingPricePerHour AS decimal(12,2))
	FROM appSchema.[Resource]
	WHERE ResourceId = @ResourceId
	
	RETURN @Price;
	
END
GO
/****** Object:  Table [appSchema].[ResourceBooking]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [appSchema].[ResourceBooking](
	[ResourceBookingId] [int] IDENTITY(1,1) NOT NULL,
	[BookingId] [int] NOT NULL,
	[ResourceId] [int] NOT NULL,
	[ResourceCount] [smallint] NOT NULL,
	[StartTime] [smalldatetime] NULL,
	[EndTime] [smalldatetime] NULL,
	[CalculatedBookingPrice]  AS ([appSchema].[GetResourceBookingPrice]([StartTime],[EndTime],[ResourceId],[BookingId])),
 CONSTRAINT [PK_ResourceBooking] PRIMARY KEY CLUSTERED 
(
	[ResourceBookingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  UserDefinedFunction [appSchema].[GetBookingStartTime]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[GetBookingStartTime](
	@BookingId int
)
RETURNS smalldatetime
WITH SCHEMABINDING
AS
BEGIN

	DECLARE @StartTime smalldatetime;
	
	SET @StartTime = (SELECT MIN(StartTime) FROM (

		-- StartTime from Location booking
		SELECT StartTime
		FROM appSchema.LocationBooking 
		WHERE BookingId = @BookingId

		UNION

		-- StartTime from Resource booking
		SELECT StartTime
		FROM appSchema.ResourceBooking 
		WHERE BookingId = @BookingId
	) sub)
	
	RETURN @StartTime;

END


GO
/****** Object:  UserDefinedFunction [appSchema].[GetBookingEndTime]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[GetBookingEndTime](
	@BookingId int
)
RETURNS smalldatetime
WITH SCHEMABINDING
AS
BEGIN

	DECLARE @EndTime smalldatetime;
	
	SET @EndTime = (SELECT MAX(EndTime) FROM (

		-- StartTime from Location booking
		SELECT EndTime
		FROM appSchema.LocationBooking 
		WHERE BookingId = @BookingId

		UNION

		-- StartTime from Resource booking
		SELECT EndTime
		FROM appSchema.ResourceBooking 
		WHERE BookingId = @BookingId
	) sub)

	RETURN @EndTime;

END


GO
/****** Object:  UserDefinedFunction [appSchema].[GetBookingPrice]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[GetBookingPrice](
	@BookingId int,
	@Discount decimal(3,2)
)
RETURNS decimal(12,2)
WITH SCHEMABINDING
AS
BEGIN

	DECLARE @Price decimal(12,2) = 0.00;

	DECLARE @LocationsPrice decimal(12,2) = 0.00;
	DECLARE @ResourcesPrice decimal(12,2) = 0.00;
	DECLARE @MealsPrice decimal(12,2) = 0.00;
	
	SET @LocationsPrice = (SELECT SUM(CalculatedBookingPrice) FROM appSchema.LocationBooking WHERE BookingId = @BookingId)
	SET @ResourcesPrice = (SELECT SUM(CalculatedBookingPrice) FROM appSchema.ResourceBooking WHERE BookingId = @BookingId)
	--SELECT @MealsPrice = (SELECT SUM(CalculatedBookingPrice) FROM appSchema.MealBooking WHERE BookingId = BookingId)

	SET @Price = (SELECT (ISNULL(@LocationsPrice, 0) + ISNULL(@ResourcesPrice, 0)) * (1.00 - @Discount) )

	RETURN @Price;

END


GO
/****** Object:  Table [appSchema].[Booking]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[Booking](
	[BookingId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NULL,
	[BookingTypeId] [smallint] NOT NULL,
	[CustomerId] [int] NULL,
	[Provisional] [bit] NOT NULL CONSTRAINT [DF_Booking_Provisional]  DEFAULT ((0)),
	[NumberOfPeople] [smallint] NOT NULL,
	[Discount] [decimal](3, 2) NOT NULL CONSTRAINT [DF_Booking_Discount]  DEFAULT ((0)),
	[Notes] [varchar](200) NULL,
	[CalculatedBookingPrice]  AS ([appSchema].[GetBookingPrice]([BookingId],[Discount])),
	[CreatedByUserId] [int] NULL,
	[ModifiedByUserId] [int] NULL,
	[ResponsibleUserId] [int] NULL,
	[StartTime]  AS ([appSchema].[GetBookingStartTime]([BookingId])),
	[EndTime]  AS ([appSchema].[GetBookingEndTime]([BookingId])),
	[CreatedTime] [smalldatetime] NULL,
	[ModifiedTime] [smalldatetime] NULL,
 CONSTRAINT [PK_Booking] PRIMARY KEY CLUSTERED 
(
	[BookingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[LocationFurnituring]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [appSchema].[LocationFurnituring](
	[LocationId] [int] NOT NULL,
	[FurnituringId] [smallint] NOT NULL,
	[MaxPeople] [int] NOT NULL CONSTRAINT [DF_BookingFurniture_MaxPeople]  DEFAULT ((0)),
 CONSTRAINT [PK_BookingFurniture] PRIMARY KEY CLUSTERED 
(
	[LocationId] ASC,
	[FurnituringId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  UserDefinedFunction [appSchema].[IsPastFurnituringMaxPeople]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[IsPastFurnituringMaxPeople](
	@LocationId int,
	@FurnituringId smallint,
	@NumberOfPeople smallint
)
RETURNS INT
WITH SCHEMABINDING
AS
BEGIN

	-- Declare variables
	DECLARE @MaxPeople int;

	-- Get Max number of people for specified location with furnituing
	SELECT @MaxPeople = MaxPeople
	FROM appSchema.LocationFurnituring
	WHERE LocationId = @LocationId AND FurnituringId = @FurnituringId;

	-- Check if current number of people exceeds the locations MaxPeople
	IF (@NumberOfPeople > @MaxPeople)
	BEGIN
		RETURN 1
	END

RETURN 0
END


GO
/****** Object:  UserDefinedFunction [appSchema].[IsPastLocationMaxPeople]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [appSchema].[IsPastLocationMaxPeople](
	@LocationId int,
	@NumberOfPeople smallint
)
RETURNS INT
WITH SCHEMABINDING
AS
BEGIN

	-- Declare variables
	DECLARE @MaxPeople int;

	-- Get Max number of people for specified location with furnituing
	SELECT @MaxPeople = MaxPeople
	FROM appSchema.Location
	WHERE LocationId = @LocationId;

	-- Check if current number of people exceeds the locations MaxPeople
	IF (@NumberOfPeople > @MaxPeople)
	BEGIN
		RETURN 1
	END

RETURN 0
END


GO
/****** Object:  Table [appSchema].[BookingType]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[BookingType](
	[BookingTypeId] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[HasLocation] [bit] NOT NULL CONSTRAINT [DF_BookingType_HasLocation]  DEFAULT ((1)),
	[MinutesMarginBeforeBooking] [smallint] NOT NULL CONSTRAINT [DF_BookingType_MinutesMarginBeforeBooking]  DEFAULT ((0)),
	[MinutesMarginAfterBooking] [smallint] NOT NULL CONSTRAINT [DF_BookingType_MinutesMarginAfterBooking]  DEFAULT ((0)),
 CONSTRAINT [PK_BookingType] PRIMARY KEY CLUSTERED 
(
	[BookingTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[BookingTypeHasMeal]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [appSchema].[BookingTypeHasMeal](
	[BookingTypeId] [smallint] NOT NULL,
	[MealId] [smallint] NOT NULL,
 CONSTRAINT [PK_BookingTypeHasMeal] PRIMARY KEY CLUSTERED 
(
	[BookingTypeId] ASC,
	[MealId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [appSchema].[BookingTypeHasResource]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [appSchema].[BookingTypeHasResource](
	[BookingTypeId] [smallint] NOT NULL,
	[ResourceId] [int] NOT NULL,
 CONSTRAINT [PK_BookingTypeHasResouce] PRIMARY KEY CLUSTERED 
(
	[BookingTypeId] ASC,
	[ResourceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [appSchema].[Customer]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[Customer](
	[CustomerId] [int] IDENTITY(100000,1) NOT NULL,
	[CustomerNumber] [varchar](11) NULL,
	[Name] [varchar](50) NOT NULL,
	[Address] [varchar](40) NOT NULL,
	[PostNumber] [varchar](6) NOT NULL,
	[City] [varchar](30) NOT NULL,
	[EmailAddress] [varchar](50) NOT NULL,
	[PhoneNumber] [varchar](20) NOT NULL,
	[CellPhoneNumber] [varchar](20) NOT NULL,
	[ParentCustomerId] [int] NULL,
	[Notes] [varchar](200) NOT NULL,
 CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED 
(
	[CustomerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[Furnituring]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[Furnituring](
	[FurnituringId] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Furniture] PRIMARY KEY CLUSTERED 
(
	[FurnituringId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[Group]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[Group](
	[GroupId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_UserGroup] PRIMARY KEY CLUSTERED 
(
	[GroupId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[Meal]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[Meal](
	[MealId] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Meal] PRIMARY KEY CLUSTERED 
(
	[MealId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[MealBooking]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[MealBooking](
	[MealBookingId] [int] IDENTITY(1,1) NOT NULL,
	[BookingId] [int] NOT NULL,
	[Provisional] [bit] NOT NULL CONSTRAINT [DF_MealBooking_Provisional]  DEFAULT ((1)),
	[MealId] [smallint] NOT NULL,
	[MealCount] [smallint] NOT NULL,
	[LocationId] [int] NULL,
	[DeliveryAddress] [varchar](200) NULL,
	[StartTime] [smalldatetime] NOT NULL,
	[EndTime] [smalldatetime] NULL,
 CONSTRAINT [PK_MealBooking] PRIMARY KEY CLUSTERED 
(
	[MealBookingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[MealHasProperty]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [appSchema].[MealHasProperty](
	[MealId] [smallint] NOT NULL,
	[MealPropertyId] [smallint] NOT NULL,
 CONSTRAINT [PK_MealHasProperty] PRIMARY KEY CLUSTERED 
(
	[MealId] ASC,
	[MealPropertyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [appSchema].[MealProperty]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[MealProperty](
	[MealPropertyId] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_MealProperty] PRIMARY KEY CLUSTERED 
(
	[MealPropertyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[PayMethod]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[PayMethod](
	[PayMethodId] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_PayMethod] PRIMARY KEY CLUSTERED 
(
	[PayMethodId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[User]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [appSchema].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[SurName] [varchar](50) NOT NULL,
	[EmailAddress] [varchar](50) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [appSchema].[UserGroup]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [appSchema].[UserGroup](
	[UserId] [int] NOT NULL,
	[GroupId] [int] NOT NULL,
 CONSTRAINT [PK_UserGroup_1] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[GroupId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Index [IX_CustomerId]    Script Date: 2015-05-27 03:09:19 ******/
CREATE NONCLUSTERED INDEX [IX_CustomerId] ON [appSchema].[Booking]
(
	[CustomerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_CustomerName]    Script Date: 2015-05-27 03:09:19 ******/
CREATE NONCLUSTERED INDEX [IX_CustomerName] ON [appSchema].[Customer]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ParentCustomerId]    Script Date: 2015-05-27 03:09:19 ******/
CREATE NONCLUSTERED INDEX [IX_ParentCustomerId] ON [appSchema].[Customer]
(
	[ParentCustomerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [appSchema].[Booking]  WITH CHECK ADD  CONSTRAINT [FK_Booking_BookingType] FOREIGN KEY([BookingTypeId])
REFERENCES [appSchema].[BookingType] ([BookingTypeId])
GO
ALTER TABLE [appSchema].[Booking] CHECK CONSTRAINT [FK_Booking_BookingType]
GO
ALTER TABLE [appSchema].[Booking]  WITH CHECK ADD  CONSTRAINT [FK_Booking_Customer] FOREIGN KEY([CustomerId])
REFERENCES [appSchema].[Customer] ([CustomerId])
GO
ALTER TABLE [appSchema].[Booking] CHECK CONSTRAINT [FK_Booking_Customer]
GO
ALTER TABLE [appSchema].[Booking]  WITH CHECK ADD  CONSTRAINT [FK_Booking_User] FOREIGN KEY([CreatedByUserId])
REFERENCES [appSchema].[User] ([UserId])
GO
ALTER TABLE [appSchema].[Booking] CHECK CONSTRAINT [FK_Booking_User]
GO
ALTER TABLE [appSchema].[Booking]  WITH CHECK ADD  CONSTRAINT [FK_Booking_User1] FOREIGN KEY([ModifiedByUserId])
REFERENCES [appSchema].[User] ([UserId])
GO
ALTER TABLE [appSchema].[Booking] CHECK CONSTRAINT [FK_Booking_User1]
GO
ALTER TABLE [appSchema].[Booking]  WITH CHECK ADD  CONSTRAINT [FK_Booking_User2] FOREIGN KEY([ResponsibleUserId])
REFERENCES [appSchema].[User] ([UserId])
GO
ALTER TABLE [appSchema].[Booking] CHECK CONSTRAINT [FK_Booking_User2]
GO
ALTER TABLE [appSchema].[BookingTypeHasMeal]  WITH CHECK ADD  CONSTRAINT [FK_BookingTypeHasMeal_BookingType] FOREIGN KEY([BookingTypeId])
REFERENCES [appSchema].[BookingType] ([BookingTypeId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[BookingTypeHasMeal] CHECK CONSTRAINT [FK_BookingTypeHasMeal_BookingType]
GO
ALTER TABLE [appSchema].[BookingTypeHasMeal]  WITH CHECK ADD  CONSTRAINT [FK_BookingTypeHasMeal_Meal] FOREIGN KEY([MealId])
REFERENCES [appSchema].[Meal] ([MealId])
GO
ALTER TABLE [appSchema].[BookingTypeHasMeal] CHECK CONSTRAINT [FK_BookingTypeHasMeal_Meal]
GO
ALTER TABLE [appSchema].[BookingTypeHasResource]  WITH CHECK ADD  CONSTRAINT [FK_BookingTypeHasResouce_BookingType] FOREIGN KEY([BookingTypeId])
REFERENCES [appSchema].[BookingType] ([BookingTypeId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[BookingTypeHasResource] CHECK CONSTRAINT [FK_BookingTypeHasResouce_BookingType]
GO
ALTER TABLE [appSchema].[BookingTypeHasResource]  WITH CHECK ADD  CONSTRAINT [FK_BookingTypeHasResouce_Resource] FOREIGN KEY([ResourceId])
REFERENCES [appSchema].[Resource] ([ResourceId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[BookingTypeHasResource] CHECK CONSTRAINT [FK_BookingTypeHasResouce_Resource]
GO
ALTER TABLE [appSchema].[Customer]  WITH CHECK ADD  CONSTRAINT [FK_Customer_Customer] FOREIGN KEY([ParentCustomerId])
REFERENCES [appSchema].[Customer] ([CustomerId])
GO
ALTER TABLE [appSchema].[Customer] CHECK CONSTRAINT [FK_Customer_Customer]
GO
ALTER TABLE [appSchema].[Location]  WITH CHECK ADD  CONSTRAINT [FK_Location_Location] FOREIGN KEY([ParentLocationId])
REFERENCES [appSchema].[Location] ([LocationId])
GO
ALTER TABLE [appSchema].[Location] CHECK CONSTRAINT [FK_Location_Location]
GO
ALTER TABLE [appSchema].[LocationBooking]  WITH CHECK ADD  CONSTRAINT [FK_LocationBooking_Booking] FOREIGN KEY([BookingId])
REFERENCES [appSchema].[Booking] ([BookingId])
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[LocationBooking] CHECK CONSTRAINT [FK_LocationBooking_Booking]
GO
ALTER TABLE [appSchema].[LocationBooking]  WITH CHECK ADD  CONSTRAINT [FK_LocationBooking_Furnituring] FOREIGN KEY([FurnituringId])
REFERENCES [appSchema].[Furnituring] ([FurnituringId])
GO
ALTER TABLE [appSchema].[LocationBooking] CHECK CONSTRAINT [FK_LocationBooking_Furnituring]
GO
ALTER TABLE [appSchema].[LocationBooking]  WITH CHECK ADD  CONSTRAINT [FK_LocationBooking_Location] FOREIGN KEY([LocationId])
REFERENCES [appSchema].[Location] ([LocationId])
GO
ALTER TABLE [appSchema].[LocationBooking] CHECK CONSTRAINT [FK_LocationBooking_Location]
GO
ALTER TABLE [appSchema].[LocationFurnituring]  WITH CHECK ADD  CONSTRAINT [FK_LocationFurnituring_Furnituring] FOREIGN KEY([FurnituringId])
REFERENCES [appSchema].[Furnituring] ([FurnituringId])
GO
ALTER TABLE [appSchema].[LocationFurnituring] CHECK CONSTRAINT [FK_LocationFurnituring_Furnituring]
GO
ALTER TABLE [appSchema].[LocationFurnituring]  WITH CHECK ADD  CONSTRAINT [FK_LocationFurnituring_Location] FOREIGN KEY([LocationId])
REFERENCES [appSchema].[Location] ([LocationId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[LocationFurnituring] CHECK CONSTRAINT [FK_LocationFurnituring_Location]
GO
ALTER TABLE [appSchema].[MealBooking]  WITH CHECK ADD  CONSTRAINT [FK_MealBooking_Booking] FOREIGN KEY([BookingId])
REFERENCES [appSchema].[Booking] ([BookingId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[MealBooking] CHECK CONSTRAINT [FK_MealBooking_Booking]
GO
ALTER TABLE [appSchema].[MealBooking]  WITH CHECK ADD  CONSTRAINT [FK_MealBooking_Location] FOREIGN KEY([LocationId])
REFERENCES [appSchema].[Location] ([LocationId])
GO
ALTER TABLE [appSchema].[MealBooking] CHECK CONSTRAINT [FK_MealBooking_Location]
GO
ALTER TABLE [appSchema].[MealBooking]  WITH CHECK ADD  CONSTRAINT [FK_MealBooking_Meal] FOREIGN KEY([MealId])
REFERENCES [appSchema].[Meal] ([MealId])
GO
ALTER TABLE [appSchema].[MealBooking] CHECK CONSTRAINT [FK_MealBooking_Meal]
GO
ALTER TABLE [appSchema].[MealHasProperty]  WITH CHECK ADD  CONSTRAINT [FK_MealHasProperty_Meal] FOREIGN KEY([MealId])
REFERENCES [appSchema].[Meal] ([MealId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[MealHasProperty] CHECK CONSTRAINT [FK_MealHasProperty_Meal]
GO
ALTER TABLE [appSchema].[MealHasProperty]  WITH CHECK ADD  CONSTRAINT [FK_MealHasProperty_MealProperty] FOREIGN KEY([MealPropertyId])
REFERENCES [appSchema].[MealProperty] ([MealPropertyId])
GO
ALTER TABLE [appSchema].[MealHasProperty] CHECK CONSTRAINT [FK_MealHasProperty_MealProperty]
GO
ALTER TABLE [appSchema].[ResourceBooking]  WITH CHECK ADD  CONSTRAINT [FK_ResourceBooking_Booking] FOREIGN KEY([BookingId])
REFERENCES [appSchema].[Booking] ([BookingId])
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[ResourceBooking] CHECK CONSTRAINT [FK_ResourceBooking_Booking]
GO
ALTER TABLE [appSchema].[ResourceBooking]  WITH CHECK ADD  CONSTRAINT [FK_ResourceBooking_Resource] FOREIGN KEY([ResourceId])
REFERENCES [appSchema].[Resource] ([ResourceId])
GO
ALTER TABLE [appSchema].[ResourceBooking] CHECK CONSTRAINT [FK_ResourceBooking_Resource]
GO
ALTER TABLE [appSchema].[UserGroup]  WITH CHECK ADD  CONSTRAINT [FK_UserGroup_Group] FOREIGN KEY([GroupId])
REFERENCES [appSchema].[Group] ([GroupId])
GO
ALTER TABLE [appSchema].[UserGroup] CHECK CONSTRAINT [FK_UserGroup_Group]
GO
ALTER TABLE [appSchema].[UserGroup]  WITH CHECK ADD  CONSTRAINT [FK_UserGroup_User] FOREIGN KEY([UserId])
REFERENCES [appSchema].[User] ([UserId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [appSchema].[UserGroup] CHECK CONSTRAINT [FK_UserGroup_User]
GO
ALTER TABLE [appSchema].[Booking]  WITH CHECK ADD  CONSTRAINT [CK_Discount] CHECK  (([Discount]<=(1) AND [Discount]>=(0)))
GO
ALTER TABLE [appSchema].[Booking] CHECK CONSTRAINT [CK_Discount]
GO
ALTER TABLE [appSchema].[Customer]  WITH CHECK ADD  CONSTRAINT [CK_City] CHECK  ((upper([City])=[City]))
GO
ALTER TABLE [appSchema].[Customer] CHECK CONSTRAINT [CK_City]
GO
ALTER TABLE [appSchema].[Customer]  WITH NOCHECK ADD  CONSTRAINT [CK_EmailAddress] CHECK  (([appSchema].[IsValidEmail]([EmailAddress])=(1)))
GO
ALTER TABLE [appSchema].[Customer] CHECK CONSTRAINT [CK_EmailAddress]
GO
ALTER TABLE [appSchema].[Customer]  WITH CHECK ADD  CONSTRAINT [CK_PostNumber] CHECK  (([PostNumber] like '[0-9][0-9][0-9] [0-9][0-9]'))
GO
ALTER TABLE [appSchema].[Customer] CHECK CONSTRAINT [CK_PostNumber]
GO
ALTER TABLE [appSchema].[Location]  WITH CHECK ADD  CONSTRAINT [CK_LocationBookingPricePerHour] CHECK  (([BookingPricePerHour]>=(0)))
GO
ALTER TABLE [appSchema].[Location] CHECK CONSTRAINT [CK_LocationBookingPricePerHour]
GO
ALTER TABLE [appSchema].[Location]  WITH CHECK ADD  CONSTRAINT [CK_MaxPeople] CHECK  (([MaxPeople]>=(0)))
GO
ALTER TABLE [appSchema].[Location] CHECK CONSTRAINT [CK_MaxPeople]
GO
ALTER TABLE [appSchema].[LocationBooking]  WITH NOCHECK ADD  CONSTRAINT [CK_LocationBooking_MaxPeople] CHECK  (([appSchema].[IsPastFurnituringMaxPeople]([LocationId],[FurnituringId],[NumberOfPeople])=(0)))
GO
ALTER TABLE [appSchema].[LocationBooking] CHECK CONSTRAINT [CK_LocationBooking_MaxPeople]
GO
ALTER TABLE [appSchema].[LocationFurnituring]  WITH NOCHECK ADD  CONSTRAINT [CK_LocationFurnituring_MaxPeople] CHECK  (([appSchema].[IsPastLocationMaxPeople]([LocationId],[MaxPeople])=(0)))
GO
ALTER TABLE [appSchema].[LocationFurnituring] CHECK CONSTRAINT [CK_LocationFurnituring_MaxPeople]
GO
ALTER TABLE [appSchema].[Resource]  WITH CHECK ADD  CONSTRAINT [CK_BookingPricePerHour] CHECK  (([BookingPricePerHour]>=(0)))
GO
ALTER TABLE [appSchema].[Resource] CHECK CONSTRAINT [CK_BookingPricePerHour]
GO
ALTER TABLE [appSchema].[Resource]  WITH CHECK ADD  CONSTRAINT [CK_Count] CHECK  (([Count]>=(0)))
GO
ALTER TABLE [appSchema].[Resource] CHECK CONSTRAINT [CK_Count]
GO
ALTER TABLE [appSchema].[Resource]  WITH CHECK ADD  CONSTRAINT [CK_MinutesMarginAfterBooking] CHECK  (([MinutesMarginAfterBooking]>=(0)))
GO
ALTER TABLE [appSchema].[Resource] CHECK CONSTRAINT [CK_MinutesMarginAfterBooking]
GO
ALTER TABLE [appSchema].[ResourceBooking]  WITH CHECK ADD  CONSTRAINT [CK_ResourceCount] CHECK  (([ResourceCount]>=(0)))
GO
ALTER TABLE [appSchema].[ResourceBooking] CHECK CONSTRAINT [CK_ResourceCount]
GO
ALTER TABLE [appSchema].[ResourceBooking]  WITH CHECK ADD  CONSTRAINT [CK_ResourceCountIsAvailable] CHECK  (([appSchema].[IsEnoughResources]([ResourceId],[ResourceCount],[BookingId])=(1)))
GO
ALTER TABLE [appSchema].[ResourceBooking] CHECK CONSTRAINT [CK_ResourceCountIsAvailable]
GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingCheckDays]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Johnny Pesola 2015-03-07
--===========================================--
-- Supports:
--	*	Pagination
--	*	Order after specific column
--	*	Search filtering for multiple columns
--===========================================--

CREATE PROCEDURE [appSchema].[usp_BookingCheckDays]

   -- Optional Search parameters
   @StartTime smalldatetime,
   @EndTime smalldatetime,
   @Type varchar(10) = 'all'

AS
BEGIN

---------------------------

	-- Create temporary table
	CREATE TABLE #TempTable
	(
		StartTime smalldatetime, 
		EndTime smalldatetime, 
		Type varchar(10)
	)

	-- Bookings
	IF (@Type = 'booking')
	BEGIN
		INSERT INTO #TempTable
		SELECT 
			B.StartTime AS StartTime,
			B.EndTime AS EndTime,
			'booking' AS [Type]

		FROM appSchema.Booking AS B
		WHERE 
			StartTime >= @StartTime AND
			StartTime <= @EndTime OR

			EndTime >= @StartTime AND
			EndTime <= @EndTime OR

			StartTime < @StartTime AND 
			EndTime > @EndTime
	END

	-- Location Bookings
	IF (@Type = 'location' OR @Type = 'all')
	BEGIN
		INSERT INTO #TempTable
		SELECT 
			LB.StartTime AS StartTime,
			LB.EndTime AS EndTime,
			'location' AS [Type]

		FROM appSchema.LocationBooking AS LB
		WHERE 
			StartTime >= @StartTime AND
			StartTime <= @EndTime OR

			EndTime >= @StartTime AND
			EndTime <= @EndTime OR

			StartTime < @StartTime AND 
			EndTime > @EndTime
	END

	-- Resource Bookings
	IF (@Type = 'resource' OR @Type = 'all')
	BEGIN
		INSERT INTO #TempTable
		SELECT
			RB.StartTime AS StartTime,
			RB.EndTime AS EndTime,
			'resource' AS [Type]

		FROM appSchema.ResourceBooking AS RB
		WHERE 
			StartTime >= @StartTime AND
			StartTime <= @EndTime OR

			EndTime >= @StartTime AND
			EndTime <= @EndTime OR

			StartTime < @StartTime AND 
			EndTime > @EndTime
	END

	-- Meal Bookings
	IF (@Type = 'meal' OR @Type = 'all')
	BEGIN
		INSERT INTO #TempTable
		SELECT
			MB.StartTime AS StartTime,
			MB.EndTime AS EndTime,
			'meal' AS [Type]

		FROM appSchema.MealBooking AS MB
		WHERE 
			StartTime >= @StartTime AND
			StartTime <= @EndTime OR

			EndTime >= @StartTime AND
			EndTime <= @EndTime OR

			StartTime < @StartTime AND 
			EndTime > @EndTime
	END

	-- Output data
	SELECT * FROM #TempTable ORDER BY StartTime
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingCreate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [appSchema].[usp_BookingCreate]

	-- In Parameters
	@Name varchar(50) = '',
	@BookingTypeId int,
	@CustomerId int = NULL,
	@Provisional int,
	@NumberOfPeople smallint,
	@Discount decimal(3,2),
	@Notes varchar(200) = '',
	@CreatedByUserId int = NULL,
	@ModifiedByUserId int = NULL,
	@ResponsibleUserId int = NULL,

	-- Out parameters
	@InsertId int = NULL OUTPUT

AS
BEGIN

	-- Insert new booking
	INSERT INTO appSchema.Booking
		(
			Name,
			BookingTypeId,
			CustomerId,
			Provisional,
			NumberOfPeople,
			Discount,
			Notes,
			CreatedByUserId,
			ModifiedByUserId,
			ResponsibleUserId
		)
	VALUES
		(
			@Name,
			@BookingTypeId,
			@CustomerId,
			@Provisional,
			@NumberOfPeople,
			@Discount,
			@Notes,
			@CreatedByUserId,
			@ModifiedByUserId,
			@ResponsibleUserId
		)

	-- Set out variable
	SET @InsertId = SCOPE_IDENTITY();

END

GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingDelete]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-03-08
--=============================================
CREATE PROCEDURE [appSchema].[usp_BookingDelete]

   -- In Parameters
   @BookingId int

AS
BEGIN

	-- Delete booking if it exists
	IF (EXISTS(SELECT BookingId FROM appSchema.Booking WHERE BookingId = @BookingId))
	BEGIN
		DELETE FROM appSchema.Booking
		WHERE BookingId = @BookingId
	END

	-- If no rows were deleted
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('Bokning kunde ej raderas', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingList]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Johnny Pesola 2015-05-24
--===========================================--
-- Supports:
--	*	Pagination
--	*	Order after specific column
--	*	Search filtering for multiple columns
--===========================================--

CREATE PROCEDURE [appSchema].[usp_BookingList]

   -- Optional Search parameters
   @BookingId int = NULL,
   @CustomerName varchar(50) = NULL,
   @NumberOfPeople smallint = NULL,

   -- Pagination parameters 
   @PageIndex int = 1,
   @PageSize int = 10,

   -- Sorting Parameters
   @SortOrder varchar(25) = 'StartTime ASC'

AS
BEGIN
	-- Declare Local variables	
	DECLARE @FirstRow int,
			@LastRow int,
			@TotalRows int

	-- Calculate and set local pagination variables
	SET @FirstRow = ( @PageIndex - 1 ) * @PageSize
	SET @LastRow = ( @PageIndex * @PageSize + 1 )
	SET @TotalRows = @FirstRow - @LastRow + 1;


	-- Apply rownumbers (for pagination)
    SELECT ROW_NUMBER() OVER (

		-- Order by @SortOrder variable.
		ORDER BY 

		CASE WHEN @SortOrder = 'NumberOfPeople ASC' THEN B.NumberOfPeople ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'NumberOfPeople DESC' THEN B.NumberOfPeople ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'Discount ASC' THEN B.Discount ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Discount DESC' THEN B.Discount ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'Notes ASC' THEN B.Notes ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Notes DESC' THEN B.Notes ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'CustomerName ASC' THEN C.Name ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'CustomerName DESC' THEN C.Name ELSE NULL END DESC

   ) AS RowNumber,
	B.BookingId,
	B.Name,
	B.BookingTypeId,
	B.CustomerId,
	B.Provisional,
	B.NumberOfPeople,
	B.Discount,
	B.Notes,
	B.CalculatedBookingPrice,
	B.StartTime,
	B.EndTime,

	BT.Name AS BookingTypeName,
	C.Name AS CustomerName

	-- Store in temporary table
	INTO #BookingResults

	-- Join other tables
	FROM appSchema.Booking AS B
		LEFT JOIN appSchema.Customer  AS C ON C.CustomerId = B.CustomerId
		LEFT JOIN appSchema.BookingType AS BT ON BT.BookingTypeId = B.BookingTypeId

	-- Apply optional search filters
	WHERE
			(@BookingId IS NULL OR B.BookingId = @BookingId)
		AND (@CustomerName IS NULL OR C.Name LIKE '%' + @CustomerName + '%')
		AND (@NumberOfPeople IS NULL OR B.NumberOfPeople = @NumberOfPeople)

	-- Apply pagination
	SELECT *
	FROM #BookingResults 
	WHERE
		RowNumber > @FirstRow
		AND RowNumber < @LastRow
	ORDER BY RowNumber ASC


	-- Dispose table
	DROP TABLE #BookingResults

END

GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingsForPeriod]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Johnny Pesola 2015-04-19
--===========================================--

CREATE PROCEDURE [appSchema].[usp_BookingsForPeriod]

   -- Optional Search parameters
   @StartTime smalldatetime,
   @EndTime smalldatetime

AS
BEGIN

	-- Add Columns from Booking and Customer tables
	SELECT
		B.BookingId,
		B.Name,
		B.BookingTypeId,
		B.CustomerId,
		B.Provisional,
		B.NumberOfPeople,
		B.Discount,
		B.Notes,
		B.CalculatedBookingPrice,
		B.StartTime,
		B.EndTime,
		BT.Name AS BookingTypeName,
		C.Name AS CustomerName

	FROM appSchema.Booking AS B
	LEFT JOIN appSchema.Customer AS C ON B.CustomerId = C.CustomerId
	LEFT JOIN appSchema.BookingType AS BT ON B.BookingTypeId = BT.BookingTypeId

	WHERE 
			B.StartTime >= @StartTime AND
			B.StartTime <= @EndTime OR

			B.EndTime >= @StartTime AND
			B.EndTime <= @EndTime OR

			B.StartTime < @StartTime AND 
			B.EndTime > @EndTime

	ORDER BY B.StartTime

END

GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingsForPeriodBACKUP]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Johnny Pesola 2015-04-19
--===========================================--

CREATE PROCEDURE [appSchema].[usp_BookingsForPeriodBACKUP]

   -- Optional Search parameters
   @StartTime smalldatetime,
   @EndTime smalldatetime

AS
BEGIN

	SELECT * INTO #TempTable FROM
	(
		-- Location Bookings
		SELECT 
			LB.BookingId,
			L.Name AS [Name],
			'Location' AS [Type],
			L.LocationId AS TypeId,
			LB.NumberOfPeople AS [Count],
			LB.StartTime AS StartTime,
			LB.EndTime AS EndTime

		FROM appSchema.LocationBooking AS LB
		LEFT JOIN appSchema.Location AS L ON L.LocationId = LB.LocationId
		WHERE 
			StartTime >= @StartTime AND
			StartTime <= @EndTime OR

			EndTime >= @StartTime AND
			EndTime <= @EndTime OR

			StartTime < @StartTime AND 
			EndTime > @EndTime

		-- Resource Bookings
		UNION
		SELECT
			RB.BookingId,
			R.Name AS [Name],
			'Resource' AS [Type],
			R.ResourceId AS TypeId,
			RB.ResourceCount AS [Count],
			RB.StartTime AS StartTime,
			RB.EndTime AS EndTime

		FROM appSchema.ResourceBooking AS RB
		LEFT JOIN appSchema.[Resource] AS R ON R.ResourceId = RB.ResourceId
		WHERE 
			StartTime >= @StartTime AND
			StartTime < @EndTime OR

			EndTime > @StartTime AND
			EndTime <= @EndTime OR

			StartTime < @StartTime AND 
			EndTime > @EndTime

		-- Meal Bookings
		UNION
		SELECT
			MB.BookingId,
			M.Name AS [Name],
			'Meal' AS [Type],
			M.MealId AS TypeId,
			MB.MealCount AS [Count],
			MB.StartTime AS StartTime,
			MB.EndTime AS EndTime
			
		FROM appSchema.MealBooking AS MB
		LEFT JOIN appSchema.Meal AS M ON M.MealId = MB.MealId
		WHERE 
			StartTime >= @StartTime AND
			StartTime < @EndTime OR

			EndTime > @StartTime AND
			EndTime <= @EndTime OR

			StartTime < @StartTime AND 
			EndTime > @EndTime

	) AS TMP

	-- Add Columns from Booking and Customer tables
	SELECT
		T.BookingId,
		B.Name AS BookingName,
		B.NumberOfPeople,
		B.Provisional,
		C.Name AS CustomerName,
		B.CustomerId AS CustomerID,
		T.Name AS TypeName,
		T.[Type],
		T.TypeId,
		T.[Count],
		T.StartTime,
		T.EndTime
	FROM #TempTable AS T
	LEFT JOIN appSchema.Booking AS B ON B.BookingId = T.BookingId
	LEFT JOIN appSchema.Customer AS C ON B.CustomerId = C.CustomerId
	ORDER BY CustomerName, StartTime

	-- Dispose table
	DROP TABLE #TempTable

END

GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingTypeCreate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-15
--=============================================

CREATE PROCEDURE [appSchema].[usp_BookingTypeCreate]

   -- In Parameters
   @Name varchar(50),
   @HasLocation bit,
   @MinutesMarginBeforeBooking smallint = 0,
   @MinutesMarginAfterBooking smallint = 0,

   -- Out parameters
   @InsertId int = NULL OUTPUT

AS
BEGIN

	-- Check that there isnt allready a location with this name.
	IF EXISTS(SELECT Name FROM BookingType WHERE Name = @Name)
	BEGIN
		RAISERROR('There is already a bookingtype with the given name.', 16, 1)
		RETURN
	END

	-- Insert new resource
	INSERT INTO appSchema.BookingType
		(
			Name,
			HasLocation,
			MinutesMarginBeforeBooking,
			MinutesMarginAfterBooking
		)
	VALUES
		(
			@Name,
			@HasLocation,
			@MinutesMarginBeforeBooking,
			@MinutesMarginAfterBooking
		)

	-- Set out variable
	SET @InsertId = SCOPE_IDENTITY();

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingTypeDelete]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-15
--=============================================
CREATE PROCEDURE [appSchema].[usp_BookingTypeDelete]

   -- In Parameters
   @BookingTypeId int

AS
BEGIN

	-- Delete booking if it exists
	IF (EXISTS(SELECT BookingTypeId FROM appSchema.BookingType WHERE BookingTypeId = @BookingTypeId))
	BEGIN
		-- Check if there are any foreign key references
		IF (EXISTS	(	
						SELECT BookingTypeId 
						FROM appSchema.Booking
						WHERE BookingTypeId = @BookingTypeId
					)
		OR
			EXISTS	(	
						SELECT BookingTypeId 
						FROM appSchema.BookingTypeHasMeal
						WHERE BookingTypeId = @BookingTypeId
					)
		OR
			EXISTS	(	
						SELECT BookingTypeId 
						FROM appSchema.BookingTypeHasResource
						WHERE BookingTypeId = @BookingTypeId
					)
		)
		BEGIN
			RAISERROR('Foreign key references exists', 16, 1)
			RETURN 1
		END
		ELSE
	
		BEGIN
			DELETE FROM appSchema.BookingType
			WHERE BookingTypeId = @BookingTypeId
		END
	END

	-- If no rows were deleted
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('BookingType could not be deleted', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingTypeList]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-05-15
--=============================================
-- Supports:
--	*	Pagination
--	*	Order after specific column
--	*	Search filtering for multiple columns
--=============================================
CREATE PROCEDURE [appSchema].[usp_BookingTypeList]

   -- Optional Search parameters
   @BookingTypeId int = NULL,
   @Name varchar(50) = NULL,
   @HasLocation bit = NULL,
   @MinutesMarginBeforeBooking smallint = NULL,
   @MinutesMarginAfterBooking smallint = NULL,

   -- Pagination parameters 
   @PageIndex int = 1,
   @PageSize int = 10,

   -- Sorting Parameters
   @SortOrder varchar(25) = 'Name ASC',

   -- Out parameters
   @TotalRowCount int = 0 OUTPUT

AS
BEGIN
	-- Declare Local variables	
	DECLARE @FirstRow int,
			@LastRow int,
			@TotalRows int

	-- Calculate and set local pagination variables
	SET @FirstRow = ( @PageIndex - 1 ) * @PageSize
	SET @LastRow = ( @PageIndex * @PageSize + 1 )
	SET @TotalRows = @FirstRow - @LastRow + 1;


	-- Apply rownumbers (for pagination)
    SELECT ROW_NUMBER() OVER (

		-- Order by @SortOrder variable.
		ORDER BY 
		CASE WHEN @SortOrder = 'Name ASC' THEN BookingType.Name ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Name DESC' THEN BookingType.Name ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'HasLocation ASC' THEN BookingType.HasLocation ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'HasLocation DESC' THEN BookingType.HasLocation ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'MinutesMarginBeforeBooking ASC' THEN BookingType.MinutesMarginBeforeBooking ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'MinutesMarginBeforeBooking DESC' THEN BookingType.MinutesMarginBeforeBooking ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'MinutesMarginAfterBooking ASC' THEN BookingType.MinutesMarginAfterBooking ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'MinutesMarginAfterBooking DESC' THEN BookingType.MinutesMarginAfterBooking ELSE NULL END DESC

   ) AS RowNumber,
	BookingTypeId,
	Name,
	HasLocation,
	MinutesMarginBeforeBooking,
	MinutesMarginAfterBooking

	-- Store in temporary table
	INTO #BookingTypeResults

	FROM appSchema.BookingType

	-- Apply optional search filters
	WHERE
			(@BookingTypeId IS NULL OR BookingTypeId = @BookingTypeId)
		AND (@Name IS NULL OR Name LIKE '%' + @Name + '%')
		AND (@HasLocation IS NULL OR HasLocation = @HasLocation)
		AND (@MinutesMarginBeforeBooking IS NULL OR MinutesMarginBeforeBooking = @MinutesMarginBeforeBooking)
		AND (@MinutesMarginAfterBooking IS NULL OR MinutesMarginAfterBooking = @MinutesMarginAfterBooking)

	-- Apply pagination
	SELECT *
	FROM #BookingTypeResults 
	WHERE
		RowNumber > @FirstRow
		AND RowNumber < @LastRow
	ORDER BY RowNumber ASC

	-- Set TotalRowCount output variable
	SELECT @TotalRowCount = COUNT(RowNumber) FROM #BookingTypeResults

	-- Dispose table
	DROP TABLE #BookingTypeResults

END





GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingTypeListSimple]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-05-15
--===========================================--
CREATE PROCEDURE [appSchema].[usp_BookingTypeListSimple]

AS
BEGIN
    SELECT
		BookingTypeId,
		Name,
		HasLocation,
		MinutesMarginBeforeBooking,
		MinutesMarginAfterBooking

	FROM appSchema.BookingType
	ORDER BY Name
END



GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingTypeUpdate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-15
--=============================================

CREATE PROCEDURE [appSchema].[usp_BookingTypeUpdate]

   -- In Parameters
   @BookingTypeId int,
   @Name varchar(50),
   @HasLocation bit,
   @MinutesMarginBeforeBooking smallint = 0,
   @MinutesMarginAfterBooking smallint = 0

AS
BEGIN

	-- Check that there isnt allready a BookingType with this name.
	IF EXISTS(SELECT Name FROM BookingType WHERE Name = @Name AND BookingTypeId != @BookingTypeId)
	BEGIN
		RAISERROR('There is already a bookingtype with the given name.', 16, 1)
		RETURN
	END

	-- Update BookingType if it exists
	IF (EXISTS(SELECT BookingTypeId FROM appSchema.BookingType WHERE BookingTypeId = @BookingTypeId))
	BEGIN
		-- Update Resource
		UPDATE appSchema.BookingType
		SET
			Name = @Name,
			HasLocation = @HasLocation,
			MinutesMarginBeforeBooking = @MinutesMarginBeforeBooking,
			MinutesMarginAfterBooking = @MinutesMarginAfterBooking

		WHERE BookingTypeId = @BookingTypeId
	END

	-- If no rows were updated
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('The bookingtype could not be updated.', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_BookingUpdate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-26
--=============================================
CREATE PROCEDURE [appSchema].[usp_BookingUpdate]

   -- In Parameters
   @BookingId int,
   @Name varchar(50),
   @BookingTypeId smallint,
   @CustomerId int,
   @Provisional bit,
   @NumberOfPeople smallint,
   @Discount decimal(3,2),
   @Notes varchar(200) = ''
   
AS
BEGIN

	
	-- Update booking if it exists
	IF (EXISTS(SELECT BookingId FROM appSchema.Booking WHERE BookingId = @BookingId))
	BEGIN
		-- Update booking
		UPDATE appSchema.Booking
		SET
			Name = @Name,
			BookingTypeId = @BookingTypeId,
			CustomerId = @CustomerId,
			Provisional = @Provisional,
			NumberOfPeople = @NumberOfPeople,
			Discount = @Discount,
			Notes = @Notes,
			ModifiedTime = GETDATE()

		WHERE BookingId = @BookingId
	END

	-- If no rows were updated
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('The booking could not be updated.', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_CustomerCreate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-03-08
--=============================================

CREATE PROCEDURE [appSchema].[usp_CustomerCreate]

   -- In Parameters
   @Name varchar(50),
   @Address varchar(40),
   @PostNumber varchar(6),
   @City varchar(30),
   @EmailAddress varchar(50) = '',
   @PhoneNumber varchar(20) = '',
   @CellPhoneNumber varchar(20) = '',
   @ParentCustomerId int = NULL,
   @Notes varchar(200) = '',

   -- Out parameters
   @InsertId int = NULL OUTPUT

AS
BEGIN

	-- Check that there isnt allready a location with this name.
	IF EXISTS(SELECT Name FROM Customer WHERE Name = @Name)
	BEGIN
		RAISERROR('Det finns redan en kund med det angivna namnet.', 16, 1)
		RETURN
	END

	-- Insert new location
	INSERT INTO appSchema.Customer
		(
			Name,
			[Address],
			PostNumber,
			City,
			EmailAddress,
			PhoneNumber,
			CellPhoneNumber,
			ParentCustomerId,
			Notes
		)
	VALUES
		(
			@Name,
			@Address,
			@PostNumber,
			UPPER(@City),
			@EmailAddress,
			@PhoneNumber,
			@CellPhoneNumber,
			@ParentCustomerId,
			@Notes
		)

	-- Set out variable
	SET @InsertId = SCOPE_IDENTITY();

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_CustomerDelete]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-03-08
--=============================================
CREATE PROCEDURE [appSchema].[usp_CustomerDelete]

   -- In Parameters
   @CustomerId int

AS
BEGIN

	-- Delete customer if it exists
	IF (EXISTS(SELECT CustomerId FROM appSchema.Customer WHERE CustomerId = @CustomerId))
	BEGIN
		DELETE FROM appSchema.Customer
		WHERE CustomerId = @CustomerId
	END

	-- If no rows were deleted
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('Kund kunde ej raderas', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_CustomerList]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-03-07
--===========================================--
-- Supports:
--	*	Pagination
--	*	Order after specific column
--	*	Search filtering for multiple columns
--===========================================--
CREATE PROCEDURE [appSchema].[usp_CustomerList]

   -- Optional Search parameters
   @CustomerId int = NULL,
   @Name varchar(50) = NULL,
   @Address varchar(40) = NULL,
   @PostNumber varchar(6) = NULL,
   @City varchar(30) = NULL,
   @EmailAddress varchar(50) = NULL,
   @PhoneNumber varchar(20) = NULL,
   @CellPhoneNumber varchar(20) = NULL,
   @ParentCustomerName varchar(50) = NULL,
   @Notes varchar(200) = NULL,

   -- Pagination parameters 
   @PageIndex int = 1,
   @PageSize int = 10,

   -- Sorting Parameters
   @SortOrder varchar(25) = 'Name ASC',

   -- Out parameters
   @TotalRowCount int = 0 OUTPUT

AS
BEGIN
	-- Declare Local variables	
	DECLARE @FirstRow int,
			@LastRow int,
			@TotalRows int

	-- Calculate and set local pagination variables
	SET @FirstRow = ( @PageIndex - 1 ) * @PageSize
	SET @LastRow = ( @PageIndex * @PageSize + 1 )
	SET @TotalRows = @FirstRow - @LastRow + 1;


	-- Apply rownumbers (for pagination)
    SELECT ROW_NUMBER() OVER (

		-- Order by @SortOrder variable.
		ORDER BY 
		CASE WHEN @SortOrder = 'Name ASC' THEN Customer.Name ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Name DESC' THEN Customer.Name ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'Address ASC' THEN Customer.[Address] ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Address DESC' THEN Customer.[Address] ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'PostNumber ASC' THEN Customer.PostNumber ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'PostNumber DESC' THEN Customer.PostNumber ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'City ASC' THEN Customer.City ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'City DESC' THEN Customer.City ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'PhoneNumber ASC' THEN Customer.PhoneNumber ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'PhoneNumber DESC' THEN Customer.PhoneNumber ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'CellPhoneNumber ASC' THEN Customer.CellPhoneNumber ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'CellPhoneNumber DESC' THEN Customer.CellPhoneNumber ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'ParentCustomerName ASC' THEN ParentCustomer.Name ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'ParentCustomerName DESC' THEN ParentCustomer.Name ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'Notes ASC' THEN Customer.Notes ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Notes DESC' THEN Customer.Notes ELSE NULL END DESC

   ) AS RowNumber,
	Customer.CustomerId,
	Customer.Name,
	Customer.[Address],
	Customer.PostNumber,
	Customer.City,
	Customer.EmailAddress,
	Customer.PhoneNumber,
	Customer.CellPhoneNumber,
	Customer.ParentCustomerId,
	ParentCustomer.Name AS ParentCustomerName,
	Customer.Notes,
	(SELECT COUNT(BookingId) FROM appSchema.Booking WHERE Booking.CustomerId = Customer.CustomerId) AS TotalBookings,
	(SELECT SUM(CalculatedBookingPrice) FROM appSchema.Booking WHERE Booking.CustomerId = Customer.CustomerId) AS TotalBookingValue,
	(SELECT COUNT(ParentCustomerId) FROM appSchema.Customer AS ChildCustomer WHERE ChildCustomer.ParentCustomerId = Customer.CustomerId) AS ChildCustomers

	-- Store in temporary table
	INTO #CustomerResults

	-- Join other tables
	FROM appSchema.Customer
		LEFT JOIN appSchema.Customer AS ParentCustomer ON Customer.ParentCustomerId = ParentCustomer.CustomerId

	-- Apply optional search filters
	WHERE
			(@CustomerId IS NULL OR Customer.CustomerId = @CustomerId)
		AND (@Name IS NULL OR Customer.Name LIKE '%' + @Name + '%')
		AND (@Address IS NULL OR Customer.[Address] LIKE '%' + @Address + '%')
		AND (@PostNumber IS NULL OR Customer.PostNumber = @PostNumber)
		AND (@City IS NULL OR Customer.City LIKE '%' + @City + '%')
		AND (@EmailAddress IS NULL OR Customer.EmailAddress LIKE '%' + @EmailAddress + '%')
		AND (@PhoneNumber IS NULL OR Customer.PhoneNumber LIKE '%' + @PhoneNumber + '%')
		AND (@CellPhoneNumber IS NULL OR Customer.CellPhoneNumber LIKE '%' + @CellPhoneNumber + '%')
		AND (@ParentCustomerName IS NULL OR ParentCustomer.Name LIKE '%' + @ParentCustomerName + '%')
		AND (@Notes IS NULL OR Customer.Notes LIKE '%' + @Notes + '%')

	-- Apply pagination
	SELECT *
	FROM #CustomerResults 
	WHERE
		RowNumber > @FirstRow
		AND RowNumber < @LastRow
	ORDER BY RowNumber ASC

	-- Set TotalRowCount output variable
	SELECT @TotalRowCount = COUNT(RowNumber) FROM #CustomerResults

	-- Dispose table
	DROP TABLE #CustomerResults

END





GO
/****** Object:  StoredProcedure [appSchema].[usp_CustomerListSimple]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-03-12
--===========================================--
CREATE PROCEDURE [appSchema].[usp_CustomerListSimple]

AS
BEGIN

    SELECT
	Customer.CustomerId,
	Customer.Name,
	Customer.City,
	Customer.ParentCustomerId,
	ParentCustomer.Name AS ParentCustomerName

	-- Join other tables
	FROM appSchema.Customer
		LEFT JOIN appSchema.Customer AS ParentCustomer ON Customer.ParentCustomerId = ParentCustomer.CustomerId

	ORDER BY Customer.Name
END





GO
/****** Object:  StoredProcedure [appSchema].[usp_CustomerUpdate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-03-08
--=============================================

CREATE PROCEDURE [appSchema].[usp_CustomerUpdate]

   -- In Parameters
   @CustomerId int,
   @Name varchar(50) = '',
   @Address varchar(40) = '',
   @PostNumber varchar(6) = '',
   @City varchar(30) = '',
   @EmailAddress varchar(50) = '',
   @PhoneNumber varchar(20) = '',
   @CellPhoneNumber varchar(20) = '',
   @ParentCustomerId int = 0,
   @Notes varchar(200) = ''

AS
BEGIN

	-- If given @ParentCustomerId is 0, make it null
	IF (@ParentCustomerId = 0)
		BEGIN
			SET @ParentCustomerId = null;
		END

	-- Update customer if it exists
	IF (EXISTS(SELECT CustomerId FROM appSchema.Customer WHERE CustomerId = @CustomerId))
		BEGIN
			-- Update customer
			UPDATE appSchema.Customer
			SET
				Name = @Name,
				[Address] = @Address,
				PostNumber = @PostNumber,
				City = UPPER(@City),
				EmailAddress = @EmailAddress,
				PhoneNumber = @PhoneNumber,
				CellPhoneNumber = @CellPhoneNumber,
				ParentCustomerId = @ParentCustomerId,
				Notes = @Notes


			WHERE CustomerId = @CustomerId
		END

	-- If no rows were updated
	IF @@ROWCOUNT = 0
		BEGIN
			RAISERROR('The customer could not be updated', 16, 1)
			RETURN 1
		END

	-- Return success
	RETURN 0

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_FurnituringCreate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [appSchema].[usp_FurnituringCreate]

	-- In Parameters
	@Name varchar(50),

	-- Out parameters
	@InsertId int = NULL OUTPUT

AS
BEGIN

	-- Check that there isnt allready a Furnituring with this name.
	IF EXISTS(SELECT Name FROM Furnituring WHERE Name = @Name)
	BEGIN
		RAISERROR('There is already a furnituring with the given name.', 16, 1)
		RETURN
	END

	-- Insert new Furnituring
	INSERT INTO appSchema.Furnituring
		(
			Name
		)
	VALUES
		(
			@Name
		)

	-- Set out variable
	SET @InsertId = SCOPE_IDENTITY();

END
GO
/****** Object:  StoredProcedure [appSchema].[usp_FurnituringDelete]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-04-23
--=============================================
CREATE PROCEDURE [appSchema].[usp_FurnituringDelete]

   -- In Parameters
   @FurnituringId int

AS
BEGIN

	-- Check if furnituring exists
	IF (EXISTS(SELECT FurnituringId FROM appSchema.Furnituring WHERE FurnituringId = @FurnituringId))
	BEGIN
		-- Check if there are any foreign key references
		IF (EXISTS	(	
						SELECT FurnituringId 
						FROM appSchema.LocationBooking
						WHERE FurnituringId = @FurnituringId
						UNION
						SELECT FurnituringId
						FROM appSchema.LocationFurnituring 
						WHERE FurnituringId = @FurnituringId
					)
		)
		BEGIN
			RAISERROR('Foreign key references exists', 16, 1)
			RETURN 1
		END
		ELSE
		-- Delete furnituring
		BEGIN
			DELETE FROM appSchema.Furnituring
			WHERE FurnituringId = @FurnituringId
		END
	END

	-- If no rows were deleted
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('Furnituring could not be deleted', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_FurnituringList]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-04-23
--===========================================--
-- Supports:
--	*	Pagination
--	*	Order after specific column
--	*	Search filtering for multiple columns
--===========================================--
CREATE PROCEDURE [appSchema].[usp_FurnituringList]

   -- Optional Search parameters
   @FurnituringId int = NULL,
   @Name varchar(50) = NULL,

   -- Sorting Parameter
   @SortOrder varchar(25) = 'Name ASC'

AS
BEGIN

	-- Apply rownumbers (for pagination)
    SELECT ROW_NUMBER() OVER (

		-- Order by @SortOrder variable.
		ORDER BY 

		CASE WHEN @SortOrder = 'FurnituringId ASC' THEN Furnituring.FurnituringId ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'FurnituringId DESC' THEN Furnituring.FurnituringId ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'Name ASC' THEN Furnituring.Name ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Name DESC' THEN Furnituring.Name ELSE NULL END DESC

   ) AS RowNumber,
	Furnituring.FurnituringId,
	Furnituring.Name

	-- Store in temporary table
	INTO #FurnituringResults

	FROM appSchema.Furnituring

	-- Apply optional search filters
	WHERE
			(@FurnituringId IS NULL OR FurnituringId = @FurnituringId)
		AND (@Name IS NULL OR Name LIKE '%' + @Name + '%')

	-- Output result
	SELECT *
	FROM #FurnituringResults
	ORDER BY RowNumber ASC

	-- Dispose table
	DROP TABLE #FurnituringResults

END





GO
/****** Object:  StoredProcedure [appSchema].[usp_FurnituringUpdate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [appSchema].[usp_FurnituringUpdate]

	-- In Parameters
	@Name varchar(50),
	@FurnituringId smallint

AS
BEGIN

	-- Check that there isnt allready a Furnituring with this name.
	IF EXISTS(SELECT Name FROM Furnituring WHERE Name = @Name)
	BEGIN
		RAISERROR('There is already a furnituring with the given name.', 16, 1)
		RETURN
	END

	-- Insert new Furnituring
	UPDATE appSchema.Furnituring
	SET
			Name = @Name

	WHERE FurnituringId = @FurnituringId
	
	-- If no rows were updated
	IF @@ROWCOUNT = 0
		BEGIN
			RAISERROR('The furnituring could not be updated.', 16, 1)
			RETURN 1
		END

	-- Return success
	RETURN 0

END
GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationBookedCheck]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [appSchema].[usp_LocationBookedCheck]

   -- In Parameters
   @BookingId int = NULL,
   @LocationId int,
   @StartDate varchar(10),
   @StartTime varchar(5),
   @EndDate varchar(10),
   @EndTime varchar(5),

   -- Out parameters
   @IsBooked int = NULL OUTPUT

AS
BEGIN

	-- Declare variables
	DECLARE @StartSmallDateTime smalldatetime;
	DECLARE @EndSmallDateTime smalldatetime;

	-- Check that given date values are ok
	IF (ISDATE(@StartDate + ' ' + @StartTime) = 1 AND ISDATE(@EndDate + ' ' + @EndTime) = 1)			
		BEGIN
			-- Convert date and time varchars to smalldatetime
			SET @StartSmallDateTime = CONVERT(smalldatetime, @StartDate + ' ' + @StartTime);
			SET @EndSmallDateTime = CONVERT(smalldatetime, @EndDate + ' ' + @EndTime);
		END
	ELSE
		BEGIN
			RAISERROR('Datum eller tidvärden är ogiltig(a).', 16, 1);
			RETURN
		END

	-- Check if the location is booked already.
	IF ( @BookingId IS NULL )
		BEGIN
			SET @IsBooked = appSchema.IsLocationAlreadyBooked(@LocationID, @StartSmallDateTime,@EndSmallDateTime, DEFAULT);
		END
	ELSE
		BEGIN
			SET @IsBooked = appSchema.IsLocationAlreadyBooked(@LocationID, @StartSmallDateTime,@EndSmallDateTime, @BookingId);
		END

	SELECT @IsBooked
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationBookingCreate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [appSchema].[usp_LocationBookingCreate]

	-- In Parameters
	@BookingId int,
	@LocationId int,
	@FurnituringId smallint,
	@StartTime smalldatetime,
	@EndTime smalldatetime,
	@NumberOfPeople smallint,
	
	-- Out parameters
	@InsertId int = NULL OUTPUT

AS
BEGIN

	-- Check if the location is booked already.
	
	IF ( appSchema.IsLocationAlreadyBooked(@LocationID, @StartTime, @Endtime, @BookingId) = 1 )
	BEGIN
		RAISERROR('The location is already booked at the given time.', 16, 1)
		RETURN 1
	END
	
	-- Insert new booking
	INSERT INTO appSchema.LocationBooking
		(
			BookingId,
			LocationId,
			FurnituringId,
			StartTime,
			LocationBooking.EndTime,
			NumberOfPeople
		)
	VALUES
		(
			@BookingId,
			@LocationId,
			@FurnituringId,
			@StartTime,
			@EndTime,
			@NumberOfPeople
		)

	-- Set out variable
	SET @InsertId = SCOPE_IDENTITY();

	-- Return success
	RETURN 0
END

GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationBookingDelete]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-22
--=============================================
CREATE PROCEDURE [appSchema].[usp_LocationBookingDelete]

   -- In Parameters
   @LocationBookingId int

AS
BEGIN

	-- Delete booking if it exists
	IF (EXISTS(SELECT BookingId FROM appSchema.LocationBooking WHERE LocationBookingId = @LocationBookingId))
	BEGIN
		DELETE FROM appSchema.LocationBooking
		WHERE LocationBookingId = @LocationBookingId
	END

	-- If no rows were deleted
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('The location booking could not be deleted.', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationBookingList]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Johnny Pesola 2015-05-22
--===========================================--
-- Supports:
--	*	Pagination
--	*	Order after specific column
--	*	Search filtering for multiple columns
--===========================================--

CREATE PROCEDURE [appSchema].[usp_LocationBookingList]

	-- Optional Search parameters
	@LocationBookingId int = NULL,
	@BookingId int  = NULL,
	@LocationId int = NULL,
	@FurnituringId smallint = NULL,
	@StartTime smalldatetime = NULL,
	@EndTime smalldatetime = NULL,
	@NumberOfPeople smallint = NULL,

	-- Pagination parameters 
	@PageIndex int = 1,
	@PageSize int = 10,

	-- Sorting Parameters
	@SortOrder varchar(25) = 'StartTime ASC'

AS
BEGIN
	-- Declare Local variables	
	DECLARE @FirstRow int,
			@LastRow int,
			@TotalRows int

	-- Calculate and set local pagination variables
	SET @FirstRow = ( @PageIndex - 1 ) * @PageSize
	SET @LastRow = ( @PageIndex * @PageSize + 1 )
	SET @TotalRows = @FirstRow - @LastRow + 1;


	-- Apply rownumbers (for pagination)
    SELECT ROW_NUMBER() OVER (

		-- Order by @SortOrder variable.
		ORDER BY 

		CASE WHEN @SortOrder = 'StartTime ASC' THEN LB.StartTime ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'StartTime DESC' THEN LB.StartTime ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'EndTime ASC' THEN LB.EndTime ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'EndTime DESC' THEN LB.EndTime ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'NumberOfPeople ASC' THEN LB.NumberOfPeople ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'NumberOfPeople DESC' THEN LB.NumberOfPeople ELSE NULL END DESC

   ) AS RowNumber,
	LB.LocationBookingId,
	LB.BookingId,
	LB.LocationId,
	LB.FurnituringId,
	LB.StartTime,
	LB.EndTime,
	LB.NumberOfPeople,
	LB.CalculatedBookingPrice,

	L.Name AS LocationName,
	F.Name AS FurnituringName

	-- Store in temporary table
	INTO #LocationBookingResults

	-- Join other tables
	FROM appSchema.LocationBooking AS LB
	LEFT JOIN appSchema.Location AS L ON L.LocationId = LB.LocationId
	LEFT JOIN appSchema.Furnituring AS F ON F.FurnituringId = LB.FurnituringId

	-- Apply optional search filters
	WHERE
			(@LocationBookingId IS NULL OR LB.LocationBookingId = @LocationBookingId)
		AND (@BookingId IS NULL OR LB.BookingId = @BookingId)
		AND (@LocationId IS NULL OR LB.LocationId = @LocationId)
		AND (@FurnituringId IS NULL OR LB.FurnituringId = @FurnituringId)
		AND (@StartTime IS NULL OR LB.StartTime = @StartTime)
		AND (@EndTime IS NULL OR LB.EndTime = @EndTime)
		AND (@NumberOfPeople IS NULL OR LB.NumberOfPeople = @NumberOfPeople)

	-- Apply pagination
	SELECT *
	FROM #LocationBookingResults 
	WHERE
		RowNumber > @FirstRow
		AND RowNumber < @LastRow
	ORDER BY RowNumber ASC


	-- Dispose table
	DROP TABLE #LocationBookingResults

END

GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationBookingsForPeriod]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Johnny Pesola 2015-04-19
--===========================================--

CREATE PROCEDURE [appSchema].[usp_LocationBookingsForPeriod]

   -- Optional Search parameters
   @StartTime smalldatetime,
   @EndTime smalldatetime

AS
BEGIN

	/*SELECT * INTO #TempTable FROM
	(
	*/
		-- Location Bookings
		SELECT 
			LB.LocationBookingId,
			LB.BookingId,
			B.Provisional,
			L.Name AS LocationName,
			L.LocationId,
			LB.NumberOfPeople,
			LF.MaxPeople,
			LB.FurnituringId,
			F.Name AS FurnituringName,

			LB.StartTime AS StartTime,
			LB.EndTime AS EndTime,

			L.MinutesMarginAfterBooking AS MinutesMarginAfterBooking,

			LB.CalculatedBookingPrice AS CalculatedBookingPrice

		FROM appSchema.LocationBooking AS LB
		LEFT JOIN appSchema.Booking AS B ON B.BookingId = LB.BookingId
		LEFT JOIN appSchema.Location AS L ON L.LocationId = LB.LocationId
		LEFT JOIN appSchema.Furnituring AS F ON LB.FurnituringId = F.FurnituringId
		LEFT JOIN appSchema.LocationFurnituring AS LF ON LF.LocationId = L.LocationId
		WHERE
			LF.FurnituringId = LB.FurnituringId AND
			LB.StartTime >= @StartTime AND
			LB.StartTime <= @EndTime OR

			LF.FurnituringId = LB.FurnituringId AND
			LB.EndTime >= @StartTime AND
			LB.EndTime <= @EndTime OR

			LF.FurnituringId = LB.FurnituringId AND
			LB.StartTime < @StartTime AND 
			LB.EndTime > @EndTime
		ORDER BY
			LB.StartTime
/*
	) AS TMP

	-- Add Columns from Booking and Customer tables
	
	SELECT
		T.BookingId,
		B.Name AS BookingName,
		B.NumberOfPeople,
		B.Provisional,
		C.Name AS CustomerName,
		B.CustomerId AS CustomerID,
		T.Name AS TypeName,
		T.[Type],
		T.TypeId,
		T.[Count],
		T.StartTime,
		T.EndTime
	FROM #TempTable AS T
	LEFT JOIN appSchema.Booking AS B ON B.BookingId = T.BookingId
	LEFT JOIN appSchema.Customer AS C ON B.CustomerId = C.CustomerId
	ORDER BY CustomerName, StartTime

	-- Dispose table
	DROP TABLE #TempTable
	*/
END

GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationBookingUpdate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-22
--=============================================
CREATE PROCEDURE [appSchema].[usp_LocationBookingUpdate]

   -- In Parameters
	@LocationBookingId int,
	@BookingId int,
	@LocationId int,
	@FurnituringId smallint,
	@StartTime smalldatetime,
	@EndTime smalldatetime,
	@NumberOfPeople smallint

AS
BEGIN

	-- Check if the location is booked already.
	IF ( appSchema.IsLocationAlreadyBooked(@LocationID, @StartTime, @Endtime, @BookingId) = 1 )
	BEGIN
		RAISERROR('The location is already booked at the given time.', 16, 1)
		RETURN 1
	END

	-- Update booking if it exists
	IF (EXISTS(SELECT LocationBookingId FROM appSchema.LocationBooking WHERE LocationBookingId = @LocationBookingId))
	BEGIN
		-- Update booking
		UPDATE appSchema.LocationBooking
		SET
			BookingId = @BookingId,
			LocationId = @LocationId,
			FurnituringId = @FurnituringId,
			StartTime = @StartTime,
			EndTime = @EndTime,
			NumberOfPeople = @NumberOfPeople

		WHERE LocationBookingId = @LocationBookingId
	END

	-- If no rows were updated
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('The location booking could not be updated.', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationCreate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-03-08
--=============================================

CREATE PROCEDURE [appSchema].[usp_LocationCreate]

   -- In Parameters
   @Name varchar(50),
   @MaxPeople smallint,
   @GPSLongitude decimal(18,15) = NULL,
   @GPSLatitude decimal(18,15) = NULL,
   @ImageSrc varchar(50) = NULL,
   @BookingPricePerHour decimal(12,2) = 0,
   @MinutesMarginAfterBooking int = 0,

   -- Out parameters
   @InsertId int = NULL OUTPUT

AS
BEGIN

	-- Declare local variables
	DECLARE @LocationName varchar(50)
	DECLARE @GPSGeography geography 


	-- Check that there isnt allready a location with this name.
	IF EXISTS(SELECT Name FROM Location WHERE Name = @Name)
	BEGIN
		RAISERROR('There is already a location with the given name.', 16, 1)
		RETURN
	END

	-- Convert GPS cordinates to geography object type
	IF (@GPSLatitude IS NOT NULL)
	BEGIN
		SET @GPSGeography = GEOGRAPHY::Point(@GPSLatitude, @GPSLongitude, 4326) -- 4326 is most common coordinate system used by GPS/Maps
	END

	-- Insert new location
	INSERT INTO appSchema.Location
		(
			Name,
			MaxPeople,
			GPSPosition,
			ImageSrc,
			BookingPricePerHour,
			MinutesMarginAfterBooking
		)
	VALUES
		(
			@Name,
			@MaxPeople,
			@GPSGeography,
			@ImageSrc,
			@BookingPricePerHour,
			@MinutesMarginAfterBooking
		)

	-- Set out variable
	SET @InsertId = SCOPE_IDENTITY();

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationDelete]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-03-08
--=============================================
CREATE PROCEDURE [appSchema].[usp_LocationDelete]

   -- In Parameters
   @LocationId int

AS
BEGIN

	-- Delete booking if it exists
	IF (EXISTS(SELECT LocationId FROM appSchema.Location WHERE LocationId = @LocationId))
	BEGIN
		-- Check if there are any foreign key references
		IF (EXISTS	(	
						SELECT LocationId 
						FROM appSchema.LocationBooking
						WHERE LocationId = @LocationId
					)
		)
		BEGIN
			RAISERROR('Foreign key references exists', 16, 1)
			RETURN 1
		END
		ELSE

		BEGIN
			DELETE FROM appSchema.Location
			WHERE LocationId = @LocationId
		END
	END

	-- If no rows were deleted
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('Location could not be deleted', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END

GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationFurnituringCreate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-16
--=============================================

CREATE PROCEDURE [appSchema].[usp_LocationFurnituringCreate]

   -- In Parameters
   @LocationId int,
   @FurnituringId smallint,
   @MaxPeople int

AS
BEGIN

	-- Check that there isnt allready an equal location furnituring.
	IF EXISTS(SELECT LocationId FROM LocationFurnituring WHERE LocationId = @LocationId AND FurnituringId = @FurnituringId)
	BEGIN
		RAISERROR('There is already a location furnituring with the given data.', 16, 1)
		RETURN
	END

	-- Insert new location furnituring
	INSERT INTO appSchema.LocationFurnituring
		(
			LocationId,
			FurnituringId,
			MaxPeople
		)
	VALUES
		(
			@LocationId,
			@FurnituringId,
			@MaxPeople
		)

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationFurnituringDelete]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-15-16
--=============================================
CREATE PROCEDURE [appSchema].[usp_LocationFurnituringDelete]

   -- In Parameters
   @LocationId int,
   @FurnituringId int = NULL

AS
BEGIN
	

	IF (@FurnituringId IS NULL)
	BEGIN
		-- Delete location furnituring if it exists. Deletes all for specific LocationId
		IF (EXISTS(SELECT LocationId FROM appSchema.LocationFurnituring WHERE LocationId = @LocationId))
		BEGIN
			DELETE FROM appSchema.LocationFurnituring
			WHERE LocationId = @LocationId
		END
	END
	ELSE
	BEGIN
		-- Delete location furnituring if it exists
		IF (EXISTS(SELECT LocationId FROM appSchema.LocationFurnituring WHERE LocationId = @LocationId AND FurnituringId = @FurnituringId))
		BEGIN
			DELETE FROM appSchema.LocationFurnituring
			WHERE LocationId = @LocationId AND FurnituringId = @FurnituringId
		END
	END
	-- If no rows were deleted
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('Location furnituring could not be deleted', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END

GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationFurnituringList]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-05-16
--===========================================--
CREATE PROCEDURE [appSchema].[usp_LocationFurnituringList]

   -- Optional Search parameters
   @LocationId int = NULL,
   @LocationName varchar(50) = NULL,
   @FurnituringId smallint = NULL,
   @FurnituringName varchar(50) = NULL,
   @MaxPeople int = NULL

AS
BEGIN
    SELECT
		LF.LocationId,
		L.Name AS LocationName,
		LF.FurnituringId,
		F.Name AS FurnituringName,
		LF.MaxPeople
	FROM appSchema.LocationFurnituring AS LF
	LEFT JOIN appSchema.Location AS L ON L.LocationId = LF.LocationId
	LEFT JOIN appSchema.Furnituring AS F ON F.FurnituringId = LF.FurnituringId

	-- Apply optional search filters
	WHERE
			(@LocationId IS NULL OR LF.LocationId = @LocationId)
		AND (@LocationName IS NULL OR L.Name LIKE '%' + @LocationName + '%')
		AND (@FurnituringId IS NULL OR LF.FurnituringId = @FurnituringId)
		AND (@FurnituringName IS NULL OR F.Name LIKE '%' + @FurnituringName + '%')
		AND (@MaxPeople IS NULL OR LF.MaxPeople = @MaxPeople)

	ORDER BY LocationId

END



GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationFurnituringUpdate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-16
--=============================================

CREATE PROCEDURE [appSchema].[usp_LocationFurnituringUpdate]

   -- In Parameters
   @LocationId int,
   @FurnituringId smallint,
   @MaxPeople int

AS
BEGIN


	-- Update location furnituring if it exists
	IF (EXISTS(SELECT LocationId FROM appSchema.LocationFurnituring WHERE LocationId = @LocationId AND FurnituringId = @FurnituringId))
	BEGIN
		-- Update location furnituring
		UPDATE appSchema.LocationFurnituring
		SET
			MaxPeople = @MaxPeople
		WHERE LocationId = @LocationId AND FurnituringId = @FurnituringId
	END

	-- If no rows were updated
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('The location furnituring could not be updated.', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationList]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-03-07
--=============================================
-- Supports:
--	*	Pagination
--	*	Order after specific column
--	*	Search filtering for multiple columns
--=============================================
CREATE PROCEDURE [appSchema].[usp_LocationList]

   -- Optional Search parameters
   @LocationId int = NULL,
   @Name varchar(50) = NULL,
   @MaxPeople smallint = NULL,
   @ImageSrc varchar(30) = NULL,
   @BookingPricePerHour decimal(12,2) = NULL,

   -- Pagination parameters 
   @PageIndex int = 1,
   @PageSize int = 10,

   -- Sorting Parameters
   @SortOrder varchar(25) = 'Name ASC',

   -- Out parameters
   @TotalRowCount int = 0 OUTPUT

AS
BEGIN
	-- Declare Local variables	
	DECLARE @FirstRow int,
			@LastRow int,
			@TotalRows int

	-- Calculate and set local pagination variables
	SET @FirstRow = ( @PageIndex - 1 ) * @PageSize
	SET @LastRow = ( @PageIndex * @PageSize + 1 )
	SET @TotalRows = @FirstRow - @LastRow + 1;


	-- Apply rownumbers (for pagination)
    SELECT ROW_NUMBER() OVER (

		-- Order by @SortOrder variable.
		ORDER BY 
		CASE WHEN @SortOrder = 'Name ASC' THEN Location.Name ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Name DESC' THEN Location.Name ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'MaxPeople ASC' THEN Location.MaxPeople ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'MaxPeople DESC' THEN Location.MaxPeople ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'BookingPricePerHour ASC' THEN Location.BookingPricePerHour ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'BookingPricePerHour DESC' THEN Location.BookingPricePerHour ELSE NULL END DESC

   ) AS RowNumber,
	Location.LocationId,
	Name,
	MaxPeople,
	CAST(GPSPosition.Long AS decimal(18,15)) AS GPSLongitude,
	CAST(GPSPosition.Lat AS decimal(18,15)) AS GPSLatitude,
	ImageSrc,
	BookingPricePerHour,
	(SELECT COUNT(LocationBookingId) FROM appSchema.LocationBooking WHERE LocationBooking.LocationId = Location.LocationId) AS TotalBookings,
	(SELECT SUM(CalculatedBookingPrice) FROM appSchema.LocationBooking WHERE LocationBooking.LocationId = Location.LocationId) AS TotalBookingValue,
	MinutesMarginAfterBooking

	-- Store in temporary table
	INTO #LocationResults

	FROM appSchema.Location

	-- Apply optional search filters
	WHERE
			(@LocationId IS NULL OR LocationId = @LocationId)
		AND (@Name IS NULL OR Name LIKE '%' + @Name + '%')
		AND (@MaxPeople IS NULL OR MaxPeople = @MaxPeople)
		AND (@ImageSrc IS NULL OR ImageSrc LIKE '%' + @ImageSrc + '%')
		AND (@BookingPricePerHour IS NULL OR BookingPricePerHour = @BookingPricePerHour)

	-- Apply pagination
	SELECT *
	FROM #LocationResults 
	WHERE
		RowNumber > @FirstRow
		AND RowNumber < @LastRow
	ORDER BY RowNumber ASC

	-- Set TotalRowCount output variable
	SELECT @TotalRowCount = COUNT(RowNumber) FROM #LocationResults

	-- Dispose table
	DROP TABLE #LocationResults

END





GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationListSimple]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-03-12
--===========================================--
CREATE PROCEDURE [appSchema].[usp_LocationListSimple]

AS
BEGIN
    SELECT
		LocationId,
		Name,
		MaxPeople,
		CAST(GPSPosition.Long AS decimal(18,15)) AS GPSLongitude,
		CAST(GPSPosition.Lat AS decimal(18,15)) AS GPSLatitude,
		ImageSrc,
		BookingPricePerHour,
		(SELECT COUNT(LocationBookingId) FROM appSchema.LocationBooking WHERE LocationBooking.LocationId = Location.LocationId) AS TotalBookings


	FROM appSchema.Location
	ORDER BY Name
END



GO
/****** Object:  StoredProcedure [appSchema].[usp_LocationUpdate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-03-08
--=============================================

CREATE PROCEDURE [appSchema].[usp_LocationUpdate]

   -- In Parameters
   @LocationId int,
   @Name varchar(50),
   @MaxPeople smallint,
   @GPSLongitude decimal(18,15),
   @GPSLatitude decimal(18,15),
   @ImageSrc varchar(50) = NULL,
   @BookingPricePerHour decimal(12,2) = 0,
   @MinutesMarginAfterBooking smallint = 0

AS
BEGIN

	-- Declare local variables
	DECLARE @GPSGeography geography 

	-- Check that there isnt allready a location with this name.
	IF EXISTS(SELECT Name FROM Location WHERE Name = @Name AND LocationId != @LocationId)
	BEGIN
		RAISERROR('There is already a location with the given name.', 16, 1)
		RETURN
	END

	-- Convert GPS cordinates to geography object type
	IF (@GPSLatitude IS NOT NULL)
	BEGIN
		SET @GPSGeography = GEOGRAPHY::Point(@GPSLatitude, @GPSLongitude, 4326) -- 4326 is most common coordinate system used by GPS/Maps
	END

	-- Update location if it exists
	IF (EXISTS(SELECT LocationId FROM appSchema.Location WHERE LocationId = @LocationId))
	BEGIN
		-- Update location
		UPDATE appSchema.Location
		SET
			Name = @Name,
			MaxPeople = @MaxPeople,
			GPSPosition = @GPSGeography,
			ImageSrc = @ImageSrc,
			BookingPricePerHour = @BookingPricePerHour,
			MinutesMarginAfterBooking = @MinutesMarginAfterBooking

		WHERE LocationId = @LocationId
	END

	-- If no rows were updated
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('The location could not be updated.', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_ResourceCreate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-15
--=============================================

CREATE PROCEDURE [appSchema].[usp_ResourceCreate]

   -- In Parameters
   @Name varchar(50),
   @Count smallint,
   @BookingPricePerHour decimal(12,2) = NULL,
   @MinutesMarginAfterBooking smallint = 0,
   @WeekEndCount smallint = 0,

   -- Out parameters
   @InsertId int = NULL OUTPUT

AS
BEGIN

	-- Declare local variables
	DECLARE @LocationName varchar(50)

	-- Check that there isnt allready a location with this name.
	IF EXISTS(SELECT Name FROM [Resource] WHERE Name = @Name)
	BEGIN
		RAISERROR('There is already a resource with the given name.', 16, 1)
		RETURN
	END

	-- Insert new resource
	INSERT INTO appSchema.[Resource]
		(
			Name,
			[Count],
			BookingPricePerHour,
			MinutesMarginAfterBooking,
			WeekEndCount
		)
	VALUES
		(
			@Name,
			@Count,
			@BookingPricePerHour,
			@MinutesMarginAfterBooking,
			@WeekEndCount
		)

	-- Set out variable
	SET @InsertId = SCOPE_IDENTITY();

END


GO
/****** Object:  StoredProcedure [appSchema].[usp_ResourceDelete]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-15
--=============================================
CREATE PROCEDURE [appSchema].[usp_ResourceDelete]

   -- In Parameters
   @ResourceId int

AS
BEGIN

	-- Delete booking if it exists
	IF (EXISTS(SELECT ResourceId FROM appSchema.[Resource] WHERE ResourceId = @ResourceId))
	BEGIN
		-- Check if there are any foreign key references
		IF (EXISTS	(	
						SELECT ResourceId 
						FROM appSchema.ResourceBooking
						WHERE ResourceId = @ResourceId
					)
		)
		BEGIN
			RAISERROR('Foreign key references exists', 16, 1)
			RETURN 1
		END
		ELSE
	
		BEGIN
			DELETE FROM appSchema.[Resource]
			WHERE ResourceId = @ResourceId
		END
	END

	-- If no rows were deleted
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('Resource could not be deleted', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0
END


GO
/****** Object:  StoredProcedure [appSchema].[usp_ResourceList]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-05-15
--=============================================
-- Supports:
--	*	Pagination
--	*	Order after specific column
--	*	Search filtering for multiple columns
--=============================================
CREATE PROCEDURE [appSchema].[usp_ResourceList]

   -- Optional Search parameters
   @ResourceId int = NULL,
   @Name varchar(50) = NULL,
   @Count smallint = NULL,
   @BookingPricePerHour decimal(12,2) = NULL,
   @MinutesMarginAfterBooking smallint = NULL,
   @WeekEndCount smallint = NULL,

   -- Pagination parameters 
   @PageIndex int = 1,
   @PageSize int = 10,

   -- Sorting Parameters
   @SortOrder varchar(25) = 'Name ASC',

   -- Out parameters
   @TotalRowCount int = 0 OUTPUT

AS
BEGIN
	-- Declare Local variables	
	DECLARE @FirstRow int,
			@LastRow int,
			@TotalRows int

	-- Calculate and set local pagination variables
	SET @FirstRow = ( @PageIndex - 1 ) * @PageSize
	SET @LastRow = ( @PageIndex * @PageSize + 1 )
	SET @TotalRows = @FirstRow - @LastRow + 1;


	-- Apply rownumbers (for pagination)
    SELECT ROW_NUMBER() OVER (

		-- Order by @SortOrder variable.
		ORDER BY 
		CASE WHEN @SortOrder = 'Name ASC' THEN [Resource].Name ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Name DESC' THEN [Resource].Name ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'Count ASC' THEN [Resource].[Count] ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'Count DESC' THEN [Resource].[Count] ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'BookingPricePerHour ASC' THEN [Resource].BookingPricePerHour ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'BookingPricePerHour DESC' THEN [Resource].BookingPricePerHour ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'MinutesMarginAfterBooking ASC' THEN [Resource].MinutesMarginAfterBooking ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'MinutesMarginAfterBooking DESC' THEN [Resource].MinutesMarginAfterBooking ELSE NULL END DESC,

		CASE WHEN @SortOrder = 'WeekEndCount ASC' THEN [Resource].WeekEndCount ELSE NULL END ASC,
		CASE WHEN @SortOrder = 'WeekEndCount DESC' THEN [Resource].WeekEndCount ELSE NULL END DESC

   ) AS RowNumber,
	[Resource].ResourceId,
	Name,
	[Count],
	BookingPricePerHour,
	(SELECT COUNT(ResourceBookingId) FROM appSchema.ResourceBooking WHERE ResourceBooking.ResourceId = [Resource].ResourceId) AS TotalBookings,
	(SELECT SUM(CalculatedBookingPrice) FROM appSchema.ResourceBooking WHERE ResourceBooking.ResourceId = [Resource].ResourceId) AS TotalBookingValue,
	MinutesMarginAfterBooking,
	WeekEndCount

	-- Store in temporary table
	INTO #ResourceResults

	FROM appSchema.[Resource]

	-- Apply optional search filters
	WHERE
			(@ResourceId IS NULL OR ResourceId = @ResourceId)
		AND (@Name IS NULL OR Name LIKE '%' + @Name + '%')
		AND (@Count IS NULL OR [Count] = @Count)
		AND (@BookingPricePerHour IS NULL OR BookingPricePerHour = @BookingPricePerHour)
		AND (@MinutesMarginAfterBooking IS NULL OR MinutesMarginAfterBooking = @MinutesMarginAfterBooking)
		AND (@WeekEndCount IS NULL OR WeekEndCount = @WeekEndCount)

	-- Apply pagination
	SELECT *
	FROM #ResourceResults 
	WHERE
		RowNumber > @FirstRow
		AND RowNumber < @LastRow
	ORDER BY RowNumber ASC

	-- Set TotalRowCount output variable
	SELECT @TotalRowCount = COUNT(RowNumber) FROM #ResourceResults

	-- Dispose table
	DROP TABLE #ResourceResults

END





GO
/****** Object:  StoredProcedure [appSchema].[usp_ResourceListSimple]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Johnny Pesola 2015-05-15
--===========================================--
CREATE PROCEDURE [appSchema].[usp_ResourceListSimple]

AS
BEGIN
    SELECT
		ResourceId,
		Name,
		[Count],
		BookingPricePerHour,
		MinutesMarginAfterBooking,
		WeekEndCount,
		(SELECT COUNT(ResourceBookingId) FROM appSchema.ResourceBooking WHERE ResourceBooking.ResourceId = [Resource].ResourceId) AS TotalBookings

	FROM appSchema.Resource
	ORDER BY Name
END



GO
/****** Object:  StoredProcedure [appSchema].[usp_ResourceUpdate]    Script Date: 2015-05-27 03:09:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--=============================================
-- Johnny Pesola 2015-05-15
--=============================================

CREATE PROCEDURE [appSchema].[usp_ResourceUpdate]

   -- In Parameters
   @ResourceId int,
   @Name varchar(50),
   @Count smallint,
   @BookingPricePerHour decimal(12,2) = 0,
   @MinutesMarginAfterBooking smallint = 0,
   @WeekEndCount smallint = 0

AS
BEGIN

	-- Check that there isnt allready a Resource with this name.
	IF EXISTS(SELECT Name FROM [Resource] WHERE Name = @Name AND ResourceId != @ResourceId)
	BEGIN
		RAISERROR('There is already a resource with the given name.', 16, 1)
		RETURN
	END

	-- Update Resource if it exists
	IF (EXISTS(SELECT ResourceId FROM appSchema.[Resource] WHERE ResourceId = @ResourceId))
	BEGIN
		-- Update Resource
		UPDATE appSchema.[Resource]
		SET
			Name = @Name,
			[Count] = @Count,
			BookingPricePerHour = @BookingPricePerHour,
			MinutesMarginAfterBooking = @MinutesMarginAfterBooking,
			WeekEndCount = @WeekEndCount

		WHERE ResourceId = @ResourceId
	END

	-- If no rows were updated
	IF @@ROWCOUNT = 0
	BEGIN
		RAISERROR('The resource could not be updated.', 16, 1)
		RETURN 1
	END

	-- Return success
	RETURN 0

END


GO
USE [master]
GO
ALTER DATABASE [BookingSystem] SET  READ_WRITE 
GO
