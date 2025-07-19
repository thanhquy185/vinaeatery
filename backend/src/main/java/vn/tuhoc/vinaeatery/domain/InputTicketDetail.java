package vn.tuhoc.vinaeatery.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "input_ticket_details")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InputTicketDetail {
    // Properties
    @EmbeddedId
    private InputTicketDetailId id;
    private Long price;
    private Long quantity;
}
