import { Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/Products";
import HomePage from "./pages";
import ProductPage from "./pages/Product";
import AppLayout from "./layout/App/AppLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
