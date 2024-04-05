import { Flex, Heading, Text } from "@chakra-ui/react";
import { axiosInstance } from "../../api/axios.config";
import { useQuery } from "@tanstack/react-query";
import { ICategory } from "../../interfaces";
import DashboardTable from "../../components/DashboardTable";

const CategoriesDashboardPage = () => {
  const getCategories = async () => {
    const res = await axiosInstance.get(`/categories?populate=*`);
    return res;
  };
  const { isLoading, data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories: ICategory[] = data?.data?.data;
  const headTable = [
    "id",
    "Title",
    "Products",
    "Brands",
    "Thumbnail",
    "Actions",
  ];

  if (isLoading) return <Text>Loading ...</Text>;
  return (
    <Flex flexDir={"column"} gap={"30px"}>
      <Heading>Manage categories</Heading>
      <DashboardTable data={categories} tHeadData={headTable} />
    </Flex>
  );
};

export default CategoriesDashboardPage;
