import { Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/Products";
import HomePage from "./pages";
import AboutPage from "./pages/About";
import ProductPage from "./pages/Product";
import AppLayout from "./layout/AppLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
