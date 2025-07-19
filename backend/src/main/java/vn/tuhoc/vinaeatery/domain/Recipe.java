package vn.tuhoc.vinaeatery.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recipes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Recipe {
    // Properties
    @EmbeddedId
    private RecipeId id;
    private Long quantity;
    private String note;
}
