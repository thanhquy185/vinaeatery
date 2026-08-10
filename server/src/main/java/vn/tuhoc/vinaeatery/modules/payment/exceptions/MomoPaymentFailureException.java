package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class MomoPaymentFailureException extends RuntimeException {
    public MomoPaymentFailureException() {
        super("Thanh toán bằng ví MoMo thất bại!");
    }
}
