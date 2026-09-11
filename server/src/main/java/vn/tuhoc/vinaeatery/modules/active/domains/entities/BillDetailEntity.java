package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;

@Entity
@Table(name = "bill_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDetailEntity {
    @EmbeddedId
    BillDetailIdEntity id;

    @MapsId("billId")
    @ManyToOne
    @JsonIgnore
    BillEntity bill;

    @MapsId("foodId")
    @ManyToOne(fetch = FetchType.LAZY)
    FoodEntity food;

    @Column(nullable = false)
    Long quantity;

    @Column(nullable = false)
    Long price;

    @Column(nullable = false)
    String foodNameSnapshot;

    @Column(nullable = false)
    String foodUnitSnapshot;

    @Column(nullable = false)
    Long foodPriceSnapshot;

    @Column(nullable = false)
    Long totalPriceDetail;
}
