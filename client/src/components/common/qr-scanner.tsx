import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  openScanner?: boolean;
  onSuccess?: (token: string) => Promise<void>;
}

const QrScanner: React.FC<QrScannerProps> = ({ openScanner, onSuccess }) => {
  const containerId = "qr-scanner-camera";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!openScanner) {
      stopScanner();
      return;
    }

    const startScanner = async () => {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 400 },
          async (decodedText) => {
            try {
              setLoading(true);

              // // stop sau khi quét thành công
              // await scanner.stop();

              await onSuccess?.(decodedText);
            } finally {
              setLoading(false);
            }
          },
          () => {},
        );
      } catch (err) {
        console.error("Scanner start error:", err);
      }
    };

    const timer = setTimeout(startScanner, 0);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [openScanner]);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .catch(() => {})
        .finally(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        });
    }
  };

  return (
    <div className="qr-scanner">
      {loading ? (
        <div className="loading">
          <Spin indicator={<LoadingOutlined spin />} />
          <p>Đang xử lý...</p>
        </div>
      ) : (
        <div id={containerId} />
      )}
    </div>
  );
};

export default QrScanner;
