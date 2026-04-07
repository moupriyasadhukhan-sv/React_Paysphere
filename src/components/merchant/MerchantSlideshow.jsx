import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slideshow1 from "../../assets/slideshow1.png";
import slideshow2 from "../../assets/slideshow2.png";
import slideshow3 from "../../assets/slideshow3.png";

// Merchant success stories with slideshow images
const MERCHANT_SLIDES = [
  {
    id: 1,
    title: "Premium Merchants",
    merchant: "Featured Partners",
    image: slideshow1,
    stats: "₹2.5M monthly",
    color: "from-blue-600 to-purple-600",
  },
  {
    id: 2,
    title: "Growth Champions",
    merchant: "Success Stories",
    image: slideshow2,
    stats: "₹5.2M monthly",
    color: "from-green-600 to-teal-600",
  },
  {
    id: 3,
    title: "Digital Leaders",
    merchant: "Top Performers",
    image: slideshow3,
    stats: "₹3.8M monthly",
    color: "from-amber-600 to-orange-600",
  },
];

const MerchantSlideshow = ({ autoPlay = true, interval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-play slides
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % MERCHANT_SLIDES.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentSlide(
      (prev) => (prev + newDirection + MERCHANT_SLIDES.length) % MERCHANT_SLIDES.length
    );
  };

  const slide = MERCHANT_SLIDES[currentSlide];

  return (
    <div className="relative w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          drag="x"
          dragElastic={0.2}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Dark Overlay Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-40`} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative h-full flex flex-col justify-between p-6 text-white z-10"
          >
            {/* Top section */}
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm font-semibold tracking-widest text-cyan-300 uppercase"
              >
                Success Story
              </motion.h3>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold mt-2"
              >
                {slide.title}
              </motion.h2>
            </div>

            {/* Bottom section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <p className="text-lg font-semibold">{slide.merchant}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-emerald-400 font-semibold">{slide.stats}</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all duration-300 border border-white/20"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all duration-300 border border-white/20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {MERCHANT_SLIDES.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setDirection(idx > currentSlide ? 1 : -1);
              setCurrentSlide(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide
                ? "w-8 bg-cyan-400"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default MerchantSlideshow;
