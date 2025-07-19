package vn.tuhoc.vinaeatery.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InputTicketDetailForCrud {
    // Properties
    private Integer ingredientId;
    private Long quantity;
    private Long price;
}