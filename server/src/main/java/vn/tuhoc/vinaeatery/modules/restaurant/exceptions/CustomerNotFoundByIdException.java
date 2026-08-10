package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class CustomerNotFoundByIdException extends RuntimeException {
    public CustomerNotFoundByIdException(Integer id) {
        super(String.format("Khách hàng có mã %s không tìm thấy!", id));
    }
}
