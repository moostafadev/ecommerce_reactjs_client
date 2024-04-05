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
import { FaRegEdit, FaRegEye, FaTrashAlt } from "react-icons/fa";
import { ICategory, IProduct } from "../interfaces";
import { Link } from "react-router-dom";

interface IProps {
  tHeadData: string[];
  data: (ICategory | IProduct)[];
  isProduct?: boolean;
}

const DashboardTable = ({ data, tHeadData, isProduct }: IProps) => {
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
                      ((item as IProduct).attributes.price ?? 0) -
                        ((item as IProduct).attributes.discountPercentage ?? 0)
                    )
                  : (item as IProduct).attributes?.price &&
                    Math.ceil((item as IProduct).attributes.price ?? 0)}{" "}
                USD
              </Td>
              <Td textAlign={"center"}>
                $
                {(item as IProduct).attributes.discountPercentage &&
                  Math.ceil(
                    (item as IProduct).attributes.discountPercentage ?? 0
                  )}{" "}
                USD
              </Td>
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
              src={item.attributes.thumbnail.data.attributes.url}
              alt={item.attributes.thumbnail.data.attributes.alternativeText}
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
  );
};

export default DashboardTable;
