import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TransitionImage from "../../assets/transition_image.png";
 
/**
 * PAGE TRANSITION COMPONENT
 * Shows animated globe with rupee notes floating in background
 */
export default function PageTransition({ isTransitioning, onComplete }) {
  const [showTransition, setShowTransition] = useState(false);
 
  useEffect(() => {
    if (isTransitioning) {
      setShowTransition(true);
      // Keep showing for 0.4 second, then callback
      const timer = setTimeout(() => {
        setShowTransition(false);
        onComplete?.();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, onComplete]);
 
  // Generate random rupee notes positions
  const rupeeNotes = [...Array(15)].map((_, i) => ({
    id: i,
    initialX: Math.random() * 100 - 50,
    initialY: Math.random() * 100 - 50,
    delay: Math.random() * 0.3,
    duration: 2.2 + Math.random() * 1.2,
    scale: 0.25 + Math.random() * 0.5,
  }));
 
  return (
    <AnimatePresence>
      {showTransition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden"
          style={{
            // Deepened the gradient opacity so nothing bleeds through from the app background
            background: "linear-gradient(145deg, rgba(10, 14, 23, 0.95) 0%, rgba(15, 20, 31, 0.95) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Animated Rupee Notes Background */}
          {rupeeNotes.map((note) => (
            <motion.div
              key={note.id}
              className="absolute text-5xl font-bold"
              initial={{
                x: note.initialX * 60,
                y: note.initialY * 60 + 250,
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: note.initialX * 240,
                y: note.initialY * 240 - 350,
                opacity: [0, 0.7, 0],
                scale: note.scale,
                rotate: [0, 360]
              }}
              transition={{
                duration: note.duration,
                delay: note.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
              style={{
                color: "rgba(13, 237, 163, 0.5)",
                textShadow: "0 0 30px rgba(63, 163, 130, 0.6), 0 0 60px rgba(16, 185, 129, 0.3)",
                fontWeight: "900",
                filter: "drop-shadow(0 0 20px rgba(40, 169, 126, 0.5))",
              }}
            >
              ₹
            </motion.div>
          ))}
 
          {/* Main Transition Image Container - Center Focus */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 10 }}
            exit={{ scale: 1.3, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Transition Image - Main Focus with Rotation */}
            {/* Reduced w-56 to w-28, h-56 to h-28, halved box-shadow values, and halved border width */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 1.8, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                boxShadow: "0 0 35px rgb(56, 220, 141), inset 0 0 25px rgb(144, 225, 210), 0 4px 16px rgb(230, 180, 14)",
                filter: "drop-shadow(0 0 20px rgb(97, 191, 201))",
              }}
              className="w-28 h-28 flex items-center justify-center rounded-full bg-[#0B1121] border border-emerald-400/50 overflow-hidden relative z-10"
            >
              <img
                src={TransitionImage}
                alt="PaySphere Transition"
                className="w-[6.5rem] h-[6.5rem] object-cover rounded-full"
                style={{
                  filter: "drop-shadow(0 0 12.5px rgba(71, 237, 182, 0.7))",
                }}
              />
            </motion.div>
 
            {/* Primary Glow Aura */}
            {/* Halved width and height from 240px to 120px, and halved shadow spread */}
            <motion.div
              className="absolute inset-0 rounded-full z-0"
              animate={{
                boxShadow: [
                  "0 0 25px rgba(113, 240, 225, 0.7)",
                  "0 0 50px rgba(79, 139, 67, 0.4)",
                  "0 0 25px rgba(46, 209, 155, 0.7)",
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "120px",
                height: "120px",
              }}
            />
          </motion.div>
 
          {/* Loading Text */}
          <motion.div
            className="absolute bottom-16 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <p className="text-emerald-400 font-bold text-lg tracking-widest uppercase" style={{ textShadow: "0 0 20px rgba(16, 185, 129, 0.8)" }}>
              Processing...
            </p>
            <motion.div
              className="mt-5 flex gap-3 justify-center"
              initial="hidden"
              animate="visible"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.12,
                  }}
                  style={{
                    background: "linear-gradient(135deg, #10b981, #06b6d4)",
                    boxShadow: "0 0 15px rgba(100, 222, 181, 0.8)",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
 