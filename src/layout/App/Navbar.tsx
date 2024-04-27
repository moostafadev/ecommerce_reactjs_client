import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
  useDisclosure,
  IconButton,
  Container,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useToast,
  Text,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { MAX_WIDTH_CONTAINER } from "../../common/varables";
import cookieServices from "../../services/cookieServices";
import React from "react";
import { BsCart } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { selectCart } from "../../app/features/cartSlice";
import { OnOpenCartDrawerAction } from "../../app/features/globalSlice";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axios.config";

interface Props {
  children: React.ReactNode;
  linkTo: string;
  onClick: () => void;
}

const user = cookieServices.get("user");

const Links = () => {
  if (user?.role?.name === "Admin") {
    return [
      {
        name: "Dashboard",
        linkTo: "dashboard",
      },
      {
        name: "Products",
        linkTo: "products",
      },
      {
        name: "Categories",
        linkTo: "categories",
      },
    ];
  } else {
    return [
      {
        name: "Products",
        linkTo: "products",
      },
      {
        name: "Categories",
        linkTo: "categories",
      },
    ];
  }
};

const NavLink = (props: Props) => {
  const { children, linkTo, onClick } = props;
  return (
    <Box
      as={Link}
      to={linkTo}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

const Navbar = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOp, onOpen: onOp, onClose: onCl } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { cartProduct } = useSelector(selectCart);
  const token: string = cookieServices.get("jwt");

  const handleLogout = () => {
    cookieServices.remove("jwt");
    cookieServices.remove("user");
    onCl();
    toast({
      title: "Logout Successful",
      status: "success",
      duration: 500,
      isClosable: true,
    });
    setTimeout(() => {
      window.location.replace("/");
    }, 500);
  };

  const getUser = async () => {
    const res = await axiosInstance.get(
      `/users/${cookieServices.get("user").id}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${cookieServices.get("jwt")}`,
        },
      }
    );
    return res;
  };

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")}>
        <Container maxW={MAX_WIDTH_CONTAINER}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack
              spacing={{ lg: "20px", base: "12px" }}
              alignItems={"center"}
            >
              <IconButton
                size={"md"}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={"Open Menu"}
                display={{ md: "none" }}
                onClick={isOpen ? onClose : onOpen}
                padding={{ base: "0px", md: "16px" }}
              />
              <Box
                as={Link}
                to="/"
                fontSize={{ base: "14px", sm: "18px" }}
                mr={{ lg: "12px" }}
                fontWeight={"bold"}
              >
                Logo
              </Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links().map(({ name, linkTo }) => (
                  <NavLink key={name} linkTo={linkTo} onClick={onClose}>
                    {name}
                  </NavLink>
                ))}
              </HStack>
            </HStack>

            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={{ base: "4px", md: "16px" }}>
                <Button
                  onClick={toggleColorMode}
                  padding={{ base: "0px", md: "16px" }}
                >
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>

                {token ? (
                  <>
                    <Button
                      padding={{ base: "8px", md: "16px" }}
                      display={"flex"}
                      gap={"4px"}
                      onClick={() => dispatch(OnOpenCartDrawerAction())}
                    >
                      <BsCart />
                      <Text>({cartProduct.length})</Text>
                    </Button>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rounded={"full"}
                        variant={"link"}
                        cursor={"pointer"}
                        minW={0}
                      >
                        <Avatar
                          size={"sm"}
                          src={
                            data?.data?.image?.url
                              ? data?.data?.image?.url
                              : "../../src/assets/User_not_found.jpg"
                          }
                        />
                      </MenuButton>
                      <MenuList alignItems={"center"}>
                        <br />
                        <Center>
                          <Avatar
                            size={"2xl"}
                            src={
                              data?.data?.image?.url
                                ? data?.data?.image?.url
                                : "../../src/assets/User_not_found.jpg"
                            }
                          />
                        </Center>
                        <br />
                        <Center>
                          <p>{user?.username}</p>
                        </Center>
                        <br />
                        <MenuDivider />
                        <MenuItem
                          as={Link}
                          to={`/profiles/${cookieServices.get("user").id}`}
                        >
                          Profile
                        </MenuItem>
                        <MenuItem
                          color={"red.500"}
                          fontWeight={"semibold"}
                          onClick={onOp}
                        >
                          Logout
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </>
                ) : (
                  <Button
                    as={Link}
                    to={"/login"}
                    colorScheme="green"
                    variant="ghost"
                    padding={{ base: "6px 8px", md: "16px" }}
                  >
                    Login
                  </Button>
                )}
              </Stack>
            </Flex>
          </Flex>
          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links().map(({ name, linkTo }) => (
                  <NavLink key={name} linkTo={linkTo} onClick={onClose}>
                    {name}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>
      <AlertDialog isOpen={isOp} leastDestructiveRef={cancelRef} onClose={onCl}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCl}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Navbar;
