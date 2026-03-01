import type { FC } from "react";
import { Link } from "react-router-dom";
import { ImageSourcePath } from "../../common/values";

interface CustomBrandProps {
  to: string;
  name: string;
  prefixClassName?: string;
}

const CustomBrand: FC<CustomBrandProps> = ({ to, prefixClassName, name }) => {
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

export default CustomBrand;
