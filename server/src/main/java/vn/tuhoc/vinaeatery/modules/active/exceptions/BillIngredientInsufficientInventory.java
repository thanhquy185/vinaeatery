package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class BillIngredientInsufficientInventory extends RuntimeException {
    public BillIngredientInsufficientInventory(String message) {
        super(message);
    }
}
