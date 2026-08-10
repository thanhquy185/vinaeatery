package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class SupplierEmailIsExistsException extends RuntimeException {
    public SupplierEmailIsExistsException(String email) {
        super(String.format("Email nhà cung cấp %s đã tồn tại!", email));
    }
}
