package vn.tuhoc.vinaeatery.modules.global.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.services.MessageServiceImplement;
import vn.tuhoc.vinaeatery.modules.active.services.OrderSheetServiceImplement;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.RestaurantReadMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.RestaurantSendMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.UpdateStatusOrderSheetRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.CustomerSendMessageRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.requests.OpenPaymentMachineRequestDTO;
import vn.tuhoc.vinaeatery.modules.global.services.SocketService;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketController {
        SocketService socketService;
        MessageServiceImplement messageService;
        OrderSheetServiceImplement orderSheetService;

        @MessageMapping("/open-payment-machine")
        public void handleOpenPaymentMachine(
                        OpenPaymentMachineRequestDTO openPaymentMachineRequestDTO) {
                this.socketService.handleConvertAndSend(
                                "/topic/open-payment-machine",
                                openPaymentMachineRequestDTO);

        }

        @MessageMapping("/pending-payment-machine")
        public void handlePendingPaymentMachine() {
                this.socketService.handleConvertAndSend(
                                "/topic/pending-payment-machine", "");
        }

        @MessageMapping("/selected-payment-machine")
        public void handleSelectedPaymentMachine() {
                this.socketService.handleConvertAndSend(
                                "/topic/selected-payment-machine", "");
        }

        @MessageMapping("/feedback-payment-machine")
        public void handleFeedbackPaymentMachine() {
                this.socketService.handleConvertAndSend(
                                "/topic/feedback-payment-machine", "");
        }

        @MessageMapping("/completed-payment-machine")
        public void handleCompletedPaymentMachine() {
                this.socketService.handleConvertAndSend(
                                "/topic/completed-payment-machine", "");
        }

        @MessageMapping("/cancelled-payment-machine")
        public void handleCancelledPaymentMachine() {
                this.socketService.handleConvertAndSend(
                                "/topic/cancelled-payment-machine", "");
        }

        @MessageMapping("/restaurant-read-message")
        public void handleRestaurantReadMessage(RestaurantReadMessageRequestDTO restaurantReadMessageRequestDTO) {
                MessageEntity messageEntityUpdated = this.messageService
                                .handleRestaurantReadMessage(restaurantReadMessageRequestDTO);

                this.socketService.handleConvertAndSend(
                                "/topic/manager-messages",
                                messageEntityUpdated.getId());
        }

        @MessageMapping("/restaurant-send-message")
        public void handleRestaurantSendMessage(RestaurantSendMessageRequestDTO restaurantSendMessageRequestDTO) {
                MessageEntity messageEntityUpdated = this.messageService
                                .handleRestaurantSendMessage(restaurantSendMessageRequestDTO);

                this.socketService.handleConvertAndSend(
                                "/topic/manager-messages",
                                messageEntityUpdated.getId());
                this.socketService.handleConvertAndSend(
                                String.format("/topic/call-food-messages-use-table-%s",
                                                messageEntityUpdated.getUseTable().getId()),
                                "");
        }

        @MessageMapping("/customer-call-employee")
        public void handleCustomerCallEmployee(String tableName) {
                this.socketService.handleConvertAndSend(
                                "/topic/customer-call-employee",
                                tableName);
        }

        @MessageMapping("/customer-call-food")
        public void handleCustomerCallFood(String tableName) {
                this.socketService.handleConvertAndSend(
                                "/topic/customer-call-food",
                                tableName);
        }

        @MessageMapping("/customer-cancel-order-sheet")
        public void handleCustomerCancelOrderSheet(String tableName) {
                this.socketService.handleConvertAndSend(
                                "/topic/customer-cancel-order-sheet",
                                tableName);
        }

        @MessageMapping("/customer-send-message")
        public void handleCustomerSendMessage(CustomerSendMessageRequestDTO customerSendMessageRequestDTO) {
                MessageEntity messageEntityCreated = this.messageService
                                .handleCustomerSendMessage(customerSendMessageRequestDTO);

                this.socketService.handleConvertAndSend(
                                "/topic/customer-send-message",
                                messageEntityCreated.getUseTable().getTable().getName());
        }

        @MessageMapping("/update-status-order-sheet")
        public void handleUpdateStatusOrderSheet(UpdateStatusOrderSheetRequestDTO updateStatusOrderSheetRequestDTO) {
                OrderSheetDetailResponseDTO orderSheetDetailResponseDTO = this.orderSheetService
                                .handleGetDetailById(updateStatusOrderSheetRequestDTO.getOrderSheetId());

                this.socketService.handleConvertAndSend(
                                String.format("/topic/call-food-order-sheets-use-table-%s",
                                                orderSheetDetailResponseDTO.getUseTable().getId()),
                                "");
        }
}
