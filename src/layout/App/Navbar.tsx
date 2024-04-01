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
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { MAX_WIDTH_CONTAINER } from "../../common/varables";

interface Props {
  children: React.ReactNode;
  linkTo: string;
  onClick: () => void;
}

const Links = [
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
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")}>
        <Container maxW={MAX_WIDTH_CONTAINER}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={{ lg: 8, base: 2 }} alignItems={"center"}>
              <IconButton
                size={"md"}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={"Open Menu"}
                display={{ md: "none" }}
                onClick={isOpen ? onClose : onOpen}
              />
              <Box as={Link} to="/" fontSize={"18px"} fontWeight={"bold"}>
                E-commerce
              </Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map(({ name, linkTo }) => (
                  <NavLink key={name} linkTo={linkTo} onClick={onClose}>
                    {name}
                  </NavLink>
                ))}
              </HStack>
            </HStack>

            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={7}>
                <Button onClick={toggleColorMode}>
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
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
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        src={
                          "https://avatars.dicebear.com/api/male/username.svg"
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>Username</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Profile</MenuItem>
                    <MenuItem color={"red.500"} fontWeight={"semibold"}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map(({ name, linkTo }) => (
                  <NavLink key={name} linkTo={linkTo} onClick={onClose}>
                    {name}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>
    </>
  );
};

export default Navbar;
