import { Variants } from 'framer-motion';

export const swipeRevealVariants: Variants = {
  hidden: {
    x: '0%',
    scaleX: 1,
  },
  // `custom` will determine direction: 0 = left overlay (move left), 1 = right overlay (move right)
  visible: (custom: number = 0) => ({
    x: custom === 1 ? ['0%', '100%'] : ['0%', '-100%'],
    scaleX: 1,
    transition: {
      x: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // easeOutQuint
      }
    }
  })
};

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const sequentialFadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 8
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};