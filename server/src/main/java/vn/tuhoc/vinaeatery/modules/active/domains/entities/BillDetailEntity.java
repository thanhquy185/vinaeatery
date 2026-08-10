package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;

@Entity
@Table(name = "bill_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BillDetailEntity {
    @EmbeddedId
    private BillDetailIdEntity id;

    @MapsId("billId")
    @ManyToOne
    @JsonIgnore
    private BillEntity bill;

    @MapsId("foodId")
    @ManyToOne(fetch = FetchType.LAZY)
    private FoodEntity food;

    @Column(nullable = false)
    private Long quantity;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false)
    private String foodNameSnapshot;

    @Column(nullable = false)
    private String foodUnitSnapshot;

    @Column(nullable = false)
    private Long foodPriceSnapshot;

    @Column(nullable = false)
    private Long totalPriceDetail;
}
