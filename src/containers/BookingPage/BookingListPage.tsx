import React, { FC, useState, useEffect } from "react";
import StayCardH from "components/StayCardH/StayCardH";
import { AppDispatch } from "redux/store";
import Heading2 from "components/Heading/Heading2";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "redux/store";
import Stay from "models/stay";
import User from "models/user";
import { getAllStay } from "redux/slices/staySlice";
import BookingCardH from "components/BookingCard/BookingCardH";
import { Booking } from "models/booking";
import stayService from "api/stayApi";
export interface BookingListPageProps {}

const BookingListPage: FC<BookingListPageProps> = () => {
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    const fetchBookingList = async () => {
      try {
        const bookingList = await stayService.getBookingList();
        setBookings(bookingList.content);
      } catch (error) {
        console.log("Error fetching booking list:", error);
      }
    };

    fetchBookingList();
  }, []);




  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        {/* CARDSSSS */}
        <div className="min-h-screen w-full xl:w-[780px] 2xl:w-[880px] flex-shrink-0 xl:px-8 ">
          <Heading2
            heading={"Lịch sử đặt phòng"}
            subHeading={`Bạn đã đặt ${bookings.length} phòng`}
          />
          {/* <div className="mb-8 lg:mb-11">
            <TabFilters />
          </div> */}
          <div className="grid grid-cols-1 gap-8">
            {bookings.map((booking: Booking) => {
              return (
                <div
                  key={booking.id}
                  onMouseEnter={() => setCurrentHoverID((_) => booking.id)}
                  onMouseLeave={() => setCurrentHoverID((_) => -1)}
                >
                  <BookingCardH data={booking} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingListPage;
