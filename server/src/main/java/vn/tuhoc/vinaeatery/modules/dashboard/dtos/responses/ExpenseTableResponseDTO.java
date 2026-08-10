package vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ExpenseTableResponseDTO {
    private List<ExpenseInputTicketTableBodyResponseDTO> inputTicketTableBody;

    private ExpenseInputTicketTableFootResponseDTO inputTicketTableFoot;

    private List<ExpenseIngredientTableBodyResponseDTO> ingredientTableBody;

    private ExpenseIngredientTableFootResponseDTO ingredientTableFoot;

    private List<ExpenseSupplierTableBodyResponseDTO> supplierTableBody;

    private ExpenseSupplierTableFootResponseDTO supplierTableFoot;
}
