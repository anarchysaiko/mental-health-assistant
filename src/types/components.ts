// 消息类型定义
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// 情绪类型定义
export interface EmotionEntry {
  id: string;
  date: Date;
  emotion: string;
  note?: string;
}

// 呼吸练习状态类型
export type BreathingState = 'idle' | 'inhale' | 'hold' | 'exhale';

// 呼吸练习配置类型
export interface BreathingConfig {
  inhaleDuration: number;
  holdDuration: number;
  exhaleDuration: number;
}

// 关键词回复映射类型
export interface KeywordResponseMap {
  [key: string]: string[];
}

// 情绪选项类型
export interface EmotionOption {
  emoji: string;
  label: string;
  color: string;
}

// 快速情绪选项类型
export interface QuickEmotionOption {
  id: string;
  label: string;
  text: string;
  color: string;
}

// 用户类型
export interface User {
  id: number;
  username: string;
  createdAt: Date;
}