package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.MessageCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.MessageDTO;
import vn.tuhoc.vinaeatery.domain.entity.Message;
import vn.tuhoc.vinaeatery.service.MessageService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageApiController {
        // Properties
        private final MessageService messageService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listMessage(@RequestBody FormSecurityDTO formSecurityDTO,
                        MessageCriteria messageCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "messages", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<Message> listMessage = this.messageService
                                .getAll(messageCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listMessage);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listMessageFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        MessageCriteria messageCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "messages", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<MessageDTO> listMessage = this.messageService
                                .getAllFormat(messageCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listMessage);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailMessage(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "messages", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Message messageSelected = this.messageService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(messageSelected);
        }
}
