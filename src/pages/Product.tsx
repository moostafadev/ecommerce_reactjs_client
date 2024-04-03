import { Link, useParams } from "react-router-dom";
import { MAX_WIDTH_CONTAINER } from "../common/varables";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  List,
  ListItem,
  useColorMode,
  Grid,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import Slider from "react-slick";
import { MdLocalShipping } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { ICategory, IProduct } from "../interfaces";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import React from "react";
import ProductPageSkeleton from "../components/ProductPageSkeleton";
import MainCard from "../components/MainCard";
import { axiosInstance } from "../api/axios.config";

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const ProductPage = () => {
  const { id } = useParams();
  const { colorMode } = useColorMode();
  const [slider, setSlider] = React.useState<Slider | null>(null);

  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  const getProduct = async () => {
    const res = await axiosInstance.get(`/products/${id}?populate=*`);
    return res;
  };
  const { data, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: getProduct,
  });

  const product: IProduct = data?.data?.data;

  const getSimilarProduct = async () => {
    const res = await axiosInstance.get(
      `/products?populate=*&filters[categories][title][$eq]=${product?.attributes?.categories?.data[0]?.attributes?.title}`
    );
    return res;
  };
  const { data: dataSimilarProduct, isLoading: isLoadingSimilarProduct } =
    useQuery({
      queryKey: ["productsSimilar", product],
      queryFn: getSimilarProduct,
    });

  const productsSimilar: IProduct[] = dataSimilarProduct?.data?.data;
  const productsSimilarFiltered: IProduct[] = productsSimilar?.filter(
    (productS) => productS?.attributes?.title !== product?.attributes?.title
  );

  const getCategory = async () => {
    if (product && product.attributes.categories.data[0]?.id) {
      const res = await axiosInstance.get(
        `/categories/${product.attributes.categories.data[0]?.id}?populate=*`
      );
      return res;
    } else {
      return Promise.resolve({ data: { data: {} } });
    }
  };

  const { data: dataCategory, isLoading: isLoadingCategory } = useQuery({
    queryKey: [`category`, product],
    queryFn: getCategory,
  });

  const category: ICategory = dataCategory?.data?.data;

  if (isLoading || isLoadingSimilarProduct || isLoadingCategory)
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
    <Box>
      <Container maxW={MAX_WIDTH_CONTAINER}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: "30px" }}
        >
          <Flex flexDir={"column"}>
            <Box position={"relative"} width={"full"} overflow={"hidden"}>
              <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
              />
              <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
              />
              <IconButton
                aria-label="left-arrow"
                variant="ghost"
                position="absolute"
                left={side}
                top={top}
                transform={"translate(0%, -50%)"}
                zIndex={2}
                onClick={() => slider?.slickPrev()}
                bg={colorMode === "dark" ? "gray.800" : "white"}
              >
                <BiLeftArrowAlt size="40px" />
              </IconButton>
              <IconButton
                aria-label="right-arrow"
                variant="ghost"
                position="absolute"
                right={side}
                top={top}
                transform={"translate(0%, -50%)"}
                zIndex={2}
                onClick={() => slider?.slickNext()}
                bg={colorMode === "dark" ? "gray.800" : "white"}
              >
                <BiRightArrowAlt size="40px" />
              </IconButton>
              <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {product?.attributes?.images?.data ? (
                  product?.attributes?.images?.data?.map((image, idx) => (
                    <Stack
                      h={"500px"}
                      key={idx}
                      position={"relative"}
                      mb={"20px"}
                    >
                      <Image
                        alt={image.attributes.alternativeText}
                        src={image.attributes.url}
                        height={"100%"}
                        rounded={"lg"}
                        mx={"auto"}
                        position={"absolute"}
                        inset={0}
                        h={"100%"}
                        w={"100%"}
                      />
                    </Stack>
                  ))
                ) : (
                  <Stack h={"500px"} position={"relative"} mb={"20px"}>
                    <Image
                      alt={"NoProduct"}
                      src={
                        "https://res.cloudinary.com/dvtmqtcyl/image/upload/v1712000980/No_Products_55d29f8b32.jpg"
                      }
                      height={"100%"}
                      rounded={"lg"}
                      mx={"auto"}
                      position={"absolute"}
                      inset={0}
                      h={"100%"}
                      w={"100%"}
                    />
                  </Stack>
                )}
              </Slider>
            </Box>
            <Grid
              gridTemplateColumns={`repeat(auto-fill, minmax(120px, 1fr))`}
              gap={"10px"}
              h={"fit-content"}
            >
              {product?.attributes?.images?.data?.map((image, idx) => (
                <Image
                  key={idx}
                  rounded={"md"}
                  alt={image?.attributes?.alternativeText}
                  src={image?.attributes?.url}
                  fit={"cover"}
                  align={"center"}
                  height={"100%"}
                  cursor={"pointer"}
                  onClick={() => {
                    if (slider) {
                      slider.slickGoTo(idx);
                    }
                  }}
                />
              ))}
            </Grid>
          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={"header"}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {product?.attributes?.title}
              </Heading>
              <Stack flexDirection={"row"} gap={"16px"}>
                <Text fontWeight={300} fontSize={"2xl"}>
                  $
                  {product?.attributes?.price &&
                  product?.attributes?.discountPercentage
                    ? Math.ceil(
                        product?.attributes?.price -
                          product?.attributes?.discountPercentage
                      )
                    : product?.attributes?.price &&
                      Math.ceil(product?.attributes?.price)}{" "}
                  USD
                </Text>
                {product?.attributes?.discountPercentage && (
                  <Text
                    as={"del"}
                    color={colorMode === "light" ? "gray.900" : "gray.400"}
                    fontWeight={300}
                    fontSize={"2xl"}
                  >
                    $
                    {product?.attributes?.price &&
                      Math.ceil(product?.attributes?.price)}{" "}
                    USD
                  </Text>
                )}
              </Stack>
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
                <Text fontSize={"lg"}>{product?.attributes?.description}</Text>
              </VStack>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color={colorMode === "light" ? "yellow.500" : "yellow.300"}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  Category
                </Text>
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={10}
                  fontWeight={"bold"}
                  as={Link}
                  to={`/categories/${product?.attributes?.categories?.data[0]?.id}`}
                >
                  {product?.attributes?.categories?.data[0]?.attributes?.title}
                </SimpleGrid>
              </Box>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color={colorMode === "light" ? "yellow.500" : "yellow.300"}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  Product Details
                </Text>

                <List spacing={2}>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Stock:
                    </Text>{" "}
                    {product.attributes.stock}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Rating:
                    </Text>{" "}
                    {product.attributes.rating}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Brand:
                    </Text>{" "}
                    {product.attributes.brand}
                  </ListItem>
                </List>
              </Box>
            </Stack>

            <Button
              rounded={"lg"}
              w={"full"}
              mt={8}
              size={"lg"}
              py={"7"}
              bg={colorMode === "light" ? "gray.900" : "gray.50"}
              color={colorMode === "light" ? "white" : "gray.900"}
              textTransform={"uppercase"}
              _hover={{
                transform: "translateY(2px)",
                boxShadow: "lg",
              }}
            >
              Add to cart
            </Button>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"center"}
            >
              <MdLocalShipping />
              <Text>2-3 business days delivery</Text>
            </Stack>
          </Stack>
        </SimpleGrid>
        {productsSimilarFiltered.length ? (
          <>
            <Heading
              mb={"10px"}
              borderTop={
                colorMode === "dark" ? "1px solid white" : "1px solid black"
              }
              pt={"16px"}
            >
              Similar Products
            </Heading>
            <Grid
              templateColumns={"repeat(auto-fill, minmax(250px, 1fr))"}
              gap={"3"}
              py={"16px"}
            >
              {productsSimilarFiltered?.map((product: IProduct, idx) => (
                <MainCard
                  key={idx}
                  id={product.id}
                  attributes={product.attributes}
                  category={category}
                  typeData="product"
                />
              ))}
            </Grid>
          </>
        ) : null}
      </Container>
    </Box>
  );
};

export default ProductPage;
