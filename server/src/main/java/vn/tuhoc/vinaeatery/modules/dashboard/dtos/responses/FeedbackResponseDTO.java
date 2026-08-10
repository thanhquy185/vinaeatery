package vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FeedbackResponseDTO {
    private RestaurantSubInfoResponseDTO restaurant;

    private String dateStart;

    private String dateEnd;

    private FeedbackCardResponseDTO card;

    private FeedbackChartResponseDTO chart;

    private FeedbackTableResponseDTO table;
}
