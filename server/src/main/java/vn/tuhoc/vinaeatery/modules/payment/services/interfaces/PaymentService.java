package vn.tuhoc.vinaeatery.modules.payment.services.interfaces;

import java.util.Map;

public interface PaymentService {
    Object handleCreateOrder(Integer paymentMachineId) throws Exception;

    void handleCallbackOrder(Map<String, String> payload);
}
