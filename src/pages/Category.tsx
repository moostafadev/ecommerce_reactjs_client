import { useParams } from "react-router-dom";
import { MAX_WIDTH_CONTAINER } from "../common/varables";
import {
  Box,
  Container,
  Stack,
  Text,
  VStack,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorMode,
  Image,
  Grid,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ICategory, IProduct } from "../interfaces";
import ProductPageSkeleton from "../components/ProductPageSkeleton";
import MainCard from "../components/MainCard";

const CategoryPage = () => {
  const { id } = useParams();
  const { colorMode } = useColorMode();

  const getCategory = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/categories/${id}?populate=*`
    );
    return res;
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [`category-${id}`],
    queryFn: getCategory,
  });

  const category: ICategory = data?.data?.data;

  const getProduct = async () => {
    const res = await axios.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/products?populate=*&filters[categories][title][$eq]=${
        category.attributes.title
      }`
    );
    return res;
  };

  const {
    data: productData,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useQuery({
    queryKey: [`product-${category}`],
    queryFn: getProduct,
  });

  const products: IProduct[] = productData?.data?.data;

  if (isLoading || isLoadingProduct || isFetching || isFetchingProduct)
    return (
      <Container
        maxW={MAX_WIDTH_CONTAINER}
        py={"30px"}
        minH={"calc(100vh - 64px)"}
      >
        <ProductPageSkeleton />
      </Container>
    );
  return (
    <Box minH={"calc(100vh - 64px)"}>
      <Container maxW={MAX_WIDTH_CONTAINER}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: "30px" }}
        >
          <Image
            src={category?.attributes?.thumbnail?.data?.attributes?.url}
            alt={
              category?.attributes?.thumbnail?.data?.attributes?.alternativeText
            }
            rounded={"lg"}
          />
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={"header"}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {category?.attributes?.title}
              </Heading>
            </Box>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              divider={
                <StackDivider
                  borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                />
              }
            >
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text fontSize={"lg"}>{category?.attributes?.description}</Text>
              </VStack>
            </Stack>
          </Stack>
        </SimpleGrid>
        <Heading
          mb={"10px"}
          borderTop={
            colorMode === "dark" ? "1px solid white" : "1px solid black"
          }
          pt={"16px"}
        >
          Products
        </Heading>
        <Grid
          templateColumns={"repeat(auto-fill, minmax(250px, 1fr))"}
          gap={"3"}
          py={"16px"}
        >
          {products.length ? (
            products?.map((product: IProduct, idx) => (
              <MainCard
                key={idx}
                id={product.id}
                attributes={product.attributes}
                category={category}
                typeData="product"
              />
            ))
          ) : (
            <Text>No products yet !</Text>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoryPage;
