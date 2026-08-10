import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { ExpenseResponseType } from "../../../types/ExpenseType";

const FEATURE_NAME = "dashboard-expense";

const ExpenseApiService = {
  async handleDashboard({
    restaurantId,
    expenseType,
    timeline,
    timeDetail,
  }: FilterDataProps): Promise<AxiosResponse<ExpenseResponseType, any>> {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        type: expenseType,
        timeline,
        timeDetail,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};

export default ExpenseApiService;
