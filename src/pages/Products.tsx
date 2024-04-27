import { Container, Grid } from "@chakra-ui/react";
import { IProduct } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { MAX_WIDTH_CONTAINER } from "../common/varables";
import MainCard from "../components/MainCard";
import MainCardSkeleton from "../components/MainCardSkeleton";
import { axiosInstance } from "../api/axios.config";
import { selectTmpValue } from "../app/features/tmpSlice";
import { useSelector } from "react-redux";

const ProductsPage = () => {
  const tmpValue = useSelector(selectTmpValue);

  const getProducts = async () => {
    const res = await axiosInstance.get(`/products?populate=*`);
    return res;
  };
  const { isLoading, data, error } = useQuery({
    queryKey: ["products", tmpValue],
    queryFn: getProducts,
  });

  const getCategories = async () => {
    const res = await axiosInstance.get(`/categories?populate=*`);
    return res;
  };
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading)
    return (
      <Container maxW={MAX_WIDTH_CONTAINER}>
        <Grid
          marginY={30}
          templateColumns={"repeat(auto-fill, minmax(250px, 1fr))"}
          gap={"3"}
        >
          {Array.from({ length: 10 }, (_, index) => (
            <MainCardSkeleton key={index} />
          ))}
        </Grid>
      </Container>
    );
  if (error) return <h3>{error.message}</h3>;

  return (
    <Container maxW={MAX_WIDTH_CONTAINER} minH="calc(100vh - 128px)" py="16px">
      <Grid templateColumns={"repeat(auto-fill, minmax(250px, 1fr))"} gap={"3"}>
        {Array.isArray(data?.data?.data) &&
          data.data.data.map((product: IProduct) => (
            <MainCard
              key={product.id}
              id={product.id}
              attributes={product.attributes}
              category={
                categoriesData?.data?.data.filter(
                  (category: { id: number }) =>
                    category.id === product.attributes.categories.data[0].id
                )[0]
              }
              typeData="product"
            />
          ))}
      </Grid>
    </Container>
  );
};

export default ProductsPage;
