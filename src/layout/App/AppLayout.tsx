import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import BtnTop from "../../components/BtnTop";
import CartDrawer from "../../components/CartDrawer";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <CartDrawer />
      <BtnTop />
      <Footer />
    </>
  );
}

export default AppLayout;
