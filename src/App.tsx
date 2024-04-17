import { Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/Products";
import HomePage from "./pages";
import ProductPage from "./pages/Product";
import AppLayout from "./layout/App";
import CategoryPage from "./pages/Category";
import CategoriesPage from "./pages/Categories";
import cookieServices from "./services/cookieServices";
import LoginPage from "./pages/Login";
import DashboardLayout from "./layout/Dashboard/DashboardLayout";
import DashboardHomePage from "./pages/Dashboard";
import ProductsDashboardPage from "./pages/Dashboard/Products";
import CategoriesDashboardPage from "./pages/Dashboard/Categories";
import UsersDashboardPage from "./pages/Dashboard/Users";
import ProfilePage from "./pages/Profile";

function App() {
  const token: string = cookieServices.get("jwt");
  const admin: string = cookieServices.get("user")?.role?.name;

  const auth = () => {
    if (admin === "admin") {
      return true;
    }
    return false;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:id" element={<CategoryPage />} />
          <Route
            path="profiles/:id"
            element={<ProfilePage isAuthantecated={token} />}
          />
          <Route path="login" element={<LoginPage isAuthantecated={token} />} />
        </Route>
        <Route
          path="/dashboard/"
          element={<DashboardLayout isAuthantecated={auth()} />}
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="products" element={<ProductsDashboardPage />} />
          <Route path="categories" element={<CategoriesDashboardPage />} />
          <Route path="users" element={<UsersDashboardPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
