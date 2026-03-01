import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Modal, Input, message, Form, Select } from "antd";
import { ruleRequired } from "../common/rules";
import { openNotification } from "../utils/show-notification";
import { openConfirmation } from "../utils/show-confirmation";

// 👉 Định nghĩa kiểu dữ liệu trả về
interface AddressResult {
  houseNumberAndStreetName: string;
  province: string;
  ward: string;
}

// 👉 Hàm hiển thị modal và trả về Promise
export function showCreateValidAddress(): Promise<AddressResult | null> {
  return new Promise((resolve) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);

    const destroy = () => {
      root.unmount();
      div.remove();
    };

    const AddressModal = () => {
      const [form] = Form.useForm();
      const [wards, setWards] = useState<string[]>([]);

      const provinceWardData: Record<string, string[]> = {
        "Hà Nội": [
          "Phường Bách Khoa",
          "Phường Bạch Đằng",
          "Phường Cầu Dền",
          "Phường Đồng Tâm",
          "Phường Láng Thượng",
          "Phường Mai Dịch",
        ],
        "TP. Hồ Chí Minh": [
          "Phường Bến Nghé",
          "Phường Bến Thành",
          "Phường Nguyễn Cư Trinh",
          "Phường Tân Định",
          "Phường Linh Trung",
          "Phường Thảo Điền",
        ],
        "Đà Nẵng": [
          "Phường Hải Châu 1",
          "Phường Hải Châu 2",
          "Phường Hòa Thuận Tây",
          "Phường Thạch Thang",
          "Phường An Hải Bắc",
        ],
        "Cần Thơ": [
          "Phường Tân An",
          "Phường Cái Khế",
          "Phường Hưng Lợi",
          "Phường Xuân Khánh",
        ],
        "Hải Phòng": [
          "Phường Cầu Đất",
          "Phường Lạch Tray",
          "Phường Đằng Lâm",
          "Phường Trại Cau",
        ],
        "Tỉnh 1": ["Phường A1", "Phường A2", "Phường A3"],
        "Tỉnh 2": ["Phường B1", "Phường B2", "Phường B3"],
      };

      const handleProvinceChange = (province: string) => {
        form.setFieldsValue({ ward: undefined });
        setWards(provinceWardData[province] || []);
      };

      const handleCancel = () => {
        resolve(null);
        destroy();
      };

      const handleSubmit = async () => {
        // Hỏi trước khi xử khi xử lý ?
        const answer = await openConfirmation({
          title: `Bạn có chắc chắn tạo ?`,
          content: "Kiểm tra thông tin trước khi xác nhận.",
        });
        if (answer) {
          try {
            const values = await form.validateFields();
            const {
              "house-number-and-street-name": houseNumberAndStreetName,
              province,
              ward,
            } = values;

            openNotification({
              type: "success",
              message: "Thành công",
              description: "Tạo địa chỉ hợp lệ thành công!",
            });

            resolve({
              houseNumberAndStreetName,
              province,
              ward,
            });

            destroy();
          } catch (error) {
            // Validation failed → không làm gì cả
          }
        }
      };

      useEffect(() => {
        setTimeout(() => {
          const input = document.getElementById("house-number-and-street-name");
          input?.focus();
        }, 100);
      }, []);

      return (
        <Modal
          open
          centered
          title="Tạo địa chỉ hợp lệ"
          onCancel={handleCancel}
          footer={null}
          className="modal secondary"
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
            className="modal__form"
          >
            <div className="modal__form-group">
              <Form.Item
                name="house-number-and-street-name"
                label="Số nhà, tên đường"
                htmlFor="house-number-and-street-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Số nhà, tên đường không được để trống!")]}
              >
                <Input
                  id="house-number-and-street-name"
                  placeholder="Nhập Số nhà, tên đường"
                />
              </Form.Item>

              <Form.Item
                name="province"
                label="Tỉnh thành"
                htmlFor="create-province"
                className="modal__form-group-item"
                rules={[ruleRequired("Tỉnh thành không được để trống!")]}
              >
                <Select
                  allowClear
                  id="create-province"
                  placeholder="Chọn Tỉnh thành"
                  onChange={handleProvinceChange}
                  options={Object.keys(provinceWardData).map((province) => ({
                    label: province,
                    value: province,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="ward"
                label="Phường xã"
                htmlFor="create-ward"
                className="modal__form-group-item"
                rules={[ruleRequired("Phường xã không được để trống!")]}
              >
                <Select
                  allowClear
                  id="create-ward"
                  placeholder="Chọn Phường xã"
                  // disabled={wards.length === 0}
                  options={wards.map((ward) => ({
                    label: ward,
                    value: ward,
                  }))}
                />
              </Form.Item>
            </div>

            <div className="modal__buttons">
              <button type="submit" className="modal__button btn secondary-btn">
                Xác nhận
              </button>
            </div>
          </Form>
        </Modal>
      );
    };

    root.render(<AddressModal />);
  });
}
