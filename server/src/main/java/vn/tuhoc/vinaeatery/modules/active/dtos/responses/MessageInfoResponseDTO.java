package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageInfoResponseDTO {
    private Integer id;

    private String createAt;

    private Boolean isRead;

    private List<MessageDDetailResponseDTO> messageDetails;
}
