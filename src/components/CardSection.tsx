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

const CardSection = ({
  id,
  title,
  description,
  image,
  type,
}: {
  id: number;
  title: string;
  description: string;
  image: string;
  type: "category" | "product";
}) => {
  return (
    <Card
      maxW={{ sm: "500px", md: "600px", lg: "850px" }}
      display={"flex"}
      flexDirection={{ base: "column", lg: "row" }}
      rounded="lg"
      mx={"auto"}
      alignItems={"center"}
      height={{ lg: "300px" }}
    >
      <Image
        src={image}
        alt={image}
        rounded="lg"
        mx={"auto"}
        objectFit={"cover"}
        h={"100%"}
      />
      <CardBody display={"flex"} flexDirection={"column"}>
        <Stack flexGrow={1} justifyContent={"space-between"}>
          <Heading size="md" textAlign={"center"}>
            {title}
          </Heading>
          <Text size="sm" textAlign={"center"}>
            {description}
          </Text>
          <Button
            as={Link}
            to={`/${type === "category" ? "categories" : "products"}/` + id}
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

export default CardSection;
