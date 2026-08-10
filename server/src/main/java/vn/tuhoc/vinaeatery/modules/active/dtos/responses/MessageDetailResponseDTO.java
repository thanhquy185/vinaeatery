package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDetailResponseDTO {
    private Integer id;

    private RestaurantSubInfoResponseDTO restaurant;

    private UseTableInfoResponseDTO useTable;

    private String createAt;

    private Boolean isRead;

    private List<MessageDDetailResponseDTO> messageDetails;
}
