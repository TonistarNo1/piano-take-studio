import type { Transition } from "framer-motion";

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0, 0, 1] as [number, number, number, number] } satisfies Transition,
};
