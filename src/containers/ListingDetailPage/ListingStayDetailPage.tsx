import React, { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import LocationMarker from "components/AnyReactComponent/LocationMarker";
import CommentListing from "components/CommentListing/CommentListing";
import FiveStartIconForRate from "components/FiveStartIconForRate/FiveStartIconForRate";
import GuestsInput from "components/HeroSearchForm/GuestsInput";
import { DateRage } from "components/HeroSearchForm/StaySearchForm";
import StartRating from "components/StartRating/StartRating";
import GoogleMapReact from "google-map-react";
import useWindowSize from "hooks/useWindowResize";
import moment from "moment";
import {
  DayPickerRangeController,
  FocusedInputShape,
  isInclusivelyAfterDay,
} from "react-dates";
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonCircle from "shared/Button/ButtonCircle";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Input from "shared/Input/Input";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import ModalPhotos from "./ModalPhotos";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSliderNewCategories from "components/SectionSliderNewCategories/SectionSliderNewCategories";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import StayDatesRangeInput from "components/HeroSearchForm/StayDatesRangeInput";
import MobileFooterSticky from "./MobileFooterSticky";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getStayByID, likeStayByID } from "redux/slices/staySlice";
import Stay from "models/stay";
import { mean } from "lodash";
import Rating from "models/rating";
import { createRating, getRatingByStay } from "redux/slices/rating";
import toast from "react-hot-toast";

export interface ListingStayDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const Amenities_demos = [
  { name: "la-key", icon: "la-key" },
  { name: "la-luggage-cart", icon: "la-luggage-cart" },
  { name: "la-shower", icon: "la-shower" },
  { name: "la-smoking", icon: "la-smoking" },
  { name: "la-snowflake", icon: "la-snowflake" },
  { name: "la-spa", icon: "la-spa" },
  { name: "la-suitcase", icon: "la-suitcase" },
  { name: "la-suitcase-rolling", icon: "la-suitcase-rolling" },
  { name: "la-swimmer", icon: "la-swimmer" },
  { name: "la-swimming-pool", icon: "la-swimming-pool" },
  { name: "la-tv", icon: "la-tv" },
  { name: "la-umbrella-beach", icon: "la-umbrella-beach" },
  { name: "la-utensils", icon: "la-utensils" },
  { name: "la-wheelchair", icon: "la-wheelchair" },
  { name: "la-wifi", icon: "la-wifi" },
  { name: "la-baby-carriage", icon: "la-baby-carriage" },
  { name: "la-bath", icon: "la-bath" },
  { name: "la-bed", icon: "la-bed" },
  { name: "la-briefcase", icon: "la-briefcase" },
  { name: "la-car", icon: "la-car" },
  { name: "la-cocktail", icon: "la-cocktail" },
  { name: "la-coffee", icon: "la-coffee" },
  { name: "la-concierge-bell", icon: "la-concierge-bell" },
  { name: "la-dice", icon: "la-dice" },
  { name: "la-dumbbell", icon: "la-dumbbell" },
  { name: "la-hot-tub", icon: "la-hot-tub" },
  { name: "la-infinity", icon: "la-infinity" },
];

const ListingStayDetailPage: FC<ListingStayDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {
  const { id } = useParams();
  const windowSize = useWindowSize();
  const dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();
  const stay = useSelector<RootState, Stay>((state) => state.stayStore.stay);
  const ratings = useSelector<RootState, Rating[]>(
    (state) => state.ratingStore.ratings
  );
  const [guestValue, setGuestValue] = useState({});
  const [isRefesh, setIsRefesh] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<DateRage>({
    startDate: null,
    endDate: null,
  });
  const [focusedInputSectionCheckDate, setFocusedInputSectionCheckDate] =
    useState<FocusedInputShape>("startDate");
  let [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const [rating, setRating] = useState<Rating>({
    rate: 0,
    message: "",
    stayid: "",
  });
  const [maxPeople, setMaxPeople] = useState<number>();

  useEffect(() => {
    dispatch(getStayByID(id || ""));
  }, [id]);

  useEffect(() => {
    dispatch(getRatingByStay(id || ""));
  }, [isRefesh]);

  const getDaySize = () => {
    if (windowSize.width <= 375) {
      return 34;
    }
    if (windowSize.width <= 500) {
      return undefined;
    }
    if (windowSize.width <= 1280) {
      return 56;
    }
    return 48;
  };

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };

  const handleCloseModal = () => setIsOpen(false);

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge name={stay?.type || ""} />
          {/* <LikeSaveBtns /> */}
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {stay?.name || ""}
        </h2>

        {/* 3 */}
        <div className="flex items-center space-x-4">
          {Array.isArray(stay?.stayRating) && stay.stayRating?.length > 0 && (
            <StartRating
              point={mean(stay?.stayRating)}
              reviewCount={stay?.stayRating?.length}
            />
          )}
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1">{stay?.addressDescription || ""}</span>
          </span>
        </div>

        {/* 4 */}
        <div className="flex items-center">
          <Avatar hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Được đăng bởi{" "}
            {stay?.host && (
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                {stay?.host?.email || ""}
              </span>
            )}
          </span>
        </div>

        {/* 5 */}
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />
        

        {/* 6 */}
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Thông tin chi tiết</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300">
          <span>{stay?.stayDescription}</span>
          <br />
        </div>
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      stay?.amenities &&
      Array.isArray(stay?.amenities) &&
      stay?.amenities?.length > 0 && (
        <div className="listingSection__wrap">
          <div>
            <h2 className="text-2xl font-semibold">Tiện ích </h2>
            <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
              Giới thiệu về các tiện nghi và dịch vụ của khách sạn
            </span>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          {/* 6 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
            {stay?.amenities
              .filter((_, i) => i < 12)
              .map((item) => (
                <div key={item.name} className="flex items-center space-x-3">
                  <NcImage
                    containerClassName="inset-0"
                    className="object-cover w-10 h-10 rounded-md sm:rounded-xl"
                    src={item.icons || ""}
                  />
                  <span className=" ">{item.name}</span>
                </div>
              ))}
          </div>

          {/* ----- */}
          <div className="w-14 border-b border-neutral-200"></div>
          {/* {stay.amenities?.length > 12 && (
            <div>
              <ButtonSecondary onClick={openModalAmenities}>
                View more 20 amenities
              </ButtonSecondary>
            </div>
          )} */}

        </div>
      )
    );
  };

  const renderMotalAmenities = () => {
    return (
      <Transition appear show={isOpenModalAmenities} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-screen w-full max-w-4xl">
                <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="headlessui-dialog-title-70"
                    >
                      Amenities
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalAmenities} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {Amenities_demos.filter((_, i) => i < 1212).map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8"
                      >
                        <i
                          className={`text-4xl text-neutral-6000 las ${item.icon}`}
                        ></i>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  // const renderSection4 = () => {
  //   return (
  //     <div className="listingSection__wrap">
  //       {/* HEADING */}
  //       <div>
  //         <h2 className="text-2xl font-semibold">Room Rates </h2>
  //         <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
  //           Prices may increase on weekends or holidays
  //         </span>
  //       </div>
  //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
  //       {/* CONTENT */}
  //       <div className="flow-root">
  //         <div className="text-sm sm:text-base text-neutral-6000 dark:text-neutral-300 -mb-4">
  //           <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
  //             <span>Monday - Thursday</span>
  //             <span>$199</span>
  //           </div>
  //           <div className="p-4  flex justify-between items-center space-x-4 rounded-lg">
  //             <span>Monday - Thursday</span>
  //             <span>$199</span>
  //           </div>
  //           <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
  //             <span>Friday - Sunday</span>
  //             <span>$219</span>
  //           </div>
  //           <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
  //             <span>Rent by month</span>
  //             <span>-8.34 %</span>
  //           </div>
  //           <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
  //             <span>Minimum number of nights</span>
  //             <span>1 night</span>
  //           </div>
  //           <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
  //             <span>Max number of nights</span>
  //             <span>90 nights</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const renderSectionCheckIndate = () => {
    return (
      <div className="listingSection__wrap overflow-hidden">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Ngày có thể đặt</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Giá có thể tăng vào cuối tuần hoặc ngày lễ
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* CONTENT */}

        <div className="listingSection__wrap__DayPickerRangeController flow-root">
          <div className="-mx-4 sm:mx-auto xl:mx-[-22px]">
            <DayPickerRangeController
              startDate={selectedDate.startDate}
              endDate={selectedDate.endDate}
              onDatesChange={(date) => setSelectedDate(date)}
              focusedInput={focusedInputSectionCheckDate}
              onFocusChange={(focusedInput) =>
                setFocusedInputSectionCheckDate(focusedInput || "startDate")
              }
              initialVisibleMonth={null}
              numberOfMonths={windowSize.width < 1280 ? 1 : 2}
              daySize={getDaySize()}
              hideKeyboardShortcutsPanel={false}
              isOutsideRange={(day) => !isInclusivelyAfterDay(day, moment())}
            />
          </div>
        </div>
      </div>
    );
  };

  // const renderSection5 = () => {
  // //   return (
  // //     <div className="listingSection__wrap">
  // //       {/* HEADING */}
  // //       <h2 className="text-2xl font-semibold">Thông tin người cho thuê</h2>
  // //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

  // //       {/* host */}
  // //       <div className="flex items-center space-x-4">
  // //         <Avatar
  // //           hasChecked
  // //           hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
  // //           sizeClass="h-14 w-14"
  // //           radius="rounded-full"
  // //         />
  // //         <div>
  // //           <a className="block text-xl font-medium" href="##">
  // //             {stay.host?.email}
  // //           </a>
  // //           {/* <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
  // //             <StartRating />
  // //             <span className="mx-2">·</span>
  // //             <span> 12 places</span>
  // //           </div> */}
  // //         </div>
  // //       </div>

  // //       {/* desc */}
  // //       {/* <span className="block text-neutral-6000 dark:text-neutral-300">
  // //         Providing lake views, The Symphony 9 Tam Coc in Ninh Binh provides
  // //         accommodation, an outdoor swimming pool, a bar, a shared lounge, a
  // //         garden and barbecue facilities...
  // //       </span> */}

  // //       {/* info */}
  // //       <div className="block text-neutral-500 dark:text-neutral-400 space-y-2.5">
  // //         <div className="flex items-center space-x-3">
  // //           <svg
  // //             xmlns="http://www.w3.org/2000/svg"
  // //             className="h-6 w-6"
  // //             fill="none"
  // //             viewBox="0 0 24 24"
  // //             stroke="currentColor"
  // //           >
  // //             <path
  // //               strokeLinecap="round"
  // //               strokeLinejoin="round"
  // //               strokeWidth={1.5}
  // //               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  // //             />
  // //           </svg>
  // //           <span>Joined in March 2016</span>
  // //         </div>
  // //         <div className="flex items-center space-x-3">
  // //           <svg
  // //             xmlns="http://www.w3.org/2000/svg"
  // //             className="h-6 w-6"
  // //             fill="none"
  // //             viewBox="0 0 24 24"
  // //             stroke="currentColor"
  // //           >
  // //             <path
  // //               strokeLinecap="round"
  // //               strokeLinejoin="round"
  // //               strokeWidth={1.5}
  // //               d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
  // //             />
  // //           </svg>
  // //           <span>Response rate - 100%</span>
  // //         </div>
  // //         <div className="flex items-center space-x-3">
  // //           <svg
  // //             xmlns="http://www.w3.org/2000/svg"
  // //             className="h-6 w-6"
  // //             fill="none"
  // //             viewBox="0 0 24 24"
  // //             stroke="currentColor"
  // //           >
  // //             <path
  // //               strokeLinecap="round"
  // //               strokeLinejoin="round"
  // //               strokeWidth={1.5}
  // //               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  // //             />
  // //           </svg>

  // //           <span>Fast response - within a few hours</span>
  // //         </div>
  // //       </div>

  // //       {/* == */}
  // //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
  // //       <div>
  // //         <ButtonSecondary href="##">See host profile</ButtonSecondary>
  // //       </div>
  // //     </div>
  // //   );
  // // };

  const handleRating = async () => {
    const rate = { ...rating, stayid: id };
    dispatch(createRating(rate));
    setIsRefesh(!isRefesh);
  };

  const renderSection6 = () => {
    return (
      ratings && (
        <div className="listingSection__wrap">
          {/* HEADING */}
          <h2 className="text-2xl font-semibold">
            Đánh giá ({ratings?.length})
          </h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

          {/* Content */}
          <div className="space-y-5">
            <FiveStartIconForRate
              iconClass="w-6 h-6"
              className="space-x-0.5"
              onRating={(rate) => setRating({ ...rating, rate: rate })}
            />
            <div className="relative">
              <Input
                fontClass=""
                sizeClass="h-16 px-4 py-3"
                rounded="rounded-3xl"
                placeholder="Hãy chia sẽ cảm nghĩ của bạn nào ..."
                onChange={(e) =>
                  setRating({ ...rating, message: e.target.value })
                }
              />
              <ButtonCircle
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size=" w-12 h-12 "
                onClick={handleRating}
              >
                <ArrowRightIcon className="w-5 h-5" />
              </ButtonCircle>
            </div>
          </div>

          {/* comment */}
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            <>
              {ratings &&
                Array.isArray(ratings) &&
                ratings?.length > 0 &&
                ratings.map((rating: Rating, index: number) => {
                  return <CommentListing className="py-8" data={rating} />;
                })}
              {/* {ratings?.length > 8 && (
                <div className="pt-8">
                  <ButtonSecondary>Xem thêm nè</ButtonSecondary>
                </div>
              )} */}
            </>
          </div>
        </div>
      )
    );
  };

  // const renderSection7 = () => {
  //   return (
  //     <div className="listingSection__wrap">
  //       {/* HEADING */}
  //       <div>
  //         <h2 className="text-2xl font-semibold">Định vị</h2>
  //         <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
  //           {stay?.addressDescription}
  //         </span>
  //       </div>
  //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

  //       {/* MAP */}
  //       <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
  //         <div className="rounded-xl overflow-hidden">
  //           <GoogleMapReact
  //             bootstrapURLKeys={{
  //               key: "AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY",
  //             }}
  //             yesIWantToUseGoogleMapApiInternals
  //             defaultZoom={15}
  //             // defaultCenter={{
  //             //   lat: 11.93474,
  //             //   lng: 108.458443,
  //             // }}
  //           >
  //             <LocationMarker lat={11.93474} lng={108.458443} />
  //           </GoogleMapReact>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // const renderSection8 = () => {
  //   return (
  //     <div className="listingSection__wrap">
  //       {/* HEADING */}
  //       <h2 className="text-2xl font-semibold">Things to know</h2>
  //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

  //       {/* CONTENT */}
  //       <div>
  //         <h4 className="text-lg font-semibold">Cancellation policy</h4>
  //         <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
  //           Refund 50% of the booking value when customers cancel the room
  //           within 48 hours after successful booking and 14 days before the
  //           check-in time. <br />
  //           Then, cancel the room 14 days before the check-in time, get a 50%
  //           refund of the total amount paid (minus the service fee).
  //         </span>
  //       </div>
  //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

  //       {/* CONTENT */}
  //       <div>
  //         <h4 className="text-lg font-semibold">Check-in time</h4>
  //         <div className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-md text-sm sm:text-base">
  //           <div className="flex space-x-10 justify-between p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
  //             <span>Check-in</span>
  //             <span>08:00 am - 12:00 am</span>
  //           </div>
  //           <div className="flex space-x-10 justify-between p-3">
  //             <span>Check-out</span>
  //             <span>02:00 pm - 04:00 pm</span>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

  //       {/* CONTENT */}
  //       <div>
  //         <h4 className="text-lg font-semibold">Special Note</h4>
  //         <div className="prose sm:prose">
  //           <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
  //             <li>
  //               Ban and I will work together to keep the landscape and
  //               environment green and clean by not littering, not using
  //               stimulants and respecting people around.
  //             </li>
  //             <li>Do not sing karaoke past 11:30</li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  const changeMaxPeople = async (data: any) => {
    setGuestValue(data);
    const peoples = Object.values(data).reduce((accumulator, current) => {
      return Number(accumulator) + Number(current);
    }, 0);
    peoples && setMaxPeople(Number(peoples));
  };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* PRICE */}
        {/* <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            <>
              ${stay?.price}
              <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
                /ngày
              </span>
            </>
          </span>
          {/* <StartRating /> */}
        {/* </div> */} 

        {/* FORM */}
        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl ">
          <StayDatesRangeInput
            wrapClassName="divide-x divide-neutral-200 dark:divide-neutral-700 !grid-cols-1 sm:!grid-cols-2"
            onChange={(date) => setSelectedDate(date)}
            fieldClassName="p-3"
            defaultValue={selectedDate}
            anchorDirection={"right"}
            className="nc-ListingStayDetailPage__stayDatesRangeInput flex-1"
          />
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInput
            className="nc-ListingStayDetailPage__guestsInput flex-1"
            fieldClassName="p-3"
            defaultValue={guestValue}
            onChange={(data) => changeMaxPeople(data)}
            hasButtonSubmit={false}
          />
        </form>

        {/* SUM */}
        <div className="flex flex-col space-y-4">
          {/* <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            {stay?.price && (
              <>
                {selectedDate.endDate != null &&
                  selectedDate.startDate != null && (
                    <span>
                      <>
                        ${stay?.price} x{" "}
                        {moment(selectedDate.endDate).diff(
                          moment(selectedDate.startDate),
                          "days"
                        )}{" "}
                        ngày
                      </>
                    </span>
                  )}
                {selectedDate.endDate != null &&
                  selectedDate.startDate != null && (
                    <span>
                      ${" "}
                      {Number(stay?.price) *
                        moment(selectedDate.endDate).diff(
                          moment(selectedDate.startDate),
                          "days"
                        )}
                    </span>
                  )}
              </>
            )}
          </div> */}
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          {/* <div className="flex justify-between font-semibold">
            <span>Tổng chi phí</span>
            {stay?.price &&
              selectedDate.endDate != null &&
              selectedDate.startDate != null && (
                <span>
                  $
                  {Number(stay?.price) *
                    moment(selectedDate.endDate).diff(
                      moment(selectedDate.startDate),
                      "days"
                    )}
                </span>
              )}
          </div> */}
        </div>

        {/* SUBMIT */}
        <ButtonPrimary onClick={handleBook}>Tiếp tục</ButtonPrimary>
      </div>
    );
  };

  const handleBook = () => {
    if (
      !maxPeople &&
      selectedDate.startDate === null &&
      selectedDate.endDate === null
    ) {
      toast.error("Vui lòng chọn thông tin !");
    } else {
      if (selectedDate.startDate === null || selectedDate.endDate === null) {
        toast.error("Vui lòng chọn ngày !");
      } else {
        if (!maxPeople) {
          toast.error("Vui lòng chọn tổng số người !");
        } else {
          navigate(
            `/checkout/${id}&${moment(selectedDate.startDate).format(
              "YYYY-MM-DDTHH:mm"
            )}&${moment(selectedDate.endDate).format(
              "YYYY-MM-DDTHH:mm"
            )}&${maxPeople}`
          );
        }
      }
    }
  };
  return (
    <div
      className={`ListingDetailPage nc-ListingStayDetailPage ${className}`}
      data-nc-id="ListingStayDetailPage"
    >
      {/* SINGLE HEADER */}
      <>
        <header className="container 2xl:px-14 rounded-md sm:rounded-xl">
          <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
            <div
              className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(0)}
            >
              {stay?.stayImage &&
                Array.isArray(stay.stayImage) &&
                stay?.stayImage?.length > 0 && (
                  <NcImage
                    containerClassName="absolute inset-0"
                    className="object-cover w-full h-full rounded-md sm:rounded-xl"
                    src={stay.stayImage[0].imgLink || ""}
                  />
                )}
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
            {stay?.stayImage &&
              stay?.stayImage
                ?.filter((_, i) => i >= 1 && i < 5)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`relative rounded-md sm:rounded-xl overflow-hidden ${
                      index >= 3 ? "hidden sm:block" : ""
                    }`}
                  >
                    <NcImage
                      containerClassName="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5"
                      className="object-cover w-full h-full rounded-md sm:rounded-xl "
                      src={item.imgLink || ""}
                    />

                    {/* OVERLAY */}
                    <div
                      className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handleOpenModal(index + 1)}
                    />
                  </div>
                ))}

            <div
              className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
              onClick={() => handleOpenModal(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="ml-2 text-neutral-800 text-sm font-medium">
                Tất cả hình ảnh
              </span>
            </div>
          </div>
        </header>
        {/* MODAL PHOTOS */}
        <ModalPhotos
          imgs={stay?.stayImage}
          isOpen={isOpen}
          onClose={handleCloseModal}
          initFocus={openFocusIndex}
          uniqueClassName="nc-ListingStayDetailPage-modalPhotos"
        />
      </>

      {/* MAIn */}
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {/* {renderSection4()} */}
          {/* {renderSectionCheckIndate()} */}
          {/* {renderSection5()} */}
          {renderSection6()}
          {/* {renderSection7()} */}
          {/* {renderSection8()} */}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>

      {/* STICKY FOOTER MOBILE */}
      {!isPreviewMode && <MobileFooterSticky />}

      {/* OTHER SECTION */}
      {!isPreviewMode && (
        <div className="container py-24 lg:py-32">
          {/* SECTION 1 */}
          {/* <div className="relative py-16">
            <BackgroundSection /ß
            <SectionSliderNewCategories
              categoryCardType="card5"
              itemPerRow={5}
              sliderStyle="style2"
              uniqueClassName={"ListingStayDetailPage1"}
            />
          </div> */}

          {/* SECTION */}
          <SectionSubscribe2 className="pt-24 lg:pt-32" />
        </div>
      )}
    </div>
  );
};

export default ListingStayDetailPage;
