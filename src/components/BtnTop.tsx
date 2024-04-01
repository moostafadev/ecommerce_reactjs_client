import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

const BtnTop = () => {
  const [scrollPosition, setScrollPosition] = useState(-100);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY > 500 ? 5 : -100;
      setScrollPosition(position);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Button
      as={"a"}
      href={"#"}
      position={"fixed"}
      bottom={"20px"}
      right={scrollPosition}
      zIndex={100}
      colorScheme={"green"}
      bg={"green.400"}
      rounded={"lg"}
      _hover={{
        bg: "green.500",
      }}
      transition={".3s"}
      px={"0"}
    >
      <MdOutlineKeyboardDoubleArrowUp fontSize={"24px"} />
    </Button>
  );
};

export default BtnTop;
