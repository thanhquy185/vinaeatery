package vn.tuhoc.vinaeatery.modules.payment.dtos.responses;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ZaloPayResponseDTO {
    int returnCode;

    String returnMessage;

    String orderUrl; // link QR code để quét

    String zpTransToken;
}
