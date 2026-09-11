package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
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
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineUpdateRequestDTO {
    Integer paymentMethodId;

    Long paymentTotalPrice;

    @Convert(converter = PaymentMachineProcessStatusConverter.class)
    PaymentMachineProcessStatusEnum processStatus;

    @Convert(converter = PaymentMachineStatusConverter.class)
    PaymentMachineStatusEnum status;

    @Convert(converter = FeedbackExperienceConverter.class)
    FeedbackExperienceEnum feedbackExperience;

    Integer feedbackScore1;

    Integer feedbackScore2;

    Integer feedbackScore3;

    Integer feedbackScore4;

    Integer feedbackScore5;

    String feedbackMessage;
}
