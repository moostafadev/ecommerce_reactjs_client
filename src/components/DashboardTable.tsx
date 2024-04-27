import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Image,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Box,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Stack,
  InputGroup,
  InputRightAddon,
  Grid,
  useColorMode,
  FormHelperText,
} from "@chakra-ui/react";
import { FaRegEdit, FaRegEye, FaTrashAlt } from "react-icons/fa";
import { ICategories, ICategory, IProduct } from "../interfaces";
import { Link } from "react-router-dom";
import AlertDialogC from "./AlartDialog";
import { axiosInstance } from "../api/axios.config";
import { useEffect, useState } from "react";
import cookieServices from "../services/cookieServices";
import ModalCustom from "./ModalCustom";
import { useDispatch } from "react-redux";
import { generateUniqueTmp } from "../app/features/tmpSlice";

interface IProps {
  tHeadData: string[];
  data: (ICategory | IProduct)[];
  isProduct?: boolean;
  categoriesData: ICategory[];
}

const DashboardTable = ({
  data,
  tHeadData,
  isProduct,
  categoriesData,
}: IProps) => {
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
  const defaultCategory = {
    id: 0,
    attributes: {
      title: "",
      description: "",
      thumbnail: {
        data: { id: 0, attributes: { alternativeText: "", url: "" } },
      },
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
    },
  };

  const toast = useToast();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [dataProduct, setDataProduct] = useState<IProduct>(defaultProduct);
  const [dataCategory, setDataCategory] = useState<ICategory>(defaultCategory);
  const [thumbnail, setThumbnail] = useState<FileList | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[] | null>(null);
  const [hiddenImageIds, setHiddenImageIds] = useState<number[]>([]);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDiscount, setHasDiscount] = useState("no");
  // Validation
  const [isTitle, setIsTitle] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const [isBrand, setIsBrand] = useState(false);
  const [isStock, setIsStock] = useState(false);
  const [isPrice, setIsPrice] = useState(false);

  useEffect(() => {
    setHasDiscount(
      dataProduct?.attributes.discountPercentage !== null &&
        dataProduct?.attributes.discountPercentage !== undefined
        ? "yes"
        : "no"
    );
  }, [dataProduct, images, thumbnail]);

  // Handlers
  const getUniqueBrands = (category: ICategory) => {
    const brands: string[] = [];
    category.attributes.products?.data.forEach((product) => {
      const brand = product.attributes.brand;
      if (!brands.includes(brand)) {
        brands.push(brand);
      }
    });
    return brands.join(", ");
  };

  const onChangeTextHandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (dataProduct) {
      setDataProduct({
        ...dataProduct,
        attributes: {
          ...dataProduct.attributes,
          [name]: value,
        },
      });
    }
  };

  const onChangeNumberHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (dataProduct) {
      setDataProduct({
        ...dataProduct,
        attributes: {
          ...dataProduct.attributes,
          [name]: +value,
        },
      });
    }
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
                  (category) => category.attributes.title === value
                )[0],
              },
            ],
          },
        },
      });
    }
  };

  const removeImgHandler = async (id: number) => {
    try {
      setIsLoadingRemove(true);
      await axiosInstance.delete(`/upload/files/${id}`, {
        headers: {
          Authorization: `Bearer ${cookieServices.get("jwt")}`,
        },
      });
      setHiddenImageIds((prevIds) => [...prevIds, id]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingRemove(false);
    }
  };

  const onDelete = async () => {
    if (dataProduct || dataCategory) {
      setIsLoading(true);
      try {
        await axiosInstance.delete(
          `/${isProduct ? "products" : "categories"}/${
            isProduct ? dataProduct.id : dataCategory.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${cookieServices.get("jwt")}`,
            },
          }
        );
        if (dataCategory.attributes.products?.data.length) {
          const data = dataCategory?.attributes?.products?.data;
          console.log(data);
          for (let i = 0; i < data?.length; i++) {
            await axiosInstance.delete(`/products/${data[i].id}`, {
              headers: {
                Authorization: `Bearer ${cookieServices.get("jwt")}`,
              },
            });
          }
        }
        setDataProduct(defaultProduct);
        setDataCategory(defaultCategory);
        onClose();
        dispatch(generateUniqueTmp());
        toast({
          title: "Deleted Successful",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onClickEditHandler = async () => {
    // Valication
    const { title, description, brand, stock, price } = dataProduct.attributes;
    if (!title && !description && !brand && !stock && !price) {
      setIsTitle(true);
      setIsDescription(true);
      if (isProduct) {
        setIsBrand(true);
        setIsStock(true);
        setIsPrice(true);
        return;
      }
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
    if (isProduct) {
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
    }
    const formData = new FormData();
    if (dataProduct.id || dataCategory.id) {
      setIsLoading(true);
      if (isProduct) {
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
      } else {
        formData.append(
          "data",
          JSON.stringify({
            title: dataProduct.attributes.title,
            description: dataProduct.attributes.description,
          })
        );
      }
      if (thumbnail) {
        formData.append("files.thumbnail", thumbnail[0]);
      }
      try {
        await axiosInstance.put(
          `/${isProduct ? "products" : "categories"}/${
            dataProduct.id
          }?populate=*`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookieServices.get("jwt")}`,
            },
          }
        );
        setDataProduct(defaultProduct);
        setDataCategory(defaultCategory);
        onModalClose();
        dispatch(generateUniqueTmp());
        toast({
          title: "Edit Successful",
          status: "success",
          duration: 500,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Renders
  const renderBody = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item, index) => (
        <Tr key={index}>
          <Td textAlign={"center"}>{item.id}</Td>
          <Td textAlign={"center"}>{item.attributes.title}</Td>
          {isProduct ? (
            <>
              <Td textAlign={"center"}>
                {item.attributes.categories.data[0]?.attributes?.title}
              </Td>
              <Td textAlign={"center"}>
                $
                {(item as IProduct).attributes.price &&
                (item as IProduct).attributes.discountPercentage
                  ? Math.ceil(
                      ((item as IProduct)?.attributes?.price ?? 0) -
                        (((item as IProduct)?.attributes?.price ?? 1) *
                          ((item as IProduct)?.attributes?.discountPercentage ??
                            1)) /
                          100
                    )
                  : (item as IProduct).attributes?.price &&
                    Math.ceil((item as IProduct).attributes.price ?? 0)}{" "}
                USD
              </Td>
              {(item as IProduct).attributes.discountPercentage ? (
                <Td textAlign={"center"}>
                  {(item as IProduct).attributes.discountPercentage &&
                    ((item as IProduct)?.attributes?.discountPercentage ??
                      0)}{" "}
                  %
                </Td>
              ) : (
                <Td textAlign={"center"}>Not discount</Td>
              )}
              <Td textAlign={"center"}>
                {(item as IProduct).attributes.brand}
              </Td>
              <Td textAlign={"center"}>
                {(item as IProduct).attributes.stock}
              </Td>
              <Td textAlign={"center"}>
                {(item as IProduct).attributes.rating}
              </Td>
            </>
          ) : (
            <>
              <Td textAlign={"center"}>
                {(item as ICategory).attributes.products?.data.length}
              </Td>
              <Td textAlign={"center"}>{getUniqueBrands(item)}</Td>
            </>
          )}
          <Td textAlign={"center"}>
            <Image
              boxSize={"50px"}
              rounded={"100%"}
              mx={"auto"}
              objectFit={"cover"}
              src={
                item?.attributes?.thumbnail?.data?.attributes?.url
                  ? item?.attributes?.thumbnail?.data?.attributes?.url
                  : "https://res.cloudinary.com/dvtmqtcyl/image/upload/v1712000980/No_Products_55d29f8b32.jpg"
              }
              alt={
                item?.attributes?.thumbnail?.data?.attributes?.alternativeText
                  ? item?.attributes?.thumbnail?.data?.attributes
                      ?.alternativeText
                  : "NoProducts"
              }
            />
          </Td>
          <Td textAlign={"center"}>
            <Button
              as={Link}
              to={isProduct ? `/products/${item.id}` : `/categories/${item.id}`}
              colorScheme="green"
              size={"sm"}
              mr={"4px"}
            >
              <FaRegEye />
            </Button>
            <Button
              colorScheme="blue"
              size={"sm"}
              mr={"4px"}
              onClick={() => {
                setDataProduct(item);
                onModalOpen();
              }}
            >
              <FaRegEdit />
            </Button>
            <Button
              colorScheme="red"
              size={"sm"}
              onClick={() => {
                if (isProduct) {
                  setDataProduct(item);
                } else {
                  setDataCategory(item);
                }
                onOpen();
              }}
            >
              <FaTrashAlt />
            </Button>
          </Td>
        </Tr>
      ));
    } else {
      return (
        <Tr>
          <Td colSpan={tHeadData.length}>No data available</Td>
        </Tr>
      );
    }
  };

  return (
    <>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              {tHeadData.map((th, index) => (
                <Th key={index} textAlign={"center"}>
                  {th}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>{renderBody()}</Tbody>
          <Tfoot>
            <Tr>
              {tHeadData.map((th, index) => (
                <Th key={index} textAlign={"center"}>
                  {th}
                </Th>
              ))}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <AlertDialogC
        isOpen={isOpen}
        onClose={onClose}
        onDelete={onDelete}
        isLoading={isLoading}
        title={isProduct ? "Delete product" : "Delete category"}
      />
      <ModalCustom
        isOpen={isModalOpen}
        onClose={onModalClose}
        clickHandler={onClickEditHandler}
        isLoading={isLoading}
        title={isProduct ? "Edit product" : "Edit category"}
        okBtn="Edit"
      >
        <Box>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Title"
              type="text"
              name="title"
              value={dataProduct?.attributes.title}
              onChange={onChangeTextHandler}
            />
            {isTitle && (
              <FormHelperText color={"red.400"}>
                Title is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Description"
              name="description"
              value={dataProduct?.attributes.description}
              onChange={onChangeTextHandler}
            />
            {isDescription && (
              <FormHelperText color={"red.400"}>
                Description is required!
              </FormHelperText>
            )}
          </FormControl>
          {isProduct ? (
            <>
              <FormControl mt={4}>
                <FormLabel>Category</FormLabel>
                <Select
                  onChange={onChangeCategoryHandler}
                  value={
                    dataProduct?.attributes.categories.data[0]?.attributes
                      ?.title
                  }
                >
                  {dataProduct &&
                    categoriesData?.map((item: ICategories, idx: number) => (
                      <option key={idx} value={item.attributes.title}>
                        {item.attributes.title}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Brand</FormLabel>
                <Input
                  placeholder="Brand"
                  type="text"
                  name="brand"
                  value={dataProduct?.attributes.brand}
                  onChange={onChangeTextHandler}
                />
                {isBrand && (
                  <FormHelperText color={"red.400"}>
                    Brand is required!
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Stock</FormLabel>
                <NumberInput name="stock" value={dataProduct?.attributes.stock}>
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
                <FormLabel>Price</FormLabel>
                <NumberInput
                  name="price"
                  defaultValue={dataProduct?.attributes.price}
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
                  dataProduct?.attributes.discountPercentage &&
                  dataProduct?.attributes.discountPercentage > 0
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
                    defaultValue={dataProduct?.attributes.discountPercentage}
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
                            dataProduct?.attributes.price &&
                            dataProduct?.attributes.discountPercentage &&
                            Math.ceil(
                              dataProduct?.attributes.price -
                                (dataProduct?.attributes.price *
                                  dataProduct?.attributes.discountPercentage) /
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
                    setImages(e.target.files);
                    const files = e.target.files;
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
                {dataProduct?.attributes?.images?.data?.length &&
                !selectedFiles?.length ? (
                  <Grid
                    mt={2}
                    gap={2}
                    gridTemplateColumns={`repeat(auto-fill, minmax(130px, 1fr))`}
                  >
                    {dataProduct?.attributes?.images?.data?.map((img, idx) => (
                      <Box
                        key={idx}
                        p={"4px"}
                        rounded={"md"}
                        bg={colorMode === "dark" ? "gray.800" : "gray.200"}
                        position={"relative"}
                        display={
                          hiddenImageIds.includes(img.id) ? "none" : "block"
                        }
                        _hover={{
                          "& > div": { display: "flex" },
                        }}
                      >
                        <Image
                          rounded={"md"}
                          alt={img?.attributes?.alternativeText}
                          src={img?.attributes?.url}
                          objectFit={"cover"}
                          w={"100%"}
                          h={"100%"}
                        />
                        <Box
                          position={"absolute"}
                          left={"50%"}
                          top={"50%"}
                          transform={"translate(-50%, -50%)"}
                          w={"100%"}
                          h={"100%"}
                          rounded={"md"}
                          display={"none"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Box
                            w={"100%"}
                            h={"100%"}
                            rounded={"md"}
                            backdropFilter={"blur(5px)"}
                            position={"absolute"}
                            zIndex={"-1"}
                          ></Box>
                          <Button
                            isLoading={isLoadingRemove}
                            variant={"outline"}
                            p={"12px 0"}
                            fontSize={"30px"}
                            cursor={"pointer"}
                            onClick={() => removeImgHandler(img.id)}
                          >
                            <FaTrashAlt />
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                ) : (
                  <Grid
                    mt={2}
                    gap={2}
                    gridTemplateColumns={`repeat(auto-fill, minmax(130px, 1fr))`}
                  >
                    {dataProduct?.attributes?.images?.data?.map((img, idx) => (
                      <Box
                        key={idx}
                        p={"4px"}
                        rounded={"md"}
                        bg={colorMode === "dark" ? "gray.800" : "gray.200"}
                      >
                        <Image
                          rounded={"md"}
                          alt={img?.attributes?.alternativeText}
                          src={img?.attributes?.url}
                          objectFit={"cover"}
                          w={"100%"}
                          h={"100%"}
                        />
                      </Box>
                    ))}
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
            </>
          ) : (
            <></>
          )}
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
            {(dataProduct?.attributes?.thumbnail.data?.attributes?.url ||
              thumbnail) && (
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
    </>
  );
};

export default DashboardTable;
