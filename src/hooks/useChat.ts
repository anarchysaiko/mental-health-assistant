"use client";

import { useState, useEffect, useRef } from "react";
import { Message } from "../types/components";
import { keywordResponses, keywordPatterns } from "../data/responses";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showMindfulnessTip, setShowMindfulnessTip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 随机显示正念提醒
  useEffect(() => {
    const mindfulnessInterval = setInterval(() => {
      setShowMindfulnessTip(true);
      setTimeout(() => setShowMindfulnessTip(false), 8000); // 8秒后自动隐藏
    }, 300000); // 每5分钟显示一次

    return () => clearInterval(mindfulnessInterval);
  }, []);

  // 根据用户输入获取回复
  const getAssistantResponse = async (
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<string> => {
    try {
      // 调用通义千问 API
      const response = await fetch("/api/qwen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `API 请求失败: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        return data.message;
      } else {
        // 如果 API 调用失败，使用降级方案
        throw new Error("API 返回失败");
      }
    } catch (error) {
      console.error("调用通义千问 API 时出错:", error);

      // 降级方案：使用原有的关键词匹配逻辑
      for (const [category, pattern] of Object.entries(keywordPatterns)) {
        if (pattern.test(userMessage)) {
          const responses =
            keywordResponses[category as keyof typeof keywordResponses];
          if (responses && responses.length > 0) {
            return responses[Math.floor(Math.random() * responses.length)];
          }
        }
      }

      // 如果没有匹配的关键词，返回一般回复
      const generalResponses = keywordResponses.general;
      return generalResponses[
        Math.floor(Math.random() * generalResponses.length)
      ];
    }
  };

  // 添加用户消息
  const addUserMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    // 获取当前对话历史（排除最新的用户消息）
    const conversationHistory = messages.slice();

    try {
      const response = await getAssistantResponse(content, conversationHistory);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    } catch (error) {
      console.error("获取助手回复时出错:", error);
      setIsThinking(false);
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      await addUserMessage(inputValue.trim());
    }
  };

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 设置输入框内容
  const setInputText = (text: string) => {
    setInputValue(text);
  };

  return {
    messages,
    inputValue,
    isThinking,
    showMindfulnessTip,
    messagesEndRef,
    handleSendMessage,
    handleKeyPress,
    setInputText,
  };
};
