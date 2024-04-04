import {
  Button,
  Divider,
  Flex,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IProduct } from "../interfaces";
import { Link as LinkRouter } from "react-router-dom";

const CartDrawerItems = ({ id, quantity, attributes }: IProduct) => {
  return (
    <>
      <Flex py={"16px"} gap={"12px"}>
        <Stack>
          <Image
            boxSize={"80px"}
            rounded={"full"}
            objectFit={"cover"}
            src={attributes.thumbnail.data.attributes.url}
            alt={attributes.thumbnail.data.attributes.alternativeText}
          />
        </Stack>
        <Flex flexDir={"column"} gap={"8px"} flexGrow={1}>
          <Stack>
            <Link
              as={LinkRouter}
              to={`/products/${id}`}
              fontSize={"18px"}
              fontWeight={"semibold"}
              width={"fit-content"}
            >
              {attributes.title}
            </Link>
          </Stack>
          <Flex gap={"16px"} alignItems={"center"}>
            <Text>Quantity: {quantity}</Text>
            <Text>Price: ${attributes.price} USD</Text>
          </Flex>
          <Flex
            gap={"8px"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text>
              Category:{" "}
              <Link
                as={LinkRouter}
                fontWeight={"semibold"}
                to={`/categories/${attributes.categories.data[0].id}`}
              >
                {attributes.categories.data[0].attributes.title}
              </Link>
            </Text>
            <Button colorScheme="red" variant={"outline"} size="sm">
              Remove
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default CartDrawerItems;
