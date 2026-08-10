import { useState, useEffect } from "react";

const CurrentDateTimeComponent: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date()); // cập nhật thời gian hiện tại mỗi giây
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, "0");
  const formatDate = (date: Date) => {
    const dd = formatTime(date.getDate());
    const mm = formatTime(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    const hh = formatTime(date.getHours());
    const min = formatTime(date.getMinutes());
    const ss = formatTime(date.getSeconds());
    return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
  };

  return <>{formatDate(now)}</>;
};

export default CurrentDateTimeComponent;
