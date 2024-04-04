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
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLogin, userLogin } from "../app/features/loginSlice";
import { AppDispatch } from "../app/store.";
import { IUser } from "../interfaces";

const LoginPage = ({ isAuthantecated }: { isAuthantecated: string }) => {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(selectLogin);

  const [user, setUser] = useState<IUser>({
    identifier: "",
    password: "",
  });
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setUser({ ...user, [name]: value });
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { identifier: email, password } = user;
    if (!email && !password) {
      setIsEmail(true);
      setIsPassword(true);
      return;
    }
    if (!email) {
      setIsEmail(true);
      return;
    }
    if (!password) {
      setIsPassword(true);
      return;
    }
    setIsEmail(false);
    setIsPassword(false);
    dispatch(userLogin(user));
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
            Sign in to your account
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
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={user.identifier}
                onChange={onChangeHandler}
                name="identifier"
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
                  Password is required!
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
                isLoading={loading}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
