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
} from "@chakra-ui/react";
import { IProduct } from "../interfaces";
import { FaRegEdit, FaRegEye, FaTrashAlt } from "react-icons/fa";

interface IProps {
  tHeadData: string[];
  data: IProduct[];
}

const DashboardTableProducts = ({ data, tHeadData }: IProps) => {
  const renderTh = () => {
    return tHeadData.map((th, index) => (
      <Th key={index} textAlign={"center"}>
        {th}
      </Th>
    ));
  };
  const renderBody = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item, index) => (
        <Tr key={index}>
          <Td textAlign={"center"}>{item.id}</Td>
          <Td textAlign={"center"}>{item.attributes.title}</Td>
          <Td textAlign={"center"}>
            {item.attributes.categories.data[0].attributes.title}
          </Td>
          <Td textAlign={"center"}>
            $
            {item.attributes?.price && item.attributes.discountPercentage
              ? Math.ceil(
                  item.attributes?.price - item.attributes.discountPercentage
                )
              : item.attributes?.price &&
                Math.ceil(item.attributes?.price)}{" "}
            USD
          </Td>
          <Td textAlign={"center"}>
            $
            {item.attributes.discountPercentage &&
              Math.ceil(item.attributes.discountPercentage)}{" "}
            USD
          </Td>
          <Td textAlign={"center"}>{item.attributes.brand}</Td>
          <Td textAlign={"center"}>
            <Image
              boxSize={"50px"}
              rounded={"100%"}
              mx={"auto"}
              src={item.attributes.thumbnail.data.attributes.url}
              alt={item.attributes.thumbnail.data.attributes.alternativeText}
            />
          </Td>
          <Td textAlign={"center"}>{item.attributes.stock}</Td>
          <Td textAlign={"center"}>{item.attributes.rating}</Td>
          <Td textAlign={"center"}>
            <Button colorScheme="green" size={"sm"} mr={"4px"}>
              <FaRegEye />
            </Button>
            <Button colorScheme="blue" size={"sm"} mr={"4px"}>
              <FaRegEdit />
            </Button>
            <Button colorScheme="red" size={"sm"}>
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
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>{renderTh()}</Tr>
        </Thead>
        <Tbody>{renderBody()}</Tbody>
        <Tfoot>
          <Tr>{renderTh()}</Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default DashboardTableProducts;
