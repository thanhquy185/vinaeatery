package vn.tuhoc.vinaeatery.modules.food.domains.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Embeddable
@EqualsAndHashCode
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketDetailIdEntity implements Serializable {
    Integer inputTicketId;

    Integer ingredientId;
}
