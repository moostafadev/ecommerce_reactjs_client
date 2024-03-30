import { Grid } from "@chakra-ui/react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { IProduct } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import ProductSkeleton from "../components/ProductCardSkeleton";

function ProductsPage() {
  const getProducts = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/products?populate=*`
    );
    return res;
  };
  const { isLoading, data, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const getCategories = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/categories?populate=*`
    );
    return res;
  };
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading)
    return (
      <Grid
        marginY={30}
        templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
        gap={"3"}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </Grid>
    );
  if (error) return <h3>{error.message}</h3>;

  return (
    <Grid
      marginY={30}
      templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
      gap={"3"}
    >
      {data?.data?.data.map((product: IProduct) => (
        <ProductCard
          key={product.id}
          id={product.id}
          attributes={product.attributes}
          category={
            categoriesData?.data?.data.filter(
              (category: { id: number }) =>
                category.id === product.attributes.categories.data[0].id
            )[0]
          }
        />
      ))}
    </Grid>
  );
}

export default ProductsPage;
