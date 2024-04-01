import { Box } from "@chakra-ui/react";
import HeroSection from "../layout/App/HeroSection";
import FeaturesSection from "../layout/App/FeaturesSection";
import CarouselSection from "../layout/App/CarouselSection";
import TestimonialsSection from "../layout/App/TestimonialsSection";

const HomePage = () => {
  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <CarouselSection typeData={"product"} />
      <CarouselSection typeData={"category"} />
      <TestimonialsSection />
    </Box>
  );
};

export default HomePage;
