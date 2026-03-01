import { useEffect, useState } from "react";

//
export function useElapsedTime(startTimeStr: string) {
  const [elapsed, setElapsed] = useState({ text: "", seconds: 0 });

  useEffect(() => {
    const startTime = new Date(startTimeStr).getTime();

    const update = () => {
      const now = Date.now();
      const seconds = Math.floor((now - startTime) / 1000);
      setElapsed({ text: formatTime(seconds), seconds });
    };

    const formatTime = (seconds: number) => {
      const s = seconds % 60;
      const m = Math.floor(seconds / 60) % 60;
      const h = Math.floor(seconds / 3600) % 24;
      const d = Math.floor(seconds / 86400);

      if (d > 0) return `${d} ngày ${h} giờ ${m} phút ${s} giây`;
      if (h > 0) return `${h} giờ ${m} phút ${s} giây`;
      if (m > 0) return `${m} phút ${s} giây`;
      return `${s} giây`;
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTimeStr]);

  return elapsed;
}

//
export function getElapsedTimeText(
  orderTimeStr: string,
  authorizedTimeStr: string
): {
  text: string;
  seconds: number;
  abc: string;
} {
  const start = new Date(orderTimeStr).getTime();
  const end = new Date(authorizedTimeStr).getTime();
  const seconds = Math.floor((end - start) / 1000);

  const s = seconds % 60;
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600) % 24;
  const d = Math.floor(seconds / 86400);

  let text = "";
  if (d > 0) text = `${d} ngày ${h} giờ ${m} phút ${s} giây`;
  else if (h > 0) text = `${h} giờ ${m} phút ${s} giây`;
  else if (m > 0) text = `${m} phút ${s} giây`;
  else text = `${s} giây`;

  return { text, seconds, abc: "123" };
}
