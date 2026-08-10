package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class MomoAmountInavailableException extends RuntimeException {
    public MomoAmountInavailableException() {
        super("amount là bắt buộc để hủy giao dịch!");
    }
}
