import { Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/Products";
import HomePage from "./pages";
import ProductPage from "./pages/Product";
import AppLayout from "./layout/App/AppLayout";
import CategoryPage from "./pages/Category";
import CategoriesPage from "./pages/Categories";
import cookieServices from "./services/cookieServices";
import LoginPage from "./pages/Login";

function App() {
  const token: string = cookieServices.get("jwt");

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:id" element={<CategoryPage />} />
          <Route path="login" element={<LoginPage isAuthantecated={token} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
