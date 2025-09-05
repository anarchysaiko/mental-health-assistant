'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useChat } from '../hooks/useChat';
import { quickEmotionOptions, mindfulnessReminders } from '../data/responses';
import ChatMessage from './ChatMessage';
import BreathingExercise from './BreathingExercise';
import EmotionJournal from './EmotionJournal';

const HomeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'breathing' | 'journal'>('chat');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { 
    messages, 
    inputValue, 
    isThinking, 
    showMindfulnessTip, 
    messagesEndRef, 
    handleSendMessage, 
    handleKeyPress, 
    setInputText 
  } = useChat();

  // 获取随机正念提醒
  const getRandomMindfulnessTip = () => {
    return mindfulnessReminders[Math.floor(Math.random() * mindfulnessReminders.length)];
  };

  // 渲染当前的正念提醒
  const randomMindfulnessTip = getRandomMindfulnessTip();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* 呼吸背景动画 */}
      <motion.div 
        className="fixed inset-0 -z-10" 
        animate={{ 
          background: [
            'linear-gradient(135deg, rgba(165, 180, 252, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            'linear-gradient(135deg, rgba(165, 180, 252, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
            'linear-gradient(135deg, rgba(165, 180, 252, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
          ]
        }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
      />

      {/* 顶部标题区域 */}
      <header className="w-full py-6 px-4 md:px-8 bg-white bg-opacity-80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            心灵守护者 - 您的情绪陪伴助手
          </h1>
          <p className="text-center text-gray-600 mt-2">
            在这里，每一份情绪都值得被倾听
          </p>
        </div>
      </header>

      {/* 移动设备侧边栏按钮 */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
        >
          <span className="text-white text-xl">☰</span>
        </Button>
      </div>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* 桌面侧边栏 */}
        <aside className="hidden md:block w-72 shrink-0">
          <div className="sticky top-6 space-y-6">
            {/* 功能选项卡 */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-indigo-50">
                <h2 className="font-medium text-indigo-800">功能菜单</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                >
                  <span className="text-lg">💬</span>
                  <span>心理对话</span>
                </button>
                <button
                  onClick={() => setActiveTab('breathing')}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${activeTab === 'breathing' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                >
                  <span className="text-lg">🧘</span>
                  <span>呼吸练习</span>
                </button>
                <button
                  onClick={() => setActiveTab('journal')}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${activeTab === 'journal' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                >
                  <span className="text-lg">📝</span>
                  <span>情绪日记</span>
                </button>
              </div>
            </Card>

            {/* 预设快速选项（仅在聊天选项卡显示） */}
            {activeTab === 'chat' && (
              <Card>
                <div className="p-4 border-b border-gray-100 bg-indigo-50">
                  <h2 className="font-medium text-indigo-800">快速表达</h2>
                </div>
                <div className="p-3 space-y-2">
                  {quickEmotionOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => setInputText(option.text)}
                      className={`w-full py-2 px-3 rounded-lg text-left text-gray-800 ${option.color} hover:opacity-90 transition-opacity`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </aside>

        {/* 主内容区域 */}
        <div className="flex-1">
          {activeTab === 'chat' ? (
            <Card className="h-[calc(100vh-14rem)] md:h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-indigo-50">
                <h2 className="font-medium text-indigo-800">心灵对话</h2>
              </div>
              
              {/* 聊天消息区域 */}
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <div className="text-5xl mb-4">💭</div>
                    <h3 className="text-lg font-medium mb-2">开始您的心灵对话</h3>
                    <p className="max-w-md">
                      分享您的感受，我会认真倾听并给予温暖的回应
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <ChatMessage 
                        key={message.id} 
                        message={message} 
                        isLast={index === messages.length - 1 && message.sender === 'assistant'}
                      />
                    ))}
                    {isThinking && (
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 mr-2">
                          助
                        </div>
                        <Badge className="animate-pulse bg-purple-100 text-purple-800">
                          助手正在思考...
                        </Badge>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* 输入区域 */}
              <div className="p-4 border-t border-gray-100">
                <Textarea
                  placeholder="分享您的感受或问题..."
                  value={inputValue}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full resize-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    发送
                  </Button>
                </div>
              </div>
            </Card>
          ) : activeTab === 'breathing' ? (
            <BreathingExercise />
          ) : (
            <Card className="h-[calc(100vh-14rem)] md:h-[calc(100vh-8rem)] overflow-hidden">
              <EmotionJournal />
            </Card>
          )}
        </div>
      </main>

      {/* 移动端侧边栏 */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="absolute top-0 right-0 bottom-0 w-64 bg-white p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium text-indigo-800">功能菜单</h2>
                <Button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="h-8 w-8 p-0 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                >
                  <span className="text-lg">💬</span>
                  <span>心理对话</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('breathing');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors ${activeTab === 'breathing' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                >
                  <span className="text-lg">🧘</span>
                  <span>呼吸练习</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('journal');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors ${activeTab === 'journal' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                >
                  <span className="text-lg">📝</span>
                  <span>情绪日记</span>
                </button>
              </div>

              {/* 移动端快速选项 */}
              {activeTab === 'chat' && (
                <div className="mt-6">
                  <h3 className="font-medium text-indigo-800 mb-3">快速表达</h3>
                  <div className="space-y-2">
                    {quickEmotionOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        onClick={() => {
                          setInputText(option.text);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full py-2 px-3 rounded-lg text-left text-gray-800 ${option.color} hover:opacity-90 transition-opacity`}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 正念提醒 */}
      <AnimatePresence>
        {showMindfulnessTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-3 max-w-md text-center"
          >
            <span className="text-xl">✨</span>
            <p className="text-indigo-800 font-medium">
              {randomMindfulnessTip}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 页脚 */}
      <footer className="w-full py-4 px-4 md:px-8 text-center text-sm text-gray-500">
        <p>记住：您并不孤单，每一份情绪都值得被倾听。</p>
      </footer>
    </div>
  );
};

export default HomeView;