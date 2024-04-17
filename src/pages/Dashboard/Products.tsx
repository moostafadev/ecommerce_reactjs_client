import { Flex, Heading, Text } from "@chakra-ui/react";
import { axiosInstance } from "../../api/axios.config";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../../interfaces";
import DashboardTable from "../../components/DashboardTable";

const ProductsDashboardPage = () => {
  const getProducts = async () => {
    const res = await axiosInstance.get(`/products?populate=*`);
    return res;
  };
  const { isLoading, data } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products: IProduct[] = data?.data?.data;
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

  if (isLoading) return <Text>Loading ...</Text>;
  return (
    <Flex flexDir={"column"} gap={"30px"}>
      <Heading>Manage products</Heading>
      <DashboardTable data={products} tHeadData={headTable} isProduct={true} />
    </Flex>
  );
};

export default ProductsDashboardPage;
