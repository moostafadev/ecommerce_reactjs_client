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
import { ICategory } from "../interfaces";

const CategoryCard = ({ id, attributes }: ICategory) => {
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
          <Button
            as={Link}
            to={"/categories/" + id}
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

export default CategoryCard;
