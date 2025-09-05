'use client'

import { useState, useEffect } from 'react';
import { EmotionEntry } from '../types/components';
import { emotionOptions } from '../data/responses';

export const useEmotionJournal = () => {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionNote, setEmotionNote] = useState<string>('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  // 从本地存储加载情绪日记
  useEffect(() => {
    const savedEntries = localStorage.getItem('emotionEntries');
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries).map((entry: EmotionEntry) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setEntries(parsedEntries);
      } catch (error) {
        console.error('Failed to load emotion entries:', error);
      }
    }
  }, []);

  // 保存情绪日记到本地存储
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('emotionEntries', JSON.stringify(entries));
    }
  }, [entries]);

  // 添加新的情绪记录
  const addEmotionEntry = () => {
    if (!selectedEmotion) return;

    const newEntry: EmotionEntry = {
      id: `emotion-${Date.now()}`,
      date: new Date(),
      emotion: selectedEmotion,
      note: emotionNote.trim() || undefined
    };

    setEntries(prev => {
      // 检查是否已经有当天的记录
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingEntryIndex = prev.findIndex(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });

      if (existingEntryIndex >= 0) {
        // 更新当天的记录
        const updatedEntries = [...prev];
        updatedEntries[existingEntryIndex] = newEntry;
        return updatedEntries;
      } else {
        // 添加新记录
        return [...prev, newEntry];
      }
    });

    // 重置表单
    setSelectedEmotion('');
    setEmotionNote('');
    setIsAddingEntry(false);
  };

  // 获取最近7天的情绪记录
  const getRecentEmotions = () => {
    const recentEntries: (EmotionEntry | null)[] = [];
    const today = new Date();

    // 生成最近7天的日期
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // 查找当天的情绪记录
      const entry = entries.find(e => {
        const entryDate = new Date(e.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      recentEntries.push(entry || null);
    }

    return recentEntries;
  };

  // 获取情绪对应的emoji
  const getEmotionEmoji = (emotionLabel: string) => {
    const option = emotionOptions.find(opt => opt.label === emotionLabel);
    return option ? option.emoji : '😐';
  };

  // 获取情绪对应的颜色
  const getEmotionColor = (emotionLabel: string) => {
    const option = emotionOptions.find(opt => opt.label === emotionLabel);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  return {
    entries,
    selectedEmotion,
    emotionNote,
    isAddingEntry,
    setSelectedEmotion,
    setEmotionNote,
    setIsAddingEntry,
    addEmotionEntry,
    getRecentEmotions,
    getEmotionEmoji,
    getEmotionColor
  };
};