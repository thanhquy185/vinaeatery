package vn.tuhoc.vinaeatery.domain.criteria;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor 
@Getter
@Setter
public class UserCriteria {
    private Optional<String> id;    
    private Optional<String> role;
    private Optional<String> username;
    private Optional<String> method;
    private Optional<String> isUsing;
    private Optional<String> status;
    private Optional<String> sort;
}
