package vn.tuhoc.vinaeatery.modules.food.domains.entities;

import java.io.Serializable;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Embeddable
@EqualsAndHashCode
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeIdEntity implements Serializable {
    private Integer foodId;
    
    private Integer ingredientId;
}
