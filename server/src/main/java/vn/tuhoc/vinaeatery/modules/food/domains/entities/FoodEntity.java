package vn.tuhoc.vinaeatery.modules.food.domains.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedAttributeNode;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.FoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "foods")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(name = "FoodEntity.half", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                @NamedAttributeNode("categoryFood"),
})
@NamedEntityGraph(name = "FoodEntity.onlyCategoryFood", attributeNodes = {
                @NamedAttributeNode("categoryFood"),
})
public class FoodEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @Column(nullable = true)
        private String image;

        @Column(nullable = false)
        private String name;

        @Column(nullable = false)
        private String unit;

        @Column(nullable = false)
        private Long price;

        @Column(columnDefinition = "MEDIUMTEXT", nullable = true)
        private String description;

        @Convert(converter = FoodStatusConverter.class)
        private FoodStatusEnum status;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        private RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "category_food_id", nullable = false)
        private CategoryFoodEntity categoryFood;

        @OneToMany(mappedBy = "food", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<UseFoodEntity> useFoods;

        @OneToMany(mappedBy = "food", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        List<RecipeEntity> recipes = new ArrayList<>();

        public void addRecipe(RecipeEntity recipeEntity) {
                this.recipes.add(recipeEntity);
                recipeEntity.setFood(this);
        }

        public void removeRecipe(RecipeEntity recipeEntity) {
                this.recipes.remove(recipeEntity);
                recipeEntity.setFood(null);
        }
}
