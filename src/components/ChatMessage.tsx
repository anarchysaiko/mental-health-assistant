'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../types/components';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 打字机效果
  useEffect(() => {
    if (message.sender === 'assistant') {
      setIsTyping(true);
      let currentIndex = 0;
      const text = message.content;
      setDisplayedText('');

      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30); // 每个字符30ms

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(message.content);
    }
  }, [message]);

  // 消息容器样式
  // 使用条件样式而不是动态对象属性
  const containerDirection = message.sender === 'user' ? 'flex-row-reverse' : 'flex-row';
  const messageContainerStyle = {
    display: 'flex' as const,
    marginBottom: '1rem',
    alignItems: 'flex-start' as const
  };

  // 头像样式
  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: message.sender === 'user' ? '#818cf8' : '#c4b5fd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    margin: message.sender === 'user' ? '0 0 0 0.5rem' : '0 0.5rem 0 0'
  };

  // 消息气泡样式
  const bubbleStyle = {
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: '1.5rem',
    backgroundColor: message.sender === 'user' ? '#818cf8' : '#f3e8ff',
    color: message.sender === 'user' ? 'white' : '#4c1d95',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const
  };

  // 消息发送者头像文字
  const avatarText = message.sender === 'user' ? '我' : '助';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={messageContainerStyle}
      className={`${containerDirection} animate-fadeIn`}
    >
      <div style={avatarStyle}>
        {avatarText}
      </div>
      <div style={bubbleStyle} className="relative">
        {displayedText}
        {isTyping && isLast && (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="ml-1 inline-block w-1 h-4 bg-current rounded-full"
          />
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;