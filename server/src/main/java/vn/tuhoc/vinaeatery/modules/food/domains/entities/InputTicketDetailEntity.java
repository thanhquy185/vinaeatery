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
@Table(name = "input_ticket_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketDetailEntity {
    @EmbeddedId
    InputTicketDetailIdEntity id;

    @MapsId("inputTicketId")
    @ManyToOne
    @JsonIgnore
    InputTicketEntity inputTicket;

    @MapsId("ingredientId")
    @ManyToOne(fetch = FetchType.LAZY)
    IngredientEntity ingredient;

    @Column(nullable = false)
    Long quantity;

    @Column(nullable = false)
    Long inputPrice;

    @Column(nullable = false)
    String ingredientNameSnapshot;

    @Column(nullable = false)
    Long ingredientInputPriceSnapshot;

    @Column(nullable = false)
    Long totalInputPriceDetail;
}
