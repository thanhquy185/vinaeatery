package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private UseTableDTO useTable;
    private Boolean isRead;
    private List<MessageDetailDTO> messageDetails;
}
