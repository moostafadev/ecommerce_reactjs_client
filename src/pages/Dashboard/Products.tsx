import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/axios.config";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../../interfaces";
import DashboardTable from "../../components/DashboardTable";
import ModalCustom from "../../components/ModalCustom";
import { useState } from "react";

const ProductsDashboardPage = () => {
  const headTable = [
    "id",
    "Title",
    "Category",
    "Price discount",
    "Discount",
    "Brand",
    "Stock",
    "Rating",
    "Thumbnail",
    "Actions",
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataProduct, setDataProduct] = useState<IProduct>({
    id: 0,
    attributes: {
      title: "",
      description: "",
      brand: "",
      discountPercentage: 0,
      price: 0,
      rating: 0,
      stock: 0,
      categories: {
        data: [
          {
            id: 0,
            attributes: {
              title: "",
              description: "",
            },
          },
        ],
      },
      images: {
        data: [
          {
            id: 0,
            attributes: {
              alternativeText: "",
              url: "",
            },
          },
        ],
      },
      thumbnail: {
        data: { id: 0, attributes: { alternativeText: "", url: "" } },
      },
    },
  });
  const [hasDiscount, setHasDiscount] = useState("no");

  const onChangeNumberHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataProduct((prevProduct) => ({
      ...prevProduct,
      attributes: {
        ...prevProduct?.attributes,
        [name]: +value,
      },
    }));
  };

  const onChangeTextHandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDataProduct((prevProduct) => ({
      ...prevProduct,
      attributes: {
        ...prevProduct?.attributes,
        [name]: value,
      },
    }));
  };

  const getProducts = async () => {
    const res = await axiosInstance.get(`/products?populate=*`);
    return res;
  };
  const { isLoading, data } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products: IProduct[] = data?.data?.data;
  if (isLoading) return <Text>Loading ...</Text>;
  return (
    <Flex flexDir={"column"} gap={"30px"}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Heading>Manage products</Heading>
        <Button colorScheme="green" onClick={onOpen}>
          Add a new product
        </Button>
      </Flex>
      <DashboardTable data={products} tHeadData={headTable} isProduct={true} />
      <ModalCustom
        isOpen={isOpen}
        onClose={onClose}
        title={"Add a new product"}
        clickHandler={() => {}}
      >
        <Box>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Title"
              type="text"
              name="title"
              value={dataProduct.attributes?.title}
              onChange={onChangeTextHandler}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Description"
              name="description"
              value={dataProduct.attributes?.description}
              onChange={onChangeTextHandler}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Brand</FormLabel>
            <Input
              placeholder="Brand"
              type="text"
              name="brand"
              value={dataProduct.attributes?.brand}
              onChange={onChangeTextHandler}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Stock</FormLabel>
            <NumberInput name="stock" value={dataProduct.attributes?.stock}>
              <NumberInputField
                onChange={onChangeNumberHandler}
                placeholder="Stock"
              />
            </NumberInput>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Price</FormLabel>
            <NumberInput
              name="price"
              defaultValue={dataProduct.attributes?.price}
              precision={2}
            >
              <InputGroup>
                <NumberInputField
                  onChange={onChangeNumberHandler}
                  placeholder="Price"
                  rounded={"0.375rem 0 0 0.375rem"}
                />
                <InputRightAddon>USD</InputRightAddon>
              </InputGroup>
            </NumberInput>
          </FormControl>
          <RadioGroup
            defaultValue={
              dataProduct.attributes?.discountPercentage &&
              dataProduct.attributes?.discountPercentage > 0
                ? "yes"
                : "no"
            }
            mt={4}
            onChange={(e) => {
              setHasDiscount(e);
              if (dataProduct) {
                setDataProduct({
                  ...dataProduct,
                  attributes: {
                    ...dataProduct.attributes,
                    discountPercentage: e === "yes" ? 0 : undefined,
                  },
                });
              }
            }}
          >
            <FormLabel>Has discount</FormLabel>
            <Stack spacing={5} direction="row">
              <Radio colorScheme="blue" value="yes">
                Yes
              </Radio>
              <Radio colorScheme="red" value="no">
                No
              </Radio>
            </Stack>
          </RadioGroup>
          {hasDiscount === "yes" ? (
            <FormControl mt={4}>
              <FormLabel>Discount price</FormLabel>
              <NumberInput
                name="discountPercentage"
                defaultValue={dataProduct.attributes?.discountPercentage}
                precision={2}
                max={100}
              >
                <InputGroup>
                  <NumberInputField
                    onChange={onChangeNumberHandler}
                    placeholder="Discount price %"
                    rounded={"0.375rem 0 0 0.375rem"}
                  />
                  <InputRightAddon>%</InputRightAddon>
                </InputGroup>
                <FormControl mt={4}>
                  <FormLabel>Final price</FormLabel>
                  <InputGroup>
                    <Input
                      disabled
                      htmlSize={4}
                      width="auto"
                      _disabled={{
                        opacity: 1,
                      }}
                      value={
                        dataProduct.attributes?.price &&
                        dataProduct.attributes?.discountPercentage &&
                        Math.ceil(
                          dataProduct.attributes?.price -
                            (dataProduct.attributes?.price *
                              dataProduct.attributes?.discountPercentage) /
                              100
                        )
                      }
                    />
                    <InputRightAddon>USD</InputRightAddon>
                  </InputGroup>
                </FormControl>
              </NumberInput>
            </FormControl>
          ) : null}
        </Box>
      </ModalCustom>
    </Flex>
  );
};

export default ProductsDashboardPage;
