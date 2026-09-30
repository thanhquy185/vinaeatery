package vn.tuhoc.vinaeatery.modules.active.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MessageCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.MessageCriteria;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.MessageService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageController {
        MessageService messageService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('MESSAGES__READ')")
        public ResponseEntity<RestResponseDTO<MessageDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                MessageDetailResponseDTO messageDetail = this.messageService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn trò chuyện theo mã trò chuyện thành công!",
                                messageDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('MESSAGES__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<MessageSummaryResponseDTO>>> handleGetSummary(
                        MessageCriteria messageCriteria) {
                PageResponseDTO<MessageSummaryResponseDTO> messageSummary = this.messageService
                                .handleGetSummary(messageCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách trò chuyện thành công!",
                                messageSummary);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('MESSAGES__CREATE')")
        public ResponseEntity<RestResponseDTO<MessageDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid MessageCreateRequestDTO messageCreateRequestDTO) {
                MessageDetailResponseDTO messageCreated = this.messageService.handleCreate(messageCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm trò chuyện thành công!",
                                messageCreated);
        }
}
