package vn.tuhoc.vinaeatery.modules.food.domains.entities;

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

@Entity
@Table(name = "recipes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeEntity {
    @EmbeddedId
    private RecipeIdEntity id;

    @MapsId("foodId")
    @ManyToOne
    @JsonIgnore
    private FoodEntity food;

    @MapsId("ingredientId")
    @ManyToOne(fetch = FetchType.LAZY)
    private IngredientEntity ingredient;

    @Column(nullable = false)
    private Long quantity;

    @Column(nullable = true)
    private String note;
}
