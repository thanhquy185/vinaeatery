package vn.tuhoc.vinaeatery.modules.payment.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodDetailResponseDTO;

public interface PaymentMethodService {
    PaymentMethodDetailResponseDTO handleGetDetailById(Integer id);

    List<PaymentMethodCrudResponseDTO> handleGetCrud();
}
