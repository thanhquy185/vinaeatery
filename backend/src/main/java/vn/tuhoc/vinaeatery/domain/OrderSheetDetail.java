package vn.tuhoc.vinaeatery.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_sheet_details")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderSheetDetail {
    // Properties
    @EmbeddedId
    private OrderSheetDetailId id;
    private Long price;
    private Long quantity;
}
