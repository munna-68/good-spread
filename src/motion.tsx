import { motion, useSpring, useTransform, type MotionProps } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;

/* Fade-and-rise once the element scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  ...rest
}: { children: ReactNode; className?: string; delay?: number; y?: number } & MotionProps & Record<string, unknown>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const containerVariants = {
  off: {},
  on: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  off: { opacity: 0, y: 26 },
  on: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* Parent that staggers its <Item> children when scrolled into view. */
export function Stagger({ children, className, ...rest }: { children: ReactNode; className?: string } & MotionProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="off"
      whileInView="on"
      viewport={{ once: true, margin: '-70px 0px' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* Child of <Stagger>; renders as the same element/classes the design system expects. */
export function Item({
  children,
  className,
  as = 'div',
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'a' | 'article' | 'span' | 'h2' | 'p' | 'blockquote';
} & MotionProps & Record<string, unknown>) {
  const C = motion[as] as typeof motion.div;
  return (
    <C variants={itemVariants} className={className} {...rest}>
      {children}
    </C>
  );
}

/* Spring-tweened number that rolls between values. */
export function AnimatedNumber({
  value,
  format,
  className,
  stiffness = 170,
  damping = 26,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
  stiffness?: number;
  damping?: number;
}) {
  const spring = useSpring(value, { stiffness, damping });
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const text = useTransform(spring, (v) => (format ? format(v) : String(Math.round(v))));
  return <motion.span className={className}>{text}</motion.span>;
}
