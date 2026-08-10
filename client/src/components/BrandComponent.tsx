import type { FC } from "react";
import { Link } from "react-router-dom";
import { ImageSourcePath } from "../constants/values";

interface BrandComponentProps {
  to: string;
  name: string;
  prefixClassName?: string;
}

const BrandComponent: FC<BrandComponentProps> = ({
  to,
  prefixClassName,
  name,
}) => {
  return (
    <>
      <Link
        to={to}
        className={prefixClassName ? prefixClassName + "brand" : "brand"}
      >
        <img
          src={ImageSourcePath + "brand-image.png"}
          alt="brand-image"
          className="image"
        />
        <strong className="name">{name}</strong>
      </Link>
    </>
  );
};

export default BrandComponent;
