import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/axios.config";
import { useQuery } from "@tanstack/react-query";
import { ICategory, IProduct } from "../../interfaces";
import DashboardTable from "../../components/DashboardTable";
import ModalCustom from "../../components/ModalCustom";
import { useState } from "react";
import cookieServices from "../../services/cookieServices";

const ProductsDashboardPage = () => {
  const defaultProduct = {
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
  };
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

  const getProducts = async () => {
    const res = await axiosInstance.get(`/products?populate=*`);
    return res;
  };
  const { isLoading, data } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  const products: IProduct[] = data?.data?.data;

  const getCategories = async () => {
    const res = await axiosInstance.get(`/categories?populate=*`);
    return res;
  };
  const { data: dataCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categoriesData: ICategory[] = dataCategories?.data?.data;

  const toast = useToast();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataProduct, setDataProduct] = useState<IProduct>(defaultProduct);
  const [thumbnail, setThumbnail] = useState<FileList | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[] | null>(null);
  const [hasDiscount, setHasDiscount] = useState("no");
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  // Validation
  const [isTitle, setIsTitle] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [isBrand, setIsBrand] = useState(false);
  const [isStock, setIsStock] = useState(false);
  const [isPrice, setIsPrice] = useState(false);

  // Handlers
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

  const onChangeCategoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (dataProduct) {
      setDataProduct({
        ...dataProduct,
        attributes: {
          ...dataProduct?.attributes,
          categories: {
            ...dataProduct?.attributes.categories,
            data: [
              {
                ...categoriesData.filter(
                  (category: ICategory) => category.attributes.title === value
                )[0],
              },
            ],
          },
        },
      });
    }
  };

  const onSubmitHandler = async () => {
    // Valication
    const { title, description, categories, brand, stock, price } =
      dataProduct.attributes;
    if (
      !title &&
      !description &&
      !categories.data[0].attributes?.title &&
      !brand &&
      !stock &&
      !price
    ) {
      setIsTitle(true);
      setIsDescription(true);
      setIsBrand(true);
      setIsStock(true);
      setIsPrice(true);
      return;
    }
    if (!title) {
      setIsTitle(true);
      return;
    }
    if (!description) {
      setIsDescription(true);
      return;
    }
    if (!categories.data[0].attributes?.title) {
      setIsCategory(true);
      return;
    }
    if (!brand) {
      setIsBrand(true);
      return;
    }
    if (!stock) {
      setIsStock(true);
      return;
    }
    if (!price) {
      setIsPrice(true);
      return;
    }
    const formData = new FormData();
    if (dataProduct) {
      setIsLoadingBtn(true);
      formData.append(
        "data",
        JSON.stringify({
          title: dataProduct.attributes.title,
          description: dataProduct.attributes.description,
          categories: dataProduct.attributes.categories.data[0].id,
          brand: dataProduct.attributes.brand,
          stock: dataProduct.attributes.stock,
          price: dataProduct.attributes.price,
          discountPercentage: dataProduct.attributes.discountPercentage,
        })
      );
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("files.images", images[i]);
        }
      }
      if (thumbnail) {
        formData.append("files.thumbnail", thumbnail[0]);
      }
    }
    try {
      await axiosInstance.post(`/products?populate=*`, formData, {
        headers: {
          Authorization: `Bearer ${cookieServices.get("jwt")}`,
        },
      });
      setDataProduct(defaultProduct);
      onClose();
      toast({
        title: "Added Successful",
        status: "success",
        duration: 500,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingBtn(false);
    }
  };

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
        clickHandler={onSubmitHandler}
        isLoading={isLoadingBtn}
      >
        <Box>
          <FormControl>
            <FormLabel>
              Title
              <Text display={"inline-block"} color={"red.500"}>
                *
              </Text>
            </FormLabel>
            <Input
              placeholder="Title"
              type="text"
              name="title"
              value={dataProduct.attributes?.title}
              onChange={onChangeTextHandler}
            />
            {isTitle && (
              <FormHelperText color={"red.400"}>
                Title is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>
              Description
              <Text display={"inline-block"} color={"red.500"}>
                *
              </Text>
            </FormLabel>
            <Textarea
              placeholder="Description"
              name="description"
              value={dataProduct.attributes?.description}
              onChange={onChangeTextHandler}
            />
            {isDescription && (
              <FormHelperText color={"red.400"}>
                Description is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Choose category"
              onChange={onChangeCategoryHandler}
              value={
                dataProduct?.attributes.categories.data[0]?.attributes?.title
              }
            >
              {dataProduct &&
                categoriesData?.map((item: ICategory, idx: number) => (
                  <option key={idx} value={item.attributes.title}>
                    {item.attributes.title}
                  </option>
                ))}
            </Select>
            {isCategory && (
              <FormHelperText color={"red.400"}>
                Choose a category!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>
              Brand
              <Text display={"inline-block"} color={"red.500"}>
                *
              </Text>
            </FormLabel>
            <Input
              placeholder="Brand"
              type="text"
              name="brand"
              value={dataProduct.attributes?.brand}
              onChange={onChangeTextHandler}
            />
            {isBrand && (
              <FormHelperText color={"red.400"}>
                Brand is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>
              Stock
              <Text display={"inline-block"} color={"red.500"}>
                *
              </Text>
            </FormLabel>
            <NumberInput name="stock" value={dataProduct.attributes?.stock}>
              <NumberInputField
                onChange={onChangeNumberHandler}
                placeholder="Stock"
              />
            </NumberInput>
            {isStock && (
              <FormHelperText color={"red.400"}>
                Stock is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>
              Price
              <Text display={"inline-block"} color={"red.500"}>
                *
              </Text>
            </FormLabel>
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
            {isPrice && (
              <FormHelperText color={"red.400"}>
                Price is required!
              </FormHelperText>
            )}
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
          <FormControl mt={4}>
            <FormLabel>Images</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              padding={"5px"}
              onChange={(e) => {
                const files = e.target.files;
                setImages(files);
                if (files) {
                  setImages(files);
                  const selectedFilesArray: string[] = [];
                  for (let i = 0; i < files.length; i++) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result;
                      if (result && typeof result === "string") {
                        selectedFilesArray.push(result);
                        if (selectedFilesArray.length === files.length) {
                          setSelectedFiles(selectedFilesArray);
                        }
                      }
                    };
                    reader.readAsDataURL(files[i]);
                  }
                } else {
                  setImages(null);
                  setSelectedFiles(null);
                }
              }}
            />
            {selectedFiles?.length && (
              <Grid
                mt={2}
                gap={2}
                gridTemplateColumns={`repeat(auto-fill, minmax(130px, 1fr))`}
              >
                {selectedFiles?.map((img, idx) => (
                  <Box
                    key={idx}
                    p={"4px"}
                    rounded={"md"}
                    bg={colorMode === "dark" ? "gray.800" : "gray.200"}
                  >
                    <Image
                      rounded={"md"}
                      alt={"image"}
                      src={img}
                      objectFit={"cover"}
                      w={"100%"}
                      h={"100%"}
                    />
                  </Box>
                ))}
              </Grid>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Thumbnail</FormLabel>
            <Input
              type="file"
              accept="image/*"
              padding={"5px"}
              onChange={(e) => {
                setThumbnail(e.target.files);
                const file = e.target.files && e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result;
                    if (result && typeof result === "string") {
                      setSelectedFile(result);
                    }
                  };
                  reader.readAsDataURL(file);
                } else {
                  setSelectedFile(null);
                }
              }}
            />
            {thumbnail && (
              <Grid
                mt={2}
                gridTemplateColumns={`repeat(auto-fill, minmax(130px, 1fr))`}
              >
                <Box
                  p={"4px"}
                  rounded={"md"}
                  bg={colorMode === "dark" ? "gray.800" : "gray.200"}
                >
                  {selectedFile ? (
                    <Image
                      rounded={"md"}
                      alt={
                        dataProduct?.attributes?.thumbnail?.data?.attributes
                          ?.alternativeText
                      }
                      src={selectedFile}
                    />
                  ) : (
                    <Image
                      rounded={"md"}
                      alt={
                        dataProduct?.attributes?.thumbnail?.data?.attributes
                          ?.alternativeText
                      }
                      src={
                        dataProduct?.attributes?.thumbnail?.data?.attributes
                          ?.url
                      }
                    />
                  )}
                </Box>
              </Grid>
            )}
          </FormControl>
        </Box>
      </ModalCustom>
    </Flex>
  );
};
export default ProductsDashboardPage;
