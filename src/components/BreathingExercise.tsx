"use client";

import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useBreathingExercise } from "../hooks/useBreathingExercise";

const BreathingExercise: React.FC = () => {
  const {
    progress,
    isRunning,
    setAnimationRef,
    startExercise,
    stopExercise,
    getStateText,
    getAnimationStyle,
  } = useBreathingExercise();

  // 呼吸指示器样式 - 减小尺寸避免遮挡
  const breathingIndicatorStyle = {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    backgroundColor: "#e0e7ff",
    border: "6px solid #818cf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    overflow: "hidden",
  };

  // 内部圆样式
  const innerCircleStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    border: "2px solid #bfdbfe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    zIndex: 10,
  };

  // 水位进度条样式 - 从底部向上填充
  const waterLevelStyle = {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    width: "100%",
    height: `${progress}%`,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    backgroundImage: "linear-gradient(to top, rgba(139, 92, 246, 0.6), rgba(139, 92, 246, 0.2))",
    transition: "height 0.016s linear",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-indigo-800 mb-8">
        4-7-8 呼吸练习
      </h3>

      <div className="relative mb-10 py-4">
        <motion.div
          ref={(el) => setAnimationRef(el)}
          style={breathingIndicatorStyle}
          animate={getAnimationStyle()}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="transition-all duration-300"
        >
          <div style={waterLevelStyle} />
          <div style={innerCircleStyle}>
            <p className="text-center text-lg font-medium text-indigo-700">
              {getStateText()}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4">
        {!isRunning ? (
          <Button
            onClick={startExercise}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-full"
          >
            开始练习
          </Button>
        ) : (
          <Button
            onClick={stopExercise}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-2 rounded-full"
          >
            停止练习
          </Button>
        )}
      </div>

      <div className="mt-8 text-center">
        <h4 className="text-md font-medium text-indigo-700 mb-2">
          呼吸练习的好处：
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 缓解焦虑和压力</li>
          <li>• 改善睡眠质量</li>
          <li>• 降低心率和血压</li>
          <li>• 提升专注力和正念</li>
        </ul>
      </div>
    </div>
  );
};

export default BreathingExercise;
