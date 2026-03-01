import { type FC, useEffect, useState } from "react";
import { Card, Button, Typography, Avatar, Space } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import CustomModal from "../../components/common/modal";
import QrScanner from "../../components/common/qr-scanner";
import { useModal } from "../../hook/use-modal";
import dayjs from "dayjs";

// const { Title, Text } = Typography;

type AttendanceStatus = "WAITING" | "SCANNING" | "COMPLETED";

const AttendanceMachinePage: FC = () => {
  const [currentTime, setCurrentTime] = useState(
    dayjs().format("DD/MM/YYYY HH:mm:ss"),
  );
  const [status, setStatus] = useState<AttendanceStatus>("WAITING");
  const [employee, setEmployee] = useState<any>(null);

  // realtime clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("DD/MM/YYYY HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  //
  const handleScanSuccess = async (token: string) => {
    setStatus("COMPLETED");
    setEmployee({
      name: "Nguyễn Văn A",
      code: "EMP001",
      department: "IT",
      position: "Frontend Developer",
      avatar: "https://i.pravatar.cc/150?img=3",
      shift: "08:00 - 17:00",
    });
    openModal({
      title: "",
      className: "header-hide",
      children: <HandleScanQr status={"ALREADY_COMPLETED"} />,
    });
  };

  //
  const { modal, openModal, closeModal } = useModal();
  const HandleScanQr = ({
    employee,
    shift,
    attendance,
    status,
    onConfirmEarlyCheckout,
  }: any) => {
    console.log(status);
    const now = dayjs().format("HH:mm:ss");

    const isEarly =
      attendance?.checkIn &&
      !attendance?.checkOut &&
      dayjs().isBefore(
        dayjs(`${dayjs().format("YYYY-MM-DD")} ${shift.endTime}`),
      );

    return (
      <>
        {/* ===== EMPLOYEE INFO ===== */}
        <div style={{ textAlign: "center" }}>
          <Avatar size={90} src={employee?.avatar} />
          <h2 style={{ marginTop: 12 }}>{employee?.name}</h2>
          <p>Mã nhân viên: {employee?.code}</p>
          <p>Phòng ban: {employee?.department}</p>
          <p>Chức vụ: {employee?.position}</p>
        </div>
        {/* ===== SHIFT INFO ===== */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            background: "#f5f5f5",
          }}
        >
          <h3 style={{ marginBottom: 8 }}>Ca làm hôm nay</h3>
          <p>
            {shift?.name}: {shift?.startTime} - {shift?.endTime}
          </p>
          <p>Thời điểm quét: {now}</p>
        </div>
        {/* ===== CASE 1: CHECK-IN SUCCESS ===== */}
        {status === "CHECKED_IN" && (
          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "#52c41a",
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 32 }} />
            <p style={{ marginTop: 8 }}>Vào ca lúc {attendance?.checkIn}</p>
          </div>
        )}
        {/* ===== CASE 2: SCAN AGAIN BEFORE END SHIFT ===== */}
        {status === "NEED_CONFIRM_EARLY_CHECKOUT" && isEarly && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              background: "#fff7e6",
              textAlign: "center",
            }}
          >
            <p style={{ fontWeight: 600 }}>
              Bạn đang rời ca sớm hơn thời gian quy định.
            </p>
            <p>Ca kết thúc lúc {shift?.endTime}</p>

            <Button
              type="primary"
              danger
              style={{ marginTop: 12 }}
              onClick={onConfirmEarlyCheckout}
            >
              XÁC NHẬN KẾT THÚC CA
            </Button>
          </div>
        )}
        {/* ===== CASE 3: NORMAL CHECK-OUT ===== */}
        {status === "COMPLETED" && (
          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "#52c41a",
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 32 }} />
            <p style={{ marginTop: 8 }}>
              Hoàn thành ca lúc {attendance?.checkOut}
            </p>
          </div>
        )}
        {/* ===== CASE 4: ALREADY COMPLETED ===== */}
        {status === "ALREADY_COMPLETED" && (
          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "#999",
            }}
          >
            <p>Ca làm hôm nay đã hoàn tất.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="attendance-machine">
        <div className="attendance-machine__header">
          <h1>HỆ THỐNG CHẤM CÔNG</h1>
          <p>{currentTime}</p>
        </div>
        <div className="attendance-machine__body">
          <Card variant="borderless" className="has-qr-scanner">
            <p>Vui lòng quét mã QR</p>
            <QrScanner openScanner={false} onSuccess={handleScanSuccess} />
          </Card>
        </div>
      </div>
      {modal.open && (
        <CustomModal
          title={modal.title}
          open={modal.open}
          width={modal.width}
          className={modal.className}
          children={modal.children}
          setCloseModal={() => closeModal()}
        />
      )}
    </>
  );
};

export default AttendanceMachinePage;
