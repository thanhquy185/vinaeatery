package vn.tuhoc.vinaeatery.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "functions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Function {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "name_vn")
    private String nameVN;
    @Column(name = "name_en")
    private String nameEN;
    private String category;
    private String actions;
}
