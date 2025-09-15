// src/components/AnimatedGlowText.tsx

import React from 'react';
import styles from '../styles/AnimatedGlowText.module.css';

interface AnimatedGlowTextProps {
  text: string;
}

const AnimatedGlowText: React.FC<AnimatedGlowTextProps> = ({ text }) => {
  return (
    <div className={styles.textContainer}>
      <h1 className={styles.animatedText}>{text}</h1>
    </div>
  );
};

export default AnimatedGlowText;