import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios.config";
import cookieServices from "../../services/cookieServices";
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
  InputGroup,
  InputRightElement,
  Select,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { IErrorResponse, IUser, IUserData } from "../../interfaces";
import { FaRegEdit, FaRegEye, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import AlertDialogC from "../../components/AlartDialog";
import ModalCustom from "../../components/ModalCustom";
import { useDispatch, useSelector } from "react-redux";
import { generateUniqueTmp, selectTmpValue } from "../../app/features/tmpSlice";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { AxiosError } from "axios";

const UsersDashboardPage = () => {
  const defaultUser = {
    id: 0,
    createdAt: "",
    email: "",
    role: {
      id: 0,
      name: "",
      type: "",
    },
    image: {
      url: "",
      alternativeText: "",
    },
    username: "",
  };
  const dafaultAddUser = {
    username: "",
    email: "",
    password: "",
    role: {
      id: 0,
      name: "",
      type: "",
    },
  };
  const tmpValue = useSelector(selectTmpValue);

  const toast = useToast();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalAddOpen,
    onOpen: onModalAddOpen,
    onClose: onModalAddClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const getUsers = async () => {
    const res = await axiosInstance.get(`/users?populate=*`, {
      headers: {
        Authorization: `Bearer ${cookieServices.get("jwt")}`,
      },
    });
    return res;
  };
  const { isLoading, data } = useQuery({
    queryKey: ["usersData", tmpValue],
    queryFn: getUsers,
  });

  const getRoles = async () => {
    const res = await axiosInstance.get(`/users-permissions/roles?populate=*`, {
      headers: {
        Authorization: `Bearer ${cookieServices.get("jwt")}`,
      },
    });
    return res;
  };
  const { data: dataRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
  const rolesData = dataRoles?.data?.roles;

  const users: IUserData[] = data?.data?.filter(
    (user: IUserData) => user.id !== cookieServices.get("user").id
  );

  const [userData, setUserData] = useState<IUserData>(defaultUser);
  const [isLoadingDel, setIsLoadingDel] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  // Validation
  const [isUsername, setIsUsername] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isRole, setIsRole] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<IUser>(dafaultAddUser);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setUser({ ...user, [name]: value });
  };

  const onChangeCategoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (userData) {
      setUserData({
        ...userData,
        role: {
          ...userData.role,
          id: +value,
        },
      });
    }
  };

  const onSubmitAddHandler = async () => {
    const { id } = userData.role;
    const { username, email, password } = user;
    if (!username && !email && !password && !id) {
      setIsUsername(true);
      setIsEmail(true);
      setIsPassword(true);
      setIsRole(true);
      return;
    }
    if (!username || username.length < 3) {
      setIsUsername(true);
      return;
    }
    if (!email) {
      setIsEmail(true);
      return;
    }
    if (!password || password.length < 6) {
      setIsPassword(true);
      return;
    }
    if (!id) {
      setIsRole(true);
      return;
    }
    setIsUsername(false);
    setIsEmail(false);
    setIsPassword(false);
    setIsRole(false);
    setIsLoadingBtn(true);
    try {
      await axiosInstance.post(
        "/users",
        {
          username: user.username,
          email: user.email,
          password: user.password,
          role: userData.role.id,
        },
        {
          headers: {
            Authorization: `Bearer ${cookieServices.get("jwt")}`,
          },
        }
      );
      setUser(dafaultAddUser);
      setUserData(defaultUser);
      onModalAddClose();
      dispatch(generateUniqueTmp());
      toast({
        title: "Added Successful",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast({
        title: errorObj.response?.data.error.message,
        description:
          "Unable to log in. Please double-check your username, email and password and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingBtn(false);
    }
  };

  const onSubmitEditHandler = async () => {
    // Valication
    const { name } = userData.role;
    if (!name) {
      setIsRole(true);
      return;
    }
    setIsLoadingBtn(true);
    try {
      await axiosInstance.put(
        `/users/${userData.id}`,
        {
          role: userData.role.id,
        },
        {
          headers: {
            Authorization: `Bearer ${cookieServices.get("jwt")}`,
          },
        }
      );
      setUserData(defaultUser);
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
      setIsLoadingBtn(false);
    }
  };

  const onDelete = async () => {
    if (userData.id) {
      setIsLoadingDel(true);
      try {
        await axiosInstance.delete(`/users/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${cookieServices.get("jwt")}`,
          },
        });
        setUserData(defaultUser);
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
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Heading>Manage users</Heading>
          <Button colorScheme="green" onClick={onModalAddOpen}>
            Add a new user
          </Button>
        </Flex>
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
                    <Button
                      colorScheme="blue"
                      size={"sm"}
                      flexGrow={1}
                      onClick={() => {
                        setUserData(user);
                        onModalOpen();
                      }}
                    >
                      <FaRegEdit />
                    </Button>
                    <Button
                      colorScheme="red"
                      size={"sm"}
                      flexGrow={1}
                      onClick={() => {
                        setUserData(user);
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
      <ModalCustom
        isOpen={isModalAddOpen}
        onClose={onModalAddClose}
        title="Add user"
        clickHandler={onSubmitAddHandler}
        isLoading={isLoadingBtn}
      >
        <Box>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={user.username}
              onChange={onChangeHandler}
              name="username"
              isInvalid={isUsername}
            />
            {isUsername && (
              <FormHelperText color={"red.400"}>
                Username is required and min letters 3!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={user.email}
              onChange={onChangeHandler}
              name="email"
              isInvalid={isEmail}
            />
            {isEmail && (
              <FormHelperText color={"red.400"}>
                Email is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={onChangeHandler}
                name="password"
                isInvalid={isPassword}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {isPassword && (
              <FormHelperText color={"red.400"}>
                Password is required and min letters 6!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="Choose role"
              onChange={onChangeCategoryHandler}
              value={userData?.role.id}
              isInvalid={isRole}
            >
              {userData &&
                rolesData?.map(
                  (
                    item: { id: number; name: string; type: string },
                    idx: number
                  ) => (
                    <option key={idx} value={item.id}>
                      {item.name}
                    </option>
                  )
                )}
            </Select>
            {isRole && (
              <FormHelperText color={"red.400"}>Choose a role!</FormHelperText>
            )}
          </FormControl>
        </Box>
      </ModalCustom>
      <ModalCustom
        isOpen={isModalOpen}
        onClose={onModalClose}
        title="Edit user"
        clickHandler={onSubmitEditHandler}
        isLoading={isLoadingBtn}
      >
        <Box>
          <FormControl mt={4}>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="Choose role"
              onChange={onChangeCategoryHandler}
              value={userData?.role.id}
            >
              {userData &&
                rolesData?.map(
                  (
                    item: { id: number; name: string; type: string },
                    idx: number
                  ) => (
                    <option key={idx} value={item.id}>
                      {item.name}
                    </option>
                  )
                )}
            </Select>
            {isRole && (
              <FormHelperText color={"red.400"}>Choose a role!</FormHelperText>
            )}
          </FormControl>
        </Box>
      </ModalCustom>
    </>
  );
};

export default UsersDashboardPage;
