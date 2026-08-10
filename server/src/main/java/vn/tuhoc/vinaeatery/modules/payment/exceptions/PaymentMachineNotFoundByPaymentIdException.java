package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class PaymentMachineNotFoundByPaymentIdException extends RuntimeException {
    public PaymentMachineNotFoundByPaymentIdException(String paymentId) {
        super(String.format("Thanh toán POS có mã giao dịch %s không tìm thấy!", paymentId));
    }
}
