package vn.tuhoc.vinaeatery.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ZalopayResponseDTO {
    private int returnCode;
    private String returnMessage;
    private String orderUrl; // link QR code để quét
    private String zpTransToken;
}
