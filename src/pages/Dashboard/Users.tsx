import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios.config";
import cookieServices from "../../services/cookieServices";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { IUserData } from "../../interfaces";
import { FaRegEdit, FaRegEye, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import AlertDialogC from "../../components/AlartDialog";

const UsersDashboardPage = () => {
  const { colorMode } = useColorMode();
  const getUsers = async () => {
    const res = await axiosInstance.get(`/users?populate=*`, {
      headers: {
        Authorization: `Bearer ${cookieServices.get("jwt")}`,
      },
    });
    return res;
  };
  const { isLoading, data } = useQuery({
    queryKey: ["usersData"],
    queryFn: getUsers,
  });

  const users: IUserData[] = data?.data?.filter(
    (user: IUserData) => user.id !== cookieServices.get("user").id
  );

  const [id, setId] = useState<number | null>(null);
  const [isLoadingDel, setIsLoadingDel] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDelete = async () => {
    if (id) {
      setIsLoadingDel(true);
      try {
        await axiosInstance.delete(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${cookieServices.get("jwt")}`,
          },
        });
        setId(null);
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
        setIsLoadingDel(false);
      }
    }
  };

  if (isLoading) {
    return <Text>Loading ...</Text>;
  }

  return (
    <>
      <Flex flexDir={"column"} gap={"30px"}>
        <Heading>Manage users</Heading>
        <Grid
          templateColumns={"repeat(auto-fill, minmax(250px, 1fr))"}
          gap={"3"}
        >
          {users.length ? (
            users?.map((user: IUserData, idx) => (
              <Box
                key={idx}
                rounded={"md"}
                bg={colorMode === "dark" ? "gray.700" : "gray.300"}
              >
                <Image
                  rounded={"md"}
                  w={"100%"}
                  src={
                    user?.image?.url
                      ? user?.image?.url
                      : "../../../src/assets/User_not_found.jpg"
                  }
                />
                <Flex p={"16px"} flexDir={"column"} gap={"16px"}>
                  <Flex gap={"8px"}>
                    <Text>Id:</Text>
                    <Text fontWeight={"semibold"}>{user.id}</Text>
                  </Flex>
                  <Flex gap={"8px"}>
                    <Text>Username:</Text>
                    <Text fontWeight={"semibold"}>{user.username}</Text>
                  </Flex>
                  <Flex gap={"8px"}>
                    <Text>Email:</Text>
                    <Text fontWeight={"semibold"}>{user.email}</Text>
                  </Flex>
                  <Flex gap={"8px"}>
                    <Text>Role:</Text>
                    <Text fontWeight={"semibold"}>{user.role.name}</Text>
                  </Flex>
                  <Flex gap={"16px"}>
                    <Button
                      colorScheme="green"
                      size={"sm"}
                      flexGrow={1}
                      as={Link}
                      to={`/profiles/${user.id}`}
                    >
                      <FaRegEye />
                    </Button>
                    <Button colorScheme="blue" size={"sm"} flexGrow={1}>
                      <FaRegEdit />
                    </Button>
                    <Button
                      colorScheme="red"
                      size={"sm"}
                      flexGrow={1}
                      onClick={() => {
                        setId(user.id);
                        onOpen();
                      }}
                    >
                      <FaTrashAlt />
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            ))
          ) : (
            <Text>Users not found</Text>
          )}
        </Grid>
      </Flex>
      <AlertDialogC
        isOpen={isOpen}
        onClose={onClose}
        onDelete={onDelete}
        isLoading={isLoadingDel}
        title={"Delete user"}
      />
    </>
  );
};

export default UsersDashboardPage;
