import type { FC } from "react";
import { Collapse, Typography } from "antd";

const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;

// Filter Explain
const FilterExplain: FC = ({}) => {
  return (
    <>
      <Title level={4}>Cách hệ thống tính lương</Title>
      <Paragraph type="secondary">
        Mức lương của nhân viên được xác định dựa trên các quy tắc sau, không
        phụ thuộc vào kết quả cụ thể của từng tháng.
      </Paragraph>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Bước 1: Xác định hình thức lương" key="1">
          <Paragraph style={{ marginBottom: 0 }}>
            Hệ thống kiểm tra <Text strong>lịch sử chức vụ</Text> và{" "}
            <Text strong>chính sách lương</Text> để xác định hình thức áp dụng:
          </Paragraph>
          <ul>
            <li>
              <Text strong>- Lương cố định</Text>: áp dụng cho quản lý, thu ngân
            </li>
            <li>
              <Text strong>- Lương theo giờ</Text>: áp dụng cho phục vụ, thời vụ
            </li>
          </ul>
        </Panel>
        <Panel header="Bước 2: Tính lương chính" key="2">
          <Paragraph style={{ marginBottom: 0 }}>
            Sau khi xác định hình thức lương, hệ thống áp dụng công thức tương
            ứng:
          </Paragraph>
          <ul>
            <li>
              <Paragraph style={{ marginBottom: 3 }}>
                <Text strong>- Lương cố định:</Text>
              </Paragraph>
              <Paragraph style={{ marginBottom: 2 }}>
                <Text>+ Bước 1:</Text> Xác định tiền lương 1 ngày
              </Paragraph>
              <Paragraph code style={{ marginBottom: 6 }}>
                Tiền lương 1 ngày = Lương cơ bản theo chức vụ / Tổng số ngày
                trong tháng
              </Paragraph>
              <Paragraph style={{ marginBottom: 2 }}>
                <Text>+ Bước 2:</Text> Tính hiệu suất làm việc trong ngày
              </Paragraph>
              <Paragraph code style={{ marginBottom: 6 }}>
                Hiệu suất = Tổng số giờ làm thực tế / Tổng số giờ theo ca
              </Paragraph>
              <Paragraph style={{ marginBottom: 2 }}>
                <Text>+ Bước 3:</Text> Tính lương làm trong ngày
              </Paragraph>
              <Paragraph code style={{ marginBottom: 6 }}>
                Lương làm = Tiền lương 1 ngày × Hiệu suất
              </Paragraph>
            </li>
            <li style={{ marginTop: 8 }}>
              <Paragraph style={{ marginBottom: 3 }}>
                <Text strong>- Lương theo giờ:</Text>
              </Paragraph>
              <Paragraph code>
                Lương làm = Lương cơ bản theo chức vụ x Số giờ làm thực tế
              </Paragraph>
            </li>
          </ul>
        </Panel>
        <Panel header="Bước 3: Tính các khoản cộng thêm" key="3">
          <Paragraph style={{ marginBottom: 0 }}>
            Các khoản sau sẽ được cộng thêm nếu phát sinh:
          </Paragraph>
          <ul>
            <li>
              <Text strong>- Phụ cấp:</Text> Các khoản phụ cấp cho nhân viên
              theo mỗi tháng
            </li>
            <li>
              <Text strong>- Thưởng:</Text> Các khoản thưởng riêng cho nhân viên
            </li>
          </ul>
          <Paragraph code style={{ marginTop: 4 }}>
            Khoản cộng = Phụ cấp + Thưởng
          </Paragraph>
        </Panel>
        <Panel header="Bước 4: Tính các khoản khấu trừ" key="4">
          <Paragraph style={{ marginBottom: 0 }}>
            Các khoản sau sẽ bị trừ khỏi lương nếu vi phạm:
          </Paragraph>
          <ul>
            <li>
              <Text strong>- Bảo hiểm:</Text> Các khoản bảo hiểm cho nhân viên
              theo mỗi tháng
            </li>
            <li>
              <Text strong>- Phạt:</Text> Các khoản phạt riêng cho nhân viên
            </li>
            <li>
              <Text strong>- Ứng lương:</Text> Các khoản ứng lương riêng cho nhân viên
            </li>
          </ul>
          <Paragraph code style={{ marginTop: 4 }}>
            Khoản trừ = Bảo hiểm + Phạt + Ứng lương
          </Paragraph>
        </Panel>
        <Panel header="Bước 5: Tính tổng lương" key="5">
          <Paragraph style={{marginBottom: 2}}>
            Sau khi tính đầy đủ các khoản, hệ thống tổng hợp:
          </Paragraph>
          <Paragraph code>
            Tổng lương = Lương chính + Khoản cộng − Khoản trừ
          </Paragraph>
          <Paragraph type="secondary" style={{margin: 0}}>
            Đây là số tiền cuối cùng nhân viên nhận được trong kỳ lương.
          </Paragraph>
        </Panel>
      </Collapse>
    </>
  );
};

export default FilterExplain;
