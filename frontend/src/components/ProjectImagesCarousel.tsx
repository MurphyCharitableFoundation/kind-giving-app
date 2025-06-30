import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Box } from "@mui/material";
import projectImage from "../assets/images/project-image-sample.png";

const ImageCarousel: React.FC = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "auto" }}>
      <Swiper
        slidesPerView={1.2}
        spaceBetween={8}
        modules={[Navigation, Pagination]}
      >
        {[1, 2, 3].map((index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                width: "100%",
                height: 221,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "28px",
                overflow: "hidden",
              }}
            >
              <img
                src={projectImage}
                alt={`Slide ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ImageCarousel;
