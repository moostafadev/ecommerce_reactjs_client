import {
  Card,
  CardBody,
  Stack,
  Heading,
  Image,
  Text,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IProduct } from "../interfaces";

const MainCard = ({ id, attributes, category, typeData }: IProduct) => {
  return (
    <Card maxW={"100%"}>
      <CardBody display={"flex"} flexDirection={"column"}>
        <Image
          src={attributes?.thumbnail?.data?.attributes?.url}
          alt={attributes?.thumbnail?.data?.attributes?.alternativeText}
          rounded="lg"
          mx={"auto"}
          objectFit={"cover"}
          h={"200px"}
        />
        <Stack mt="4" flexGrow={1} justifyContent={"space-between"}>
          <Heading size="md" textAlign={"center"}>
            {attributes?.title}
          </Heading>
          <Text size="sm" textAlign={"center"}>
            {attributes?.description}
          </Text>
          {typeData === "product" && (
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              mt={4}
            >
              <Stack flexDirection={"row"} alignItems={"center"}>
                <Text>
                  $
                  {attributes?.price &&
                    attributes?.discountPercentage &&
                    Math.ceil(
                      attributes?.price - attributes?.discountPercentage
                    )}
                </Text>
                <Text as="del" color={"gray"}>
                  ${attributes?.price && Math.ceil(attributes?.price)}
                </Text>
              </Stack>
              <Stack flexDirection={"row"} alignItems={"center"}>
                <Text>{category?.attributes?.title}</Text>
                <Image
                  src={category?.attributes?.thumbnail?.data?.attributes?.url}
                  alt={
                    category?.attributes?.thumbnail?.data?.attributes
                      ?.alternativeText
                  }
                  rounded="100%"
                  objectFit={"cover"}
                  h={"40px"}
                  w={"40px"}
                />
              </Stack>
            </Stack>
          )}

          <Button
            as={Link}
            to={`/${typeData === "product" ? "products" : "categories"}/` + id}
            colorScheme="teal"
            variant="solid"
            fontWeight={"semibold"}
            mt={"10px"}
          >
            View Details
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default MainCard;
