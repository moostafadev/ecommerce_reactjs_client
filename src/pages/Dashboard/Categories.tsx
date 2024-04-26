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
  Text,
  Textarea,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/axios.config";
import { useQuery } from "@tanstack/react-query";
import { ICategory } from "../../interfaces";
import DashboardTable from "../../components/DashboardTable";
import ModalCustom from "../../components/ModalCustom";
import { useState } from "react";
import cookieServices from "../../services/cookieServices";

const CategoriesDashboardPage = () => {
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
  const headTable = [
    "id",
    "Title",
    "Products",
    "Brands",
    "Thumbnail",
    "Actions",
  ];

  const getCategories = async () => {
    const res = await axiosInstance.get(`/categories?populate=*`);
    return res;
  };
  const { isLoading, data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories: ICategory[] = data?.data?.data;

  const toast = useToast();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataCategory, setDataCategory] = useState<ICategory>(defaultCategory);
  const [thumbnail, setThumbnail] = useState<FileList | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  // Validation
  const [isTitle, setIsTitle] = useState(false);
  const [isDescription, setIsDescription] = useState(false);

  // Handlers
  const onChangeTextHandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDataCategory((prevCategory) => ({
      ...prevCategory,
      attributes: {
        ...prevCategory?.attributes,
        [name]: value,
      },
    }));
  };

  const onSubmitHandler = async () => {
    // Valication
    const { title, description } = dataCategory.attributes;
    if (!title && !description) {
      setIsTitle(true);
      setIsDescription(true);
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
    const formData = new FormData();
    if (dataCategory) {
      setIsLoadingBtn(true);
      formData.append(
        "data",
        JSON.stringify({
          title: dataCategory.attributes.title,
          description: dataCategory.attributes.description,
        })
      );
      if (thumbnail) {
        formData.append("files.thumbnail", thumbnail[0]);
      }
    }
    try {
      await axiosInstance.post(`/categories?populate=*`, formData, {
        headers: {
          Authorization: `Bearer ${cookieServices.get("jwt")}`,
        },
      });
      setDataCategory(defaultCategory);
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
        <Heading>Manage categories</Heading>
        <Button colorScheme="green" onClick={onOpen}>
          Add a new category
        </Button>
      </Flex>
      <DashboardTable data={categories} tHeadData={headTable} />
      <ModalCustom
        isOpen={isOpen}
        onClose={onClose}
        title={"Add a new category"}
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
              value={dataCategory.attributes?.title}
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
              value={dataCategory.attributes?.description}
              onChange={onChangeTextHandler}
            />
            {isDescription && (
              <FormHelperText color={"red.400"}>
                Description is required!
              </FormHelperText>
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
                        dataCategory?.attributes?.thumbnail?.data?.attributes
                          ?.alternativeText
                      }
                      src={selectedFile}
                    />
                  ) : (
                    <Image
                      rounded={"md"}
                      alt={
                        dataCategory?.attributes?.thumbnail?.data?.attributes
                          ?.alternativeText
                      }
                      src={
                        dataCategory?.attributes?.thumbnail?.data?.attributes
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

export default CategoriesDashboardPage;
