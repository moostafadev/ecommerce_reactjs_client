import { Box, Container } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { MAX_WIDTH_CONTAINER } from "../common/varables";

const CategoryPage = () => {
  const params = useParams();
  console.log(params.id);

  return (
    <Box>
      <Container maxW={MAX_WIDTH_CONTAINER}>CategoryPage</Container>
    </Box>
  );
};

export default CategoryPage;
