package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "menu_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuDetailEntity {
    @EmbeddedId
    private MenuDetailIdEntity id;

    @MapsId("menuId")
    @ManyToOne
    @JsonIgnore
    private MenuEntity menu;

    @MapsId("foodId")
    @ManyToOne(fetch = FetchType.LAZY)
    private FoodEntity food;
}
