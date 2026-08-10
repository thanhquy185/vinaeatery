package vn.tuhoc.vinaeatery.modules.payment.exceptions;

public class PaymentMachineExistsOneIsHandlingException extends RuntimeException {
    public PaymentMachineExistsOneIsHandlingException(String tableName) {
        super(String.format("Bàn ăn \"%s\" đang xử lý thanh toán hoá đơn!", tableName));
    }
}
