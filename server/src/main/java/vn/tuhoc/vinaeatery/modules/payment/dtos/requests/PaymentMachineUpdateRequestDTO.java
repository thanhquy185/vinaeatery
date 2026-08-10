package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.FeedbackExperienceConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.FeedbackExperienceEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineProcessStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineProcessStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMachineUpdateRequestDTO {
    private Integer paymentMethodId;

    private Long paymentTotalPrice;

    @Convert(converter = PaymentMachineProcessStatusConverter.class)
    private PaymentMachineProcessStatusEnum processStatus;

    @Convert(converter = PaymentMachineStatusConverter.class)
    private PaymentMachineStatusEnum status;

    @Convert(converter = FeedbackExperienceConverter.class)
    private FeedbackExperienceEnum feedbackExperience;

    private Integer feedbackScore1;

    private Integer feedbackScore2;

    private Integer feedbackScore3;

    private Integer feedbackScore4;

    private Integer feedbackScore5;

    private String feedbackMessage;
}
