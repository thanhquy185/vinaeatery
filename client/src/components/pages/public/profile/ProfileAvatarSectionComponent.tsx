import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Typography } from "antd";
import type { ChangeEventHandler, RefObject } from "react";

type ProfileAvatarSectionComponentProps = {
  avatarSrc: string;
  fullname: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  onSelectImage: () => void;
};

const ProfileAvatarSectionComponent: React.FC<
  ProfileAvatarSectionComponentProps
> = ({ avatarSrc, fullname, fileInputRef, onImageChange, onSelectImage }) => {
  return (
    <aside className="public-account-profile__aside">
      <Avatar
        size={104}
        src={avatarSrc || undefined}
        icon={<UserOutlined />}
        className="public-account-profile__avatar"
        onError={() => true}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="public-account-profile__file-input"
        style={{ display: "none" }}
        aria-label="Chọn ảnh đại diện"
        onChange={onImageChange}
      />
      <div className="public-account-profile__identity">
        <Typography.Title level={4}>
          {fullname}
        </Typography.Title>
        <Button
          type="default"
          icon={<CameraOutlined />}
          className="public-account-profile__change-image"
          onClick={onSelectImage}
        >
          Thay đổi ảnh
        </Button>
      </div>
    </aside>
  );
};

export default ProfileAvatarSectionComponent;
