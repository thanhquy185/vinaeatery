package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class OrderSheetIngredientInsufficientInventory extends RuntimeException {
    public OrderSheetIngredientInsufficientInventory(String message) {
        super(message);
    }
}
