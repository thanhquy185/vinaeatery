package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageInfoResponseDTO;

@Component
@RequiredArgsConstructor
public class MessageMapperHelper2 {
    private final MessageMapper2 messageMapper2;

    public MessageInfoResponseDTO mapToInfoResponse(MessageEntity messageEntity) {
        return this.messageMapper2.entityToInfoResponse(messageEntity);
    }
}