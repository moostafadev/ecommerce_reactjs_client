import React from "react";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FiHome, FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";
import { Link, Outlet } from "react-router-dom";
import { FaTableCells } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import cookieServices from "../../services/cookieServices";

interface LinkItemProps {
  name: string;
  to: string;
  icon: IconType;
}

interface NavItemProps extends FlexProps {
  to: string;
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", to: "/dashboard/", icon: FiHome },
  { name: "Products", to: "/dashboard/products", icon: FaTableCells },
  { name: "Categories", to: "/dashboard/categories", icon: BiSolidCategory },
  { name: "Users", to: "/dashboard/users", icon: FaUsers },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          as={Link}
          to={"/"}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Flex gap={"8px"} flexDirection={"column"}>
        {LinkItems.map((link) => (
          <NavItem
            to={link.to}
            key={link.name}
            icon={link.icon}
            onClick={onClose}
            p={"12px"}
          >
            {link.name}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};

const NavItem = ({ icon, to, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as={Link}
      to={to}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        transition={".3s"}
        _hover={{
          bg: "purple.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    cookieServices.remove("jwt");
    cookieServices.remove("user");
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

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>
      <HStack spacing={{ base: "2", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Button
          onClick={toggleColorMode}
          padding={{ base: "0px", md: "16px" }}
          size="lg"
          variant="ghost"
        >
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton transition="all 0.3s" _focus={{ boxShadow: "none" }}>
              <HStack>
                <Avatar src={"../../assets/User_not_found.jpg"} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">
                    {cookieServices.get("user").username}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const DashboardLayout = ({
  isAuthantecated,
}: {
  isAuthantecated: string | boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  if (!isAuthantecated) {
    history.back();
    return;
  }

  return (
    <Box minH="100vh" bg={colorMode === "light" ? "gray.100" : "gray.900"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
