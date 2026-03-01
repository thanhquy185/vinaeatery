import { Button, message, Upload, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import { ImageSourcePath } from "../../common/values";

type CustomImageUploadProps = {
  defaultSrc?: string;
  imageFile?: RcFile | undefined;
  setImageFile?: (file: RcFile) => void;
  alt: string;
  htmlFor?: string;
  imageClassName?: string;
  imageCategoryName?: string;
  uploadClassName?: string;
  labelButton?: string;
  disabled?: boolean;
};

const CustomImageUpload: React.FC<CustomImageUploadProps> = ({
  defaultSrc,
  imageFile,
  setImageFile,
  alt,
  htmlFor,
  imageClassName,
  imageCategoryName,
  uploadClassName,
  labelButton = "Tải hình ảnh",
  disabled = false,
}) => {
  const beforeUpload = async (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload ảnh!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }

    setImageFile!(file); // Gọi hàm truyền từ component cha
    return false; // Không upload lên server
  };

  return (
    <>
      <Image
        src={
          defaultSrc && !imageFile
            ? defaultSrc
            : imageFile
            ? URL.createObjectURL(imageFile)
            : ImageSourcePath + "no-image.png"
        }
        alt={alt}
        className={imageClassName}
      />
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={beforeUpload}
        id={htmlFor}
        className={uploadClassName}
      >
        <Button icon={<UploadOutlined />} id="image-button" disabled={disabled}>
          {labelButton}
        </Button>
      </Upload>
    </>
  );
};

export default CustomImageUpload;
