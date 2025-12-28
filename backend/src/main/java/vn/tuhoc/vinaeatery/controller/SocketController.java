package vn.tuhoc.vinaeatery.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.entity.Message;
import vn.tuhoc.vinaeatery.domain.entity.MessageDetail;
import vn.tuhoc.vinaeatery.domain.entity.MessageDetailId;
import vn.tuhoc.vinaeatery.service.MessageDetailService;
import vn.tuhoc.vinaeatery.service.MessageService;
import vn.tuhoc.vinaeatery.service.TimeService;

@Controller
@RequiredArgsConstructor
public class SocketController {
    // Properties
    private final MessageService messageService;
    private final MessageDetailService messageDetailService;
    private final TimeService timeService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    // Methods
    @MessageMapping("/admin-read-message")
    public void handleAdminReadMessage(Message message) {
        Message messageUpdate = this.messageService.getOneById(message.getId());
        if (messageUpdate != null) {
            messageUpdate.setIsRead(true);
            this.messageService.upsert(messageUpdate);

            this.simpMessagingTemplate.convertAndSend(
                    "/topic/use-table-" + messageUpdate.getUseTableId(),
                    messageUpdate);
        }

    }

    @MessageMapping("/admin-send-message")
    public void handleAdminSendMessage(Message message) {
        if (message != null && message.getMessageDetail() != null) {
            this.messageDetailService.upsert(new MessageDetail(
                    new MessageDetailId(message.getId(), message.getMessageDetail().getSendAt(),
                            message.getMessageDetail().getIsAdminSend()),
                    message.getMessageDetail().getContent()));

            this.simpMessagingTemplate.convertAndSend(
                    "/topic/use-table-" + message.getUseTableId(),
                    message);
            this.simpMessagingTemplate.convertAndSend(
                    "/topic/call-food-messages-use-table-" + message.getUseTableId(),
                    message);
        }

    }

    @MessageMapping("/customer-call-employee")
    public void handleCustomerCallEmployee(String tableName) {
        System.out.println(tableName);
        this.simpMessagingTemplate.convertAndSend(
                "/topic/admin-call-employee",
                tableName);
    }

    @MessageMapping("/customer-send-message")
    public void handleCustomerSendMessage(Message message) {
        Message messageExists = this.messageService.getOneByUseTableId(message.getUseTableId());
        if (messageExists == null) {
            Message messageCreate = new Message();
            messageCreate.setId(message.getId());
            messageCreate.setRestaurantId(message.getRestaurantId());
            messageCreate.setUseTableId(message.getUseTableId());
            messageCreate.setIsRead(false);

            Message handleMessageCreate = this.messageService.upsert(messageCreate);
            if (handleMessageCreate != null && message.getMessageDetail() != null) {
                MessageDetail messageDetail = new MessageDetail();
                messageDetail.setId(new MessageDetailId(handleMessageCreate.getId(),
                        message.getMessageDetail().getSendAt(),
                        message.getMessageDetail().getIsAdminSend()));
                messageDetail.setContent(message.getMessageDetail().getContent());
                this.messageDetailService.upsert(messageDetail);
            }
        } else {
            messageExists.setIsRead(false);
            this.messageService.upsert(messageExists);

            if (message.getMessageDetail() != null) {
                System.out.println(123);
                this.messageDetailService.upsert(new MessageDetail(
                        new MessageDetailId(messageExists.getId(),
                                message.getMessageDetail().getSendAt(),
                                message.getMessageDetail().getIsAdminSend()),
                        message.getMessageDetail().getContent()));
            }
        }

        this.simpMessagingTemplate.convertAndSend(
                "/topic/admin-messages",
                message);
        this.simpMessagingTemplate.convertAndSend(
                "/topic/use-table-" + message.getUseTableId(),
                message);
    }

    @MessageMapping("/customer-call-food")
    public void handleCustomerCallFood(String tableName) {
        this.simpMessagingTemplate.convertAndSend(
                "/topic/admin-call-food",
                tableName);
    }
}
