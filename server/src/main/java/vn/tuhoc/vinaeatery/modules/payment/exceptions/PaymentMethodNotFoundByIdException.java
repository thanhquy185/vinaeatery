package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class PaymentMethodNotFoundByIdException extends RuntimeException {
    public PaymentMethodNotFoundByIdException(Integer id) {
        super(String.format("Phương thức thanh toán có mã %s không tìm thấy!", id));
    }
}
