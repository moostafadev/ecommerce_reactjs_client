import React from "react";
import {
  Box,
  Container,
  Heading,
  IconButton,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Slider from "react-slick";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ICategory, IProduct } from "../../interfaces";
import CardSection from "../../components/CardSection";
import CardSectionSkeleton from "../../components/CardSectionSkeleton";

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

const CarouselSection = ({
  typeData,
}: {
  typeData: "product" | "category";
}) => {
  const { colorMode } = useColorMode();
  const [slider, setSlider] = React.useState<Slider | null>(null);

  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  const getData = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/${
        typeData === "product" ? "products" : "categories"
      }?populate=*`
    );
    return res;
  };
  const { data, isLoading, isFetching } = useQuery({
    queryKey: typeData === "product" ? ["products"] : ["categories"],
    queryFn: getData,
  });

  const cardData = Array.isArray(data?.data?.data)
    ? data?.data?.data?.map((item: ICategory | IProduct) => ({
        id: item.id,
        title: item.attributes?.title,
        description: item.attributes?.description,
        image: item.attributes?.thumbnail?.data?.attributes?.url,
      }))
    : null;

  if (isLoading || isFetching)
    return (
      <Container
        maxW={"100%"}
        height={"100%"}
        mx={"auto"}
        display={"flax"}
        alignItems={"center"}
        mb={{ base: "60px", md: "20px" }}
        py={"60px"}
      >
        <CardSectionSkeleton />
      </Container>
    );
  return (
    <Box
      position={"relative"}
      width={"full"}
      overflow={"hidden"}
      py={"60px"}
      bg={
        typeData === "category"
          ? colorMode === "light"
            ? "green.300"
            : "green.500"
          : undefined
      }
    >
      <Stack spacing={"5px"} align={"center"} mb={"30px"}>
        <Heading>
          Our {typeData === "product" ? "Products" : "Categories"}
        </Heading>
        <Text textAlign={"center"}>
          {typeData === "product"
            ? "Explore our wide selection of products and services"
            : "We offer a diverse range of products and services"}
        </Text>
      </Stack>
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
        {cardData?.map(
          (
            data: {
              id: number;
              title: string;
              description: string;
              image: string;
            },
            index: number
          ) => (
            <Container
              maxW={"100%"}
              height={"100%"}
              mx={"auto"}
              display={"flax"}
              alignItems={"center"}
              mb={{ base: "60px", md: "20px" }}
              key={index}
            >
              <CardSection
                id={data.id}
                description={data.description}
                image={data.image}
                title={data.title}
                type={typeData === "product" ? "product" : "category"}
              />
            </Container>
          )
        )}
      </Slider>
    </Box>
  );
};

export default CarouselSection;
