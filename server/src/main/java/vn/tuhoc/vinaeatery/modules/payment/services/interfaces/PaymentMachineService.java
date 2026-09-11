package vn.tuhoc.vinaeatery.modules.payment.services.interfaces;

import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineDetailResponseDTO;

public interface PaymentMachineService {
        PaymentMachineEntity handleGetOneById(Integer id);

        PaymentMachineDetailResponseDTO handleGetDetailById(Integer id);

        PaymentMachineDetailResponseDTO handleGetDetailByUseTableId(Integer useTableId);

        PaymentMachineDetailResponseDTO handleCreate(PaymentMachineCreateRequestDTO paymentMachineCreateRequestDTO);

        PaymentMachineDetailResponseDTO handleUpdate(
                        Integer id,
                        PaymentMachineUpdateRequestDTO paymentMachineUpdateRequestDTO);

        PaymentMachineDetailResponseDTO handleUpdateByWallet(
                        String orderId,
                        Long amount,
                        Integer paymentMethodId);
}
