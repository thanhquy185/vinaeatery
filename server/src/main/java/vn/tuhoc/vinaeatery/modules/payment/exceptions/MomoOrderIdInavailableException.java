package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class MomoOrderIdInavailableException extends RuntimeException {
    public MomoOrderIdInavailableException() {
        super("orderId là bắt buộc để hủy giao dịch!");
    }
}
