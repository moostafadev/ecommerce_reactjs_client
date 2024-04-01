import { Box } from "@chakra-ui/react";
import HeroSection from "../layout/App/HeroSection";
import FeaturesSection from "../layout/App/FeaturesSection";
import CarouselSection from "../layout/App/CarouselSection";
import TestimonialsSection from "../layout/App/TestimonialsSection";
import CarouselSection_2 from "../layout/App/CarouselSection_2";

const HomePage = () => {
  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <CarouselSection_2 />
      <CarouselSection />
      <TestimonialsSection />
    </Box>
  );
};

export default HomePage;
