package vn.tuhoc.vinaeatery.modules.table.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.UseTableService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.TableCriteria;
import vn.tuhoc.vinaeatery.modules.table.services.interfaces.TableService;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/tables")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TableController {
        UseTableService useTableService;
        TableService tableService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('TABLES__READ')")
        public ResponseEntity<RestResponseDTO<TableDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                TableDetailResponseDTO tableDetail = this.tableService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn bàn ăn theo mã bàn ăn thành công!",
                                tableDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('TABLES__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<TableSummaryResponseDTO>>> handleGetSummary(
                        TableCriteria tableCriteria) {
                PageResponseDTO<TableSummaryResponseDTO> tableSummary = this.tableService
                                .handleGetSummary(tableCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách bàn ăn thành công!",
                                tableSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('TABLES__READ')")
        public ResponseEntity<RestResponseDTO<List<TableCrudResponseDTO>>> getCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<TableCrudResponseDTO> tableCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.tableService.handleGetCrud(restaurantId)
                                : this.tableService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách bàn ăn để xử lý thông tin thành công!",
                                tableCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('TABLES__CREATE')")
        public ResponseEntity<RestResponseDTO<TableDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid TableCreateRequestDTO tableCreateRequestDTO) {
                TableDetailResponseDTO tableCreated = this.tableService.handleCreate(tableCreateRequestDTO);

                this.useTableService.handleCreateByTableCreated(
                                tableCreated.getRestaurant().getId(),
                                tableCreated.getId());

                return RestResponseUtils.created(
                                "Thêm bàn ăn thành công!",
                                tableCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('TABLES__UPDATE')")
        public ResponseEntity<RestResponseDTO<TableDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid TableUpdateRequestDTO tableUpdateRequestDTO) {
                TableDetailResponseDTO tableUpdated = this.tableService.handleUpdate(id, tableUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin bàn ăn thành công!",
                                tableUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('TABLES__DELETE')")
        public ResponseEntity<RestResponseDTO<TableDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid TableDeleteRequestDTO tableDeleteRequestDTO) {
                TableDetailResponseDTO tableDeleted = this.tableService.handleDelete(id, tableDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái bàn ăn thành công!",
                                tableDeleted);
        }
}