import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";

interface ImagesUploadComponentProps {
  initialImages?: UploadFile[];
  max?: number;
  disabled?: boolean;
  onChange?: (images: UploadFile[]) => void;
}

const ImagesUploadComponent: React.FC<ImagesUploadComponentProps> = ({
  initialImages = [],
  max = 1000,
  disabled = false,
  onChange,
}) => {
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>(initialImages);

  useEffect(() => {
    setFileList(initialImages);
  }, [initialImages]);

  // -------- kiểm tra file có phải ảnh hay không ----------
  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      message.error("Chỉ được phép tải lên file hình ảnh!");
      return Upload.LIST_IGNORE;
    }

    const isLt5MB = file.size / 1024 / 1024 < 5;
    if (!isLt5MB) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }

    return false; // Không upload lên server
  };

  // -------- preview ảnh ----------
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.thumbUrl as string));
    setPreviewOpen(true);
  };

  // -------- xử lý thay đổi ----------
  const handleChange: UploadProps["onChange"] = ({ fileList: newList }) => {
    // thông báo số ảnh upload vào
    const addedCount = newList.length - fileList.length;
    if (addedCount > 0) {
      message.success(`Đã thêm ${addedCount} ảnh`);
    }

    // mô phỏng loading cho file mới
    const updatedList: UploadFile[] = newList.map((file) => {
      if (!file.url && !file.thumbUrl && file.status !== "done") {
        return { ...file, status: "uploading" };
      }
      return file;
    });

    // delay để hiển thị hiệu ứng loading
    setTimeout(() => {
      const doneList: UploadFile[] = updatedList.map((file) => ({
        ...file,
        status: "done",
      }));

      setFileList(doneList);
      onChange?.(doneList);
    }, 300);
  };

  // -------- nút upload ----------
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={{
          showRemoveIcon: !disabled,
        }}
      >
        {fileList.length >= max || disabled ? null : uploadButton}
      </Upload>
      <Image
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible: previewOpen,
          onVisibleChange: (value: boolean) => setPreviewOpen(value),
        }}
      />
    </>
  );
};

export default ImagesUploadComponent;
