import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  FormHelperText,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { IErrorResponse, IUser } from "../interfaces";
import { axiosInstance } from "../api/axios.config";
import { AxiosError } from "axios";
import cookieServices from "../services/cookieServices";
import { Link } from "react-router-dom";

const RegisterPage = ({ isAuthantecated }: { isAuthantecated: string }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<IUser>({
    username: "",
    email: "",
    password: "",
  });
  const [isUsername, setIsUsername] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setUser({ ...user, [name]: value });
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { username, email, password } = user;
    if (!username && !email && !password) {
      setIsUsername(true);
      setIsEmail(true);
      setIsPassword(true);
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
    setIsUsername(false);
    setIsEmail(false);
    setIsPassword(false);
    onSubmit();
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const { status, data: userData } = await axiosInstance.post(
        "/auth/local/register",
        user
      );
      const { status: statusMe, data: meData } = await axiosInstance.get(
        `/users/me?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      const date = new Date();
      const IN_DAYES = 5;
      const EXPIRES_IN_DAYES = date.getTime() + 1000 * 60 * 60 * 24 * IN_DAYES;
      date.setTime(EXPIRES_IN_DAYES);
      const options = {
        path: "/",
        expires: date,
      };
      cookieServices.set("jwt", userData.jwt, options);
      cookieServices.set("user", meData, options);
      if (status === 200 && statusMe === 200) {
        toast({
          title: "Register Successful",
          description: "Welcome back! You have account successfully.",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast({
        title: errorObj.response?.data.error.message,
        description:
          "Unable to log in. Please double-check your username, email and password and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthantecated) {
    history.back();
    return null;
  }

  return (
    <Flex
      minH={"calc(100vh - 128px)"}
      align={"center"}
      justify={"center"}
      bg={colorMode === "light" ? "gray.50" : "gray.800"}
    >
      <Stack
        spacing={6}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={{ base: "12px", sm: 8 }}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up to create account
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={colorMode === "light" ? "white" : "gray.700"}
          boxShadow={"lg"}
          p={{ base: "16px", sm: 6 }}
          as="form"
          onSubmit={submitHandler}
        >
          <Stack spacing={4}>
            <FormControl id="email">
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
            <FormControl id="email">
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
            <FormControl id="password">
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
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={"blue.400"}>Forgot password?</Text>
              </Stack>
              <Button
                bg={isEmail || isPassword ? "red.400" : "blue.400"}
                color={"white"}
                _hover={
                  isEmail || isPassword ? { bg: "red.500" } : { bg: "blue.500" }
                }
                type="submit"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Text
                  as={Link}
                  to={"/login"}
                  color={"blue.400"}
                  fontSize={"18px"}
                  fontWeight={"semibold"}
                >
                  Login
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default RegisterPage;
