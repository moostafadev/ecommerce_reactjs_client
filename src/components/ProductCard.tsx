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

const ProductCard = ({ id, attributes }: IProduct) => {
  return (
    <Card>
      <CardBody>
        <Image
          src={attributes.thumbnail.data.attributes.url}
          alt={attributes.thumbnail.data.attributes.alternativeText}
          borderRadius="md"
        />
        <Stack mt="4" spacing="3">
          <Heading size="md" textAlign={"center"}>
            {attributes.title}
          </Heading>
          <Text size="sm" textAlign={"center"}>
            {attributes.description}
          </Text>
          <Button
            as={Link}
            to={"/products/" + id}
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

export default ProductCard;
