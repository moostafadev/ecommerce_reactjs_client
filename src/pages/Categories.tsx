import { Container, Grid } from "@chakra-ui/react";
import { ICategory } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { MAX_WIDTH_CONTAINER } from "../common/varables";
import MainCard from "../components/MainCard";
import MainCardSkeleton from "../components/MainCardSkeleton";
import { axiosInstance } from "../api/axios.config";
import { useSelector } from "react-redux";
import { selectTmpValue } from "../app/features/tmpSlice";

const CategoriesPage = () => {
  const tmpValue = useSelector(selectTmpValue);

  const getCategories = async () => {
    const res = await axiosInstance.get(`/categories?populate=*`);
    return res;
  };
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", tmpValue],
    queryFn: getCategories,
  });

  if (isLoading)
    return (
      <Container maxW={MAX_WIDTH_CONTAINER}>
        <Grid
          marginY={30}
          templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
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
        {categoriesData?.data?.data.map((category: ICategory) => (
          <MainCard
            key={category.id}
            id={category.id}
            attributes={category?.attributes}
            typeData="category"
          />
        ))}
      </Grid>
    </Container>
  );
};

export default CategoriesPage;
