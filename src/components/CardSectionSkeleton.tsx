import { Box, Skeleton, SkeletonText, useColorMode } from "@chakra-ui/react";

const CardSectionSkeleton = () => {
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Box mb={"30px"}>
        <Skeleton
          mt="4"
          noOfLines={1}
          w={"150px"}
          mx={"auto"}
          h={"30px"}
          rounded={"lg"}
        />
        <SkeletonText
          mt="4"
          noOfLines={1}
          spacing="4"
          w={"200px"}
          mx={"auto"}
        />
      </Box>
      <Box
        maxW={{ sm: "500px", md: "600px", lg: "850px" }}
        display={"grid"}
        gridTemplateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
        rounded="lg"
        mx={"auto"}
        alignItems={"center"}
        height={{ lg: "300px" }}
        border={colorMode === "light" ? "1px solid #ddd" : "1px solid #2d3748"}
      >
        <Skeleton height={{ base: "300px", lg: "300px" }} rounded={"md"} />

        <Box padding={"16px"}>
          <SkeletonText mt="4" w={20} noOfLines={1} spacing="4" mx={"auto"} />
          <SkeletonText mt="4" noOfLines={1} spacing="4" />
          <SkeletonText mt="4" noOfLines={1} spacing="4" />
          <SkeletonText mt="4" noOfLines={1} spacing="4" />
          <Skeleton mt="4" h={50} rounded={"lg"} />
        </Box>
      </Box>
    </Box>
  );
};

export default CardSectionSkeleton;
