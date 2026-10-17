import { Typography } from "antd";
import type { ReactNode } from "react";

type PublicAccountPageHeaderComponentProps = {
  title: string;
  action?: ReactNode;
};

const PublicAccountPageHeaderComponent: React.FC<
  PublicAccountPageHeaderComponentProps
> = ({ title, action }) => (
  <div className="public-account-page__heading">
    <Typography.Title level={2} className="public-account-page__title">
      {title}
    </Typography.Title>
    {action}
  </div>
);

export default PublicAccountPageHeaderComponent;
