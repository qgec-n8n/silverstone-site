"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const AetherFlowHero = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 200,
    };

    class Particle {
      constructor(
        public x: number,
        public y: number,
        public directionX: number,
        public directionY: number,
        public size: number,
        public color: string,
      ) {}

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.directionX *= -1;
        if (this.y > canvas.height || this.y < 0) this.directionY *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 0.001);
          if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 5;
            this.y -= forceDirectionY * force * 5;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = Math.min(
        Math.floor((canvas.height * canvas.width) / 9000),
        240,
      );
      for (let i = 0; i < numberOfParticles; i += 1) {
        const size = Math.random() * 2 + 1;
        particles.push(
          new Particle(
            Math.random() * Math.max(canvas.width - size * 4, 1) + size * 2,
            Math.random() * Math.max(canvas.height - size * 4, 1) + size * 2,
            Math.random() * 0.4 - 0.2,
            Math.random() * 0.4 - 0.2,
            size,
            "rgba(191, 128, 255, 0.8)",
          ),
        );
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const connect = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const threshold = Math.min((width / 7) * (height / 7), 22000);
      for (let a = 0; a < particles.length; a += 1) {
        for (let b = a + 1; b < particles.length; b += 1) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq < threshold) {
            const opacityValue = Math.max(0, 1 - distanceSq / threshold);
            let nearPointer = false;
            if (mouse.x !== null && mouse.y !== null) {
              const mdx = particles[a].x - mouse.x;
              const mdy = particles[a].y - mouse.y;
              nearPointer = Math.sqrt(mdx * mdx + mdy * mdy) < mouse.radius;
            }
            ctx.strokeStyle = nearPointer
              ? `rgba(255,255,255,${opacityValue})`
              : `rgba(200,150,255,${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      particles.forEach((particle) => particle.update());
      connect();
    };

    const handleMouseMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", handleMouseMove);
    canvas.addEventListener("pointerleave", handleMouseOut);
    resizeCanvas();
    animate();

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", handleMouseMove);
      canvas.removeEventListener("pointerleave", handleMouseOut);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 + 0.5, duration: 0.8, ease: "easeInOut" },
    }),
  };

  return (
    <div className={cn("relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden")}> 
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 p-6 text-center">
        <motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 backdrop-blur-sm">
          <Zap className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-200">Dynamic Rendering Engine</span>
        </motion.div>
        <motion.h1 custom={1} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-5xl font-bold tracking-tighter text-transparent md:text-8xl">
          Aether Flow
        </motion.h1>
        <motion.p custom={2} variants={fadeUpVariants} initial="hidden" animate="visible" className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
          An intelligent, adaptive framework for creating fluid digital experiences that feel alive and respond to user interaction in real time.
        </motion.p>
        <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
          <button className="mx-auto flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-black shadow-lg transition-colors duration-300 hover:bg-gray-200">
            Explore the Engine <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AetherFlowHero;
