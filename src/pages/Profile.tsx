import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { MAX_WIDTH_CONTAINER } from "../common/varables";
import { axiosInstance } from "../api/axios.config";
import cookieServices from "../services/cookieServices";
import { useQuery } from "@tanstack/react-query";
import { IUserData } from "../interfaces";

const ProfilePage = ({ isAuthantecated }: { isAuthantecated: string }) => {
  const { colorMode } = useColorMode();
  const { id } = useParams();

  const getUser = async () => {
    const res = await axiosInstance.get(`/users/${id}?populate=*`, {
      headers: {
        Authorization: `Bearer ${cookieServices.get("jwt")}`,
      },
    });
    return res;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users", id],
    queryFn: getUser,
  });

  const user: IUserData = data?.data;

  if (isLoading) {
    return <Text>Loading ...</Text>;
  }

  if (!isAuthantecated) {
    history.back();
    return null;
  }

  return (
    <Container maxW={MAX_WIDTH_CONTAINER} minH="calc(100vh - 128px)" py="16px">
      <Box>
        <Heading mb={"16px"}>Profile</Heading>
        <Flex
          bg={colorMode === "dark" ? "gray.900" : "gray.100"}
          padding={"20px"}
          rounded={"md"}
          flexDir={{ base: "column", sm: "row" }}
          gap={"24px"}
        >
          <Box>
            <Image
              rounded={"md"}
              w={"100%"}
              src={
                user?.image?.url
                  ? user?.image?.url
                  : "../../src/assets/User_not_found.jpg"
              }
            />
          </Box>
          <Box
            display={"flex"}
            flexDir={"column"}
            gap={"16px"}
            fontSize={{ base: "18px", sm: "24px" }}
            justifyContent={"space-between"}
          >
            <Flex gap={"12px"}>
              <Text>Id:</Text>
              <Text fontWeight={"semibold"}>{user?.id}</Text>
            </Flex>
            <Flex gap={"12px"}>
              <Text>UserName:</Text>
              <Text fontWeight={"semibold"}>{user?.username}</Text>
            </Flex>
            <Flex gap={"12px"}>
              <Text>Email:</Text>
              <Text fontWeight={"semibold"}>{user?.email}</Text>
            </Flex>
            <Flex gap={"12px"}>
              <Text>Role:</Text>
              <Text fontWeight={"semibold"}>{user?.role?.name}</Text>
            </Flex>
            <Flex gap={"12px"}>
              <Text>CreatedAt:</Text>
              <Text fontWeight={"semibold"}>
                {user?.createdAt.split("T")[0]}
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Button onClick={() => history.back()} colorScheme="orange" mt={"16px"}>
          Back
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
