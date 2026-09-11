package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MessageCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.MessageCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.CustomerSendMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.RestaurantReadMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.RestaurantSendMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface MessageService {
    MessageDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<MessageSummaryResponseDTO> handleGetSummary(MessageCriteria messageCriteria);

    MessageDetailResponseDTO handleCreate(MessageCreateRequestDTO messageCreateRequestDTO);

    MessageEntity handleRestaurantReadMessage(RestaurantReadMessageRequestDTO restaurantReadMessageRequestDTO);

    MessageEntity handleRestaurantSendMessage(RestaurantSendMessageRequestDTO restaurantSendMessageRequestDTO);

    MessageEntity handleCustomerSendMessage(CustomerSendMessageRequestDTO customerSendMessageRequestDTO);

    
}
