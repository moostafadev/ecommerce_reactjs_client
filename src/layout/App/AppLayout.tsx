import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import BtnTop from "../../components/BtnTop";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <BtnTop />
      <Footer />
    </>
  );
}

export default AppLayout;
