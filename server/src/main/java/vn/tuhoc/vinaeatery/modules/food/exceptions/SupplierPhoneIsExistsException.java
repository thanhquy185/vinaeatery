package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class SupplierPhoneIsExistsException extends RuntimeException {
    public SupplierPhoneIsExistsException(String phone) {
        super(String.format("Số điện thoại nhà cung cấp %s đã tồn tại!", phone));
    }
}
