import type React from "react";
import { Link } from "react-router-dom";

interface CustomBrandProps {
  to: string;
  prefixClassName: string;
  name: string;
}

const CustomBrand: React.FC<CustomBrandProps> = ({
  to,
  prefixClassName,
  name,
}) => {
  return (
    <>
      <Link to={to} className={`${prefixClassName}brand`}>
        <img
          src="/src/assets/images/others/brand-image.png"
          alt="brand-image"
          className={`${prefixClassName}brand-image`}
        />
        <strong className={`${prefixClassName}brand-name`}>{name}</strong>
      </Link>
    </>
  );
};

export default CustomBrand;
