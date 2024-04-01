import { Box, Skeleton, SkeletonText, useColorMode } from "@chakra-ui/react";

const ProductPageSkeleton = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      padding="10px"
      boxShadow="lg"
      bg="transparent"
      rounded={"lg"}
      border={colorMode === "light" ? "1px solid #ddd" : "1px solid #2d3748"}
      height={"100%"}
      display={"grid"}
      gridTemplateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
      gap={"16px"}
    >
      <Box
        display={"grid"}
        gridTemplateColumns={"repeat(1, 1fr)"}
        gridTemplateRows={"1fr 150px"}
        gap={"16px"}
      >
        <Skeleton rounded={"md"} />
        <Box
          display={"grid"}
          gridTemplateColumns={"repeat(4, 1fr)"}
          gap={"16px"}
        >
          <Skeleton rounded={"md"} />
          <Skeleton rounded={"md"} />
          <Skeleton rounded={"md"} />
          <Skeleton rounded={"md"} />
        </Box>
      </Box>
      <Box>
        <SkeletonText mt="4" w={20} noOfLines={1} spacing="4" />
        <SkeletonText mt="4" noOfLines={1} spacing="4" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <SkeletonText mt="4" noOfLines={1} spacing="4" />
        <SkeletonText mt="4" noOfLines={1} spacing="4" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <SkeletonText mt="4" noOfLines={1} spacing="4" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <SkeletonText mt="4" noOfLines={1} spacing="4" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <Skeleton mt="4" h={50} rounded={"md"} />
      </Box>
    </Box>
  );
};

export default ProductPageSkeleton;
