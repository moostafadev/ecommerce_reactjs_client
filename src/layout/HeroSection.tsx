import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";

const HeroSection = () => {
  return (
    <>
      <Container maxW={"4xl"} h={`calc(100vh - 64px)`}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 32, md: 28 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            The latest smartphone model <br />
            <Text as={"span"} color={"green.400"}>
              and popular electronic.
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Discover cutting-edge electronics and mobile devices that redefine
            the way you live, work, and play. From sleek smartphones to powerful
            laptops, we have everything you need to stay connected and
            productive.
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              px={6}
              _hover={{
                bg: "green.500",
              }}
            >
              Get Started
            </Button>
            <Button variant={"link"} colorScheme={"blue"} size={"sm"}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default HeroSection;
