package vn.tuhoc.vinaeatery.modules.food.domains.entities;

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

@Entity
@Table(name = "recipes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RecipeEntity {
    @EmbeddedId
    RecipeIdEntity id;

    @MapsId("foodId")
    @ManyToOne
    @JsonIgnore
    FoodEntity food;

    @MapsId("ingredientId")
    @ManyToOne(fetch = FetchType.LAZY)
    IngredientEntity ingredient;

    @Column(nullable = false)
    Long quantity;

    @Column(nullable = true)
    String note;
}
