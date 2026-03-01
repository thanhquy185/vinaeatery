import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  timeMs: number; // thời gian ban đầu tính bằng millisecond
  onChange?: (formatted: string, remainingMs: number) => void; // callback khi giá trị thay đổi
  onFinish?: () => void; // callback khi kết thúc
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeMs,
  onChange,
  onFinish,
}) => {
  const [remainingMs, setRemainingMs] = useState(timeMs);

  useEffect(() => {
    if (remainingMs <= 0) return;

    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - 1000 <= 0 ? 0 : prev - 1000;

        const hours = Math.floor(next / (1000 * 60 * 60));
        const minutes = Math.floor((next % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((next % (1000 * 60)) / 1000);
        const formatted = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        onChange?.(formatted, next);

        if (next === 0) {
          clearInterval(interval);
          onFinish?.();
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingMs, onChange, onFinish]);

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  return (
    <>
      {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
    </>
  );
};

export default CountdownTimer;
