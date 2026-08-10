import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { MenuSummaryResponseType } from "../../../../types/MenuType";

type CardMenuComponentProps = {
  menu: MenuSummaryResponseType;
};

const CardMenuComponent: React.FC<CardMenuComponentProps> = ({ menu }) => {
  return (
    <div className="menu-card">
      <h3>{menu.name}</h3>
      <p>
        <span>Loại món ăn: </span>
        <b className="category">{menu.type}</b>
      </p>
      <p>
        <span> Giá bán: </span>
        <b className="price">{vietnamMoneyFormat(menu.price)}</b>
      </p>
    </div>
  );
};

export default CardMenuComponent;
