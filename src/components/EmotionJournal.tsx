'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useEmotionJournal } from '../hooks/useEmotionJournal';
import { emotionOptions } from '../data/responses';

const EmotionJournal: React.FC = () => {
  const {
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
  } = useEmotionJournal();

  const recentEmotions = getRecentEmotions();
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // 获取日期的格式化显示
  const formatDate = (date: Date) => {
    const now = new Date();
    const entryDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    
    return `${entryDate.getMonth() + 1}/${entryDate.getDate()}`;
  };

  // 获取最近7天的日期标签
  const getDayLabels = () => {
    const labels: string[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // 仅显示月/日格式
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    
    return labels;
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-indigo-800 mb-4">情绪日记</h3>
      
      {/* 添加新情绪记录 */}
      <div className="mb-6">
        {!isAddingEntry ? (
          <Button 
            onClick={() => setIsAddingEntry(true)} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            记录今日情绪
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {emotionOptions.map((option) => (
                <motion.button
                  key={option.label}
                  onClick={() => setSelectedEmotion(option.label)}
                  className={`py-2 rounded-lg flex flex-col items-center justify-center ${selectedEmotion === option.label ? 'ring-2 ring-purple-500' : option.color}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
            <Input
              placeholder="添加一些笔记（可选）"
              value={emotionNote}
              onChange={(e) => setEmotionNote(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button 
                onClick={addEmotionEntry} 
                disabled={!selectedEmotion}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                保存
              </Button>
              <Button 
                onClick={() => {
                  setIsAddingEntry(false);
                  setSelectedEmotion('');
                  setEmotionNote('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                取消
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 最近7天情绪图表 */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-indigo-700 mb-3">最近7天情绪</h4>
        <div className="h-40 flex items-end justify-between px-2">
          {recentEmotions.map((entry, index) => {
            const hasEntry = entry !== null;
            return (
              <motion.div key={index} className="flex flex-col items-center">
                <motion.div
                  className={`w-10 rounded-t-lg ${hasEntry ? getEmotionColor(entry.emotion) : 'bg-gray-200'}`}
                  initial={{ height: 0 }}
                  animate={{ height: hasEntry ? 100 + Math.random() * 50 : 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
                <div className="mt-2 text-xs text-gray-500">
                  {getDayLabels()[index]}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 情绪历史记录 */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-md font-medium text-indigo-700 mb-3">情绪历史</h4>
        {entries.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            还没有情绪记录，开始记录您的情绪吧！
          </p>
        ) : (
          <div className="space-y-3">
            {entries
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((entry) => (
                <motion.div
                  key={entry.id}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getEmotionEmoji(entry.emotion)}</span>
                      <span className="font-medium text-indigo-700">{entry.emotion}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(entry.date)}</span>
                  </div>
                  {expandedEntry === entry.id && entry.note && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 text-sm text-gray-600 pl-8"
                    >
                      {entry.note}
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionJournal;