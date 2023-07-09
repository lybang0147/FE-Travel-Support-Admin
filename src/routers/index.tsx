import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Page } from "./types";
import ScrollToTop from "./ScrollToTop";
import Footer from "shared/Footer/Footer";
import PageHome from "containers/PageHome/PageHome";
import Page404 from "containers/Page404/Page404";
import ListingStayPage from "containers/ListingStayPage/ListingStayPage";
import ListingStayMapPage from "containers/ListingStayPage/ListingStayMapPage";
import ListingExperiencesPage from "containers/ListingExperiencesPage/ListingExperiencesPage";
import ListingExperiencesMapPage from "containers/ListingExperiencesPage/ListingExperiencesMapPage";
import ListingStayDetailPage from "containers/ListingDetailPage/ListingStayDetailPage";
import ListingExperiencesDetailPage from "containers/ListingDetailPage/ListingExperiencesDetailPage";
import CheckOutPage from "containers/CheckOutPage/CheckOutPage";
import PayPage from "containers/PayPage/PayPage";
import AuthorPage from "containers/AuthorPage/AuthorPage";
import AccountPage from "containers/AccountPage/AccountPage";
import AccountPass from "containers/AccountPage/AccountPass";
import AccountSavelists from "containers/AccountPage/AccountSavelists";
import AccountBilling from "containers/AccountPage/AccountBilling";
import PageContact from "containers/PageContact/PageContact";
import PageAbout from "containers/PageAbout/PageAbout";
import PageSignUp from "containers/PageSignUp/PageSignUp";
import PageLogin from "containers/PageLogin/PageLogin";
import PageSubcription from "containers/PageSubcription/PageSubcription";
import PageAddListing1 from "containers/PageAddListing1/PageAddListing1";
import PageAddListing2 from "containers/PageAddListing1/PageAddListing2";
import PageAddListing3 from "containers/PageAddListing1/PageAddListing3";
import PageAddListing4 from "containers/PageAddListing1/PageAddListing4";
import PageAddListing5 from "containers/PageAddListing1/PageAddListing5";
import PageAddListing6 from "containers/PageAddListing1/PageAddListing6";
import PageAddListing7 from "containers/PageAddListing1/PageAddListing7";
import PageAddListing8 from "containers/PageAddListing1/PageAddListing8";
import PageAddListing9 from "containers/PageAddListing1/PageAddListing9";
import PageAddListing10 from "containers/PageAddListing1/PageAddListing10";
import ListingRealEstateMapPage from "containers/ListingRealEstatePage/ListingRealEstateMapPage";
import ListingRealEstatePage from "containers/ListingRealEstatePage/ListingRealEstatePage";
import SiteHeader from "containers/SiteHeader";
import FooterNav from "components/FooterNav";
import useWindowSize from "hooks/useWindowResize";
import PaySuccessPage from "containers/Paypal/PayPage";
import ListingStayProvincePage from "containers/ListingStayPage/ListingStayProvincePage";
import BookingListPage from "containers/BookingPage/BookingListPage";
import AdminDashboard from "containers/AdminPage/AdminDashBoard";
import Sidebar from "components/SideBar/AdminSideBar";
import UserPage from "containers/AdminPage/UserContainer/UserPage";
import AdminAmenitiesPage from "containers/AdminPage/AmenittiesContainer/AmenitiesPage";
import AdminProvincePage from "containers/AdminPage/ProvinceContainer/ProvincePage";
import AdminServicePage from "containers/AdminPage/ServiceContainer/ServicePage";
import AdminPlacePage from "containers/AdminPage/PlacesContainer/AdminPlacePage";
// import { checkTokenExp } from "utils/token";

export const pages: Page[] = [
  { path: "/", exact: true, component: PageHome },
  { path: "/#", exact: true, component: PageHome },
  { path: "/user", exact:true, component: UserPage},
  { path: "/province", exact:true, component: AdminProvincePage},
  { path: "/amenities", exact:true, component: AdminAmenitiesPage},
  { path: "/roomservice", component: AdminServicePage},
  { path: "/place", component:AdminPlacePage},
  { path: "/add-place", component:PageAddListing1},
  //
  { path: "/checkout/:id", component: CheckOutPage },
  { path: "/api/booking/pay/success/:id", component: PaySuccessPage },
  { path: "/booking", component: BookingListPage},
  //
  { path: "/author", component: AuthorPage },
  { path: "/account", component: AccountPage },
  { path: "/account-password", component: AccountPass },
  { path: "/account-savelists", component: AccountSavelists },
  { path: "/account-billing", component: AccountBilling },
  //
  { path: "/listing-stay", component: ListingStayPage },
  { path: "/listing-stay/:id", component: ListingStayProvincePage },
  { path: "/listing-stay-map", component: ListingStayMapPage },
  { path: "/listing-stay/stay/:id", component: ListingStayDetailPage },
  //
  {
    path: "/listing-experiences",
    component: ListingExperiencesPage,
  },
  {
    path: "/listing-experiences-map",
    component: ListingExperiencesMapPage,
  },
  {
    path: "/listing-experiences-detail",
    component: ListingExperiencesDetailPage,
  },

  //
  { path: "/listing-real-estate-map", component: ListingRealEstateMapPage },
  { path: "/listing-real-estate", component: ListingRealEstatePage },
  //
  { path: "/add-listing-1", component: PageAddListing1 },
  { path: "/add-listing-2", component: PageAddListing2 },
  { path: "/add-listing-3", component: PageAddListing3 },
  { path: "/add-listing-4", component: PageAddListing4 },
  { path: "/add-listing-5", component: PageAddListing5 },
  { path: "/add-listing-6", component: PageAddListing6 },
  { path: "/add-listing-7", component: PageAddListing7 },
  { path: "/add-listing-8", component: PageAddListing8 },
  { path: "/add-listing-9", component: PageAddListing9 },
  { path: "/add-listing-10", component: PageAddListing10 },
  //
  { path: "/contact", component: PageContact },
  { path: "/about", component: PageAbout },
  { path: "/signup", component: PageSignUp },
  { path: "/login", component: PageLogin },
  { path: "/api/authenticate/verify/:id", component: PayPage },
  { path: "/subscription", component: PageSubcription },
  { path: "/page-not-found", component: Page404 },
  //
  // {
  //   path: "/*",
  //   component: (props) => {
  //     return <Navigate to="/page-not-found" />;
  //   },
  // },
];
export const user: Page[] = [
  { path: "/checkout/:id", component: CheckOutPage },
  { path: "/pay-done", component: PayPage },
  //
  { path: "/author", component: AuthorPage },
  { path: "/account", component: AccountPage },
  { path: "/account-password", component: AccountPass },
  { path: "/account-savelists", component: AccountSavelists },
  { path: "/account-billing", component: AccountBilling },
  {
    path: "/*",
    component: (props) => {
      return <Navigate to="/page-not-found" />;
    },
  },
];
const MyRoutes = () => {
  const WIN_WIDTH = useWindowSize().width || window.innerWidth;
  // const accessToken = localStorage.getItem("token-UTEtravel") || "";
  {/* {user.map(({ component, path }) => {
          const Component = component;
          
          if (!checkTokenExp(accessToken)) {
            return <Navigate to="/login" />;
          }
          return <Route key={path} element={<Component />} path={path} />;
        })} */}
  return (
    <BrowserRouter>
      <div className="container">
        <SiteHeader />

        <div className="content">
          <Sidebar />

          <div className="main-content">
            <ScrollToTop />
            <Routes>
              {/* {user.map(({ component, path }) => {
          const Component = component;
          
          if (!checkTokenExp(accessToken)) {
            return <Navigate to="/login" />;
          }
          return <Route key={path} element={<Component />} path={path} />;
        })} */}
        {pages.map(({ component, path }) => {
          const Component = component;
          return <Route key={path} element={<Component />} path={path} />;
        })}
            </Routes>
          </div>
        </div>

        <Footer />
        {WIN_WIDTH < 768 && <FooterNav />}
      </div>
    </BrowserRouter>
  );
};

export default MyRoutes;
