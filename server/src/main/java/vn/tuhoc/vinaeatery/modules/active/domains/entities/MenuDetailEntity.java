package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "menu_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MenuDetailEntity {
    @EmbeddedId
    MenuDetailIdEntity id;

    @MapsId("menuId")
    @ManyToOne
    @JsonIgnore
    MenuEntity menu;

    @MapsId("foodId")
    @ManyToOne(fetch = FetchType.LAZY)
    FoodEntity food;
}
