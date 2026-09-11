package vn.tuhoc.vinaeatery.modules.active.controllers;

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
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.MenuCriteria;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.MenuService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MenuController {
        final MenuService menuService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('MENUS__READ')")
        public ResponseEntity<RestResponseDTO<MenuDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                MenuDetailResponseDTO menuDetail = this.menuService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn thực đơn theo mã thực đơn thành công!",
                                menuDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('MENUS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<MenuSummaryResponseDTO>>> handleGetSummary(
                        MenuCriteria menuCriteria) {
                PageResponseDTO<MenuSummaryResponseDTO> menuSummary = this.menuService.handleGetSummary(menuCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách thực đơn thành công!",
                                menuSummary);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('MENUS__CREATE')")
        public ResponseEntity<RestResponseDTO<MenuDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid MenuCreateRequestDTO menuCreateRequestDTO) {
                MenuDetailResponseDTO menuCreated = this.menuService.handleCreate(menuCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm thực đơn thành công!",
                                menuCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('MENUS__UPDATE')")
        public ResponseEntity<RestResponseDTO<MenuDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid MenuUpdateRequestDTO menuUpdateRequestDTO) {
                MenuDetailResponseDTO menuUpdated = this.menuService.handleUpdate(id, menuUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin thực đơn thành công!",
                                menuUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('MENUS__DELETE')")
        public ResponseEntity<RestResponseDTO<MenuDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid MenuDeleteRequestDTO menuDeleteRequestDTO) {
                MenuDetailResponseDTO menuDeleted = this.menuService.handleDelete(id, menuDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái thực đơn thành công!",
                                menuDeleted);
        }
}