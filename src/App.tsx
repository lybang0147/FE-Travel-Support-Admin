import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "redux/store";
import MyRouter from "routers/index";
import Sidebar from "components/SideBar/AdminSideBar"; 
import { LoadScript } from "@react-google-maps/api";


function App() {
  const checkNetwork = () => {
    window.addEventListener("offline", (e) => {
      toast.error(
        "Không có kết nối mạng .Vui lòng kiểm tra lại kết nối mạng của bạn"
      );
    });

    window.addEventListener("online", (e) => {
      toast.success("Đã có kết nối mạng!");
    });
  };

  return (
    <>
      {" "}
      {checkNetwork()}
        <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
          <Toaster
            reverseOrder={false}
            position="bottom-right"
            containerStyle={{ zIndex: 999999 }}
          />
          <LoadScript googleMapsApiKey="AIzaSyBsPneABX0AikJU3g21R8wP-SKD4KC5uVQ" libraries={['places']}>
          <MyRouter />
        </LoadScript>
      </div>
    </>
  );
}

export default App;
