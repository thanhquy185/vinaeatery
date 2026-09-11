package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageInfoResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageMapperHelper2 {
    final MessageMapper2 messageMapper2;

    public MessageInfoResponseDTO mapToInfoResponse(MessageEntity messageEntity) {
        return this.messageMapper2.entityToInfoResponse(messageEntity);
    }
}