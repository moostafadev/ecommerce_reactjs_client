import { Container } from "@chakra-ui/react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Container as="main" maxW={"4xl"}>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

export default AppLayout;
