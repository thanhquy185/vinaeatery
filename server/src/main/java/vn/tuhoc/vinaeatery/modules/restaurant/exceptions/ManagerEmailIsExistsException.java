package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class ManagerEmailIsExistsException extends RuntimeException {
    public ManagerEmailIsExistsException(String email) {
        super(String.format("Email chủ nhà hàng %s đã tồn tại!", email));
    }
}
