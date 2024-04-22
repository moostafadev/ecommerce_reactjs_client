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
} from "@chakra-ui/react";
import { FaRegEdit, FaRegEye, FaTrashAlt } from "react-icons/fa";
import { ICategories, ICategory, IProduct } from "../interfaces";
import { Link } from "react-router-dom";
import AlertDialogC from "./AlartDialog";
import { axiosInstance } from "../api/axios.config";
import { useEffect, useState } from "react";
import cookieServices from "../services/cookieServices";
import ModalCustom from "./ModalCustom";

interface IProps {
  tHeadData: string[];
  data: (ICategory | IProduct)[];
  isProduct?: boolean;
}

const DashboardTable = ({ data, tHeadData, isProduct }: IProps) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [dataProduct, setDataProduct] = useState<IProduct | null>(null);
  const [thumbnail, setThumbnail] = useState<FileList | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDiscount, setHasDiscount] = useState("no");

  useEffect(() => {
    setHasDiscount(
      dataProduct?.attributes.discountPercentage !== null &&
        dataProduct?.attributes.discountPercentage !== undefined
        ? "yes"
        : "no"
    );
  }, [dataProduct, images, thumbnail]);

  const onDelete = async () => {
    if (dataProduct) {
      setIsLoading(true);
      try {
        await axiosInstance.delete(
          `/${isProduct ? "products" : "categories"}/${dataProduct.id}`,
          {
            headers: {
              Authorization: `Bearer ${cookieServices.get("jwt")}`,
            },
          }
        );
        setDataProduct(null);
        onClose();
        toast({
          title: "Deleted Successful",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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

  const filteredCategory = () => {
    const categories = data.map(
      (item: IProduct) => item.attributes.categories.data[0]
    );
    const uniqueCategories = categories.filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.id === category.id)
    );
    return uniqueCategories;
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
                ...filteredCategory().filter(
                  (category) => category.attributes.title === value
                )[0],
              },
            ],
          },
        },
      });
    }
  };

  const onClickEditHandler = async () => {
    const formData = new FormData();
    if (dataProduct) {
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
        setDataProduct(null);
        onModalClose();
        toast({
          title: "Edit Successful",
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
        setIsLoading(false);
      }
    }
  };

  const renderBody = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item, index) => (
        <Tr key={index}>
          <Td textAlign={"center"}>{item.id}</Td>
          <Td textAlign={"center"}>{item.attributes.title}</Td>
          {isProduct ? (
            <>
              <Td textAlign={"center"}>
                {item.attributes.categories.data[0].attributes.title}
              </Td>
              <Td textAlign={"center"}>
                $
                {(item as IProduct).attributes.price &&
                (item as IProduct).attributes.discountPercentage
                  ? Math.ceil(
                      ((item as IProduct)?.attributes?.price ?? 0) -
                        ((((item as IProduct)?.attributes?.price ?? 1) *
                          ((item as IProduct)?.attributes?.discountPercentage ??
                            1)) /
                          100 ?? 0)
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
                setDataProduct(item);
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
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Description"
              name="description"
              value={dataProduct?.attributes.description}
              onChange={onChangeTextHandler}
            />
          </FormControl>
          {isProduct ? (
            <>
              <FormControl mt={4}>
                <FormLabel>Category</FormLabel>
                <Select
                  onChange={onChangeCategoryHandler}
                  value={
                    dataProduct?.attributes.categories.data[0].attributes.title
                  }
                >
                  {dataProduct &&
                    filteredCategory().map((item: ICategories, idx) => (
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
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Stock</FormLabel>
                <NumberInput name="stock" value={dataProduct?.attributes.stock}>
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
                  console.log(e);
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
            {dataProduct?.attributes?.thumbnail && (
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
