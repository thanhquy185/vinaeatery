package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageInfoResponseDTO {
    Integer id;

    String createAt;

    Boolean isRead;

    List<MessageDDetailResponseDTO> messageDetails;
}
