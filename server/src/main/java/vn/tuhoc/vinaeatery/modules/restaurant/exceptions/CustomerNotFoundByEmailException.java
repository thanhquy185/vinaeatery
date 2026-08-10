package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class CustomerNotFoundByEmailException extends RuntimeException {
    public CustomerNotFoundByEmailException(String phone) {
        super(String.format("Khách hàng có email %s không tìm thấy!", phone));
    }
}
