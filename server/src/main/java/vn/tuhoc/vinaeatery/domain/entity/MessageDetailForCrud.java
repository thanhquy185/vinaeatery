package vn.tuhoc.vinaeatery.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDetailForCrud {
    private String sendAt;
    private Boolean isAdminSend;
    private String content;
}
