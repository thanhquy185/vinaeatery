package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class PaymentMachineNotFoundByIdException extends RuntimeException {
    public PaymentMachineNotFoundByIdException(Integer id) {
        super(String.format("Thanh toán POS có mã %s không tìm thấy!", id));
    }
}
