package vn.tuhoc.vinaeatery.modules.active.services;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.MenuDetailMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.MenuMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.MenuNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.repositories.MenuRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.MenuCriteria;
import vn.tuhoc.vinaeatery.modules.active.repositories.specifications.MenuSpecification;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.MenuService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MenuServiceImplement implements MenuService {
    EntityManager entityManager;
    MenuRepository menuRepository;
    MenuMapper menuMapper;
    MenuDetailMapper menuDetailMapper;

    private MenuEntity getOneById(Integer id) {
        return this.menuRepository.findOneById(id)
                .orElseThrow(() -> new MenuNotFoundByIdException(id));
    }

    private Page<MenuEntity> getAll(MenuCriteria menuCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(menuCriteria.getSort())) {
            String sortString = menuCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
                case "price__asc" -> sort = Sort.by("price").ascending();
                case "price__desc" -> sort = Sort.by("price").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(menuCriteria.getPage())
                && ValidationUtil.nonNull(menuCriteria.getSize())) {
            pageable = PageRequest.of(
                    menuCriteria.getPage(),
                    menuCriteria.getSize(),
                    sort);
        }

        Specification<MenuEntity> specification = MenuSpecification.filterMenus(menuCriteria);

        return this.menuRepository.findAll(specification, pageable);
    }

    @Override
    @Cacheable(value = "menu__detail", key = "#id", unless = "#result == null")
    public MenuDetailResponseDTO handleGetDetailById(Integer id) {
        return this.menuMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "menu__summary", key = "#menuCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<MenuSummaryResponseDTO> handleGetSummary(MenuCriteria menuCriteria) {
        Page<MenuSummaryResponseDTO> page = this.getAll(menuCriteria).map(this.menuMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "menu__detail", key = "#result.id"),
            @CacheEvict(value = "menu__summary", allEntries = true),
    })
    public MenuDetailResponseDTO handleCreate(MenuCreateRequestDTO menuCreateRequestDTO) {
        MenuEntity menuEntity = this.menuMapper.createEntityFromRequest(menuCreateRequestDTO);

        menuCreateRequestDTO.getMenuDetails().forEach((menuDetailCreateRequestDTO) -> {
            MenuDetailEntity menuDetailEntity = this.menuDetailMapper
                    .createEntityFromRequest(menuDetailCreateRequestDTO);

            menuEntity.addMenuDetail(menuDetailEntity);
        });

        return this.menuMapper.entityToDetailResponse(this.menuRepository.save(menuEntity));
    }

    @Override
    @Caching(put = {
            @CachePut(value = "menu__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "menu__summary", allEntries = true),
    })
    public MenuDetailResponseDTO handleUpdate(
            Integer id,
            MenuUpdateRequestDTO menuUpdateRequestDTO) {
        MenuEntity menuEntity = this.getOneById(id);
        this.menuMapper.updateStatusEntityFromRequest(
                menuUpdateRequestDTO,
                menuEntity);

        menuEntity.getMenuDetails().clear();
        this.entityManager.flush();

        menuUpdateRequestDTO.getMenuDetails().forEach((menuDetailUpdateRequestDTO) -> {
            MenuDetailEntity menuDetailEntity = this.menuDetailMapper
                    .updateEntityFromRequest(menuDetailUpdateRequestDTO);

            menuEntity.addMenuDetail(menuDetailEntity);
        });

        return this.menuMapper.entityToDetailResponse(menuEntity);
    }

    @Override
    @Caching(put = {
            @CachePut(value = "menu__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "menu__summary", allEntries = true),
    })
    public MenuDetailResponseDTO handleDelete(Integer id, MenuDeleteRequestDTO menuDeleteRequestDTO) {
        MenuEntity menuEntity = this.getOneById(id);
        this.menuMapper.deleteEntityFromRequest(menuDeleteRequestDTO, menuEntity);

        return this.menuMapper.entityToDetailResponse(menuEntity);
    }
}