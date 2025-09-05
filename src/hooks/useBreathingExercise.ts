'use client'

import { useState, useEffect, useCallback } from 'react';
import { BreathingState, BreathingConfig } from '../types/components';
import { breathingConfig as defaultConfig } from '../data/responses';

export const useBreathingExercise = (config: BreathingConfig = defaultConfig) => {
  const [state, setState] = useState<BreathingState>('idle');
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [animationRef, setAnimationRef] = useState<HTMLDivElement | null>(null);

  // 重置练习
  const resetExercise = useCallback(() => {
    setState('idle');
    setProgress(0);
    setIsRunning(false);
    setCurrentCycle(0);
  }, []);

  // 开始练习
  const startExercise = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      setState('inhale');
      setProgress(0);
      setCurrentCycle(0);
    }
  }, [isRunning]);

  // 停止练习
  const stopExercise = useCallback(() => {
    resetExercise();
  }, [resetExercise]);

  // 处理呼吸状态变化
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isRunning && state !== 'idle') {
      let duration = 0;

      // 根据当前状态设置持续时间
      switch (state) {
        case 'inhale':
          duration = config.inhaleDuration;
          break;
        case 'hold':
          duration = config.holdDuration;
          break;
        case 'exhale':
          duration = config.exhaleDuration;
          break;
      }

      // 更新进度条
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (duration / 16));
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 16); // 约60fps

      // 定时切换状态
      timer = setTimeout(() => {
        setProgress(0);
        
        // 状态转换逻辑
        if (state === 'inhale') {
          setState('hold');
        } else if (state === 'hold') {
          setState('exhale');
        } else if (state === 'exhale') {
          setCurrentCycle(prev => {
            const newCycle = prev + 1;
            // 5个循环后结束练习
            if (newCycle >= 5) {
              resetExercise();
              return 0;
            } else {
              setState('inhale');
              return newCycle;
            }
          });
        }
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [isRunning, state, config, resetExercise]);

  // 获取当前状态的提示文本
  const getStateText = useCallback(() => {
    switch (state) {
      case 'idle':
        return '点击开始呼吸练习';
      case 'inhale':
        return '慢慢地吸气...';
      case 'hold':
        return '保持...';
      case 'exhale':
        return '缓缓地呼气...';
    }
  }, [state]);

  // 获取当前状态的动画样式
  const getAnimationStyle = useCallback(() => {
    if (state === 'idle') {
      return { transform: 'scale(1)', opacity: 0.8 };
    } else if (state === 'inhale') {
      return { transform: `scale(${1 + progress / 100 * 0.5})`, opacity: 1 };
    } else if (state === 'hold') {
      return { transform: 'scale(1.5)', opacity: 1 };
    } else if (state === 'exhale') {
      return { transform: `scale(${1.5 - progress / 100 * 0.5})`, opacity: 0.8 };
    }
    return {};
  }, [state, progress]);

  return {
    state,
    progress,
    isRunning,
    currentCycle,
    animationRef,
    setAnimationRef,
    startExercise,
    stopExercise,
    getStateText,
    getAnimationStyle
  };
};