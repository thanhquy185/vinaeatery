package vn.tuhoc.vinaeatery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.jaxb.SpringDataJaxb.OrderDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import vn.tuhoc.vinaeatery.domain.dto.UseTableUpdateDTO;

@Controller
public class WebSocketController {
  // Properties
  @Autowired
  private SimpMessagingTemplate messagingTemplate;

  // Methods
  // // Ví dụ: Nhận yêu cầu gửi message từ client
  // @MessageMapping("/notify") // -> /app/notify
  // public void processMessage(@Payload String message) {
  // messagingTemplate.convertAndSend("/topic/global", message);
  // }

  // // Gửi thông báo đơn hàng mới (backend logic gọi đến)
  // public void sendOrderCreatedNotification(String orderJson) {
  // messagingTemplate.convertAndSend("/topic/order", orderJson);
  // }

  // // Gửi thông báo chỉ cho trang quản lý khách hàng
  // public void sendCustomerUpdate(String customerJson) {
  // messagingTemplate.convertAndSend("/topic/customer", customerJson);
  // }

  public void notifyUpdateTableStatus(String tableId, UseTableUpdateDTO useTableUpdateDTO) {
    messagingTemplate.convertAndSend("/topic/update-table-status/" + tableId, useTableUpdateDTO);
  }
}
