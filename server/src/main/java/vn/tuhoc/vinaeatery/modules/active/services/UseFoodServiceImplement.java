package vn.tuhoc.vinaeatery.modules.active.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.UseFoodMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseFoodUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseFoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseFoodRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.UseFoodCriteria;
import vn.tuhoc.vinaeatery.modules.active.repositories.specifications.UseFoodSpecification;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.UseFoodService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.TimeService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseFoodServiceImplement implements UseFoodService {
    final TimeService timeService;
    final UseFoodRepository useFoodRepository;
    final UseFoodMapper useFoodMapper;

    private UseFoodEntity getOneById(Integer id) {
        return this.useFoodRepository.findOneById(id)
                .orElseThrow(() -> new UseFoodNotFoundByIdException(id));
    }

    private Page<UseFoodEntity> getAll(UseFoodCriteria useFoodCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(useFoodCriteria.getSort())) {
            String sortString = useFoodCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "start_at__asc" -> sort = Sort.by("startAt").ascending();
                case "start_at__desc" -> sort = Sort.by("startAt").descending();
                case "end_at__asc" -> sort = Sort.by("endAt").ascending();
                case "end_at__desc" -> sort = Sort.by("endAt").descending();
                case "food_id__asc" -> sort = Sort.by("food.id").ascending();
                case "food_id__desc" -> sort = Sort.by("food.id").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(useFoodCriteria.getPage())
                && ValidationUtil.nonNull(useFoodCriteria.getSize())) {
            pageable = PageRequest.of(
                    useFoodCriteria.getPage(),
                    useFoodCriteria.getSize(),
                    sort);
        }

        Specification<UseFoodEntity> specification = UseFoodSpecification.filterUseFoods(useFoodCriteria);

        return this.useFoodRepository.findAll(specification, pageable);
    }

    @Override
    public UseFoodDetailResponseDTO handleGetDetailById(Integer id) {
        return this.useFoodMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    public PageResponseDTO<UseFoodSummaryResponseDTO> handleGetSummary(UseFoodCriteria useFoodCriteria) {
        Page<UseFoodSummaryResponseDTO> page = this.getAll(useFoodCriteria)
                .map(this.useFoodMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    public UseFoodDetailResponseDTO handleCreate(UseFoodCreateRequestDTO useFoodCreateRequestDTO) {
        UseFoodEntity useFoodEntity = this.useFoodMapper.createEntityFromRequest(useFoodCreateRequestDTO);

        return this.useFoodMapper.entityToDetailResponse(this.useFoodRepository.save(useFoodEntity));
    }

    @Override
    public UseFoodDetailResponseDTO handleCreateByFoodCreated(
            Integer restaurantId,
            Integer foodId,
            Integer employeeId) {
        UseFoodCreateRequestDTO useFoodCreateRequestDTO = UseFoodCreateRequestDTO.builder()
                .restaurantId(restaurantId)
                .employeeId(employeeId)
                .foodId(foodId)
                .startAt(this.timeService.getCurrentDatetime())
                .status(UseFoodStatusEnum.CAN_NOT_ORDER)
                .build();
        UseFoodEntity useFoodEntity = this.useFoodMapper.createEntityFromRequest(useFoodCreateRequestDTO);

        return this.useFoodMapper.entityToDetailResponse(this.useFoodRepository.save(useFoodEntity));
    }

    @Override
    public UseFoodDetailResponseDTO handleUpdateStatus(
            Integer id,
            UseFoodUpdateStatusRequestDTO useFoodUpdateStatusRequestDTO) {
        UseFoodEntity useFoodEntityUpdated = this.getOneById(id);
        this.useFoodMapper.updateStatusEntityFromRequest(
                useFoodUpdateStatusRequestDTO,
                useFoodEntityUpdated);

        UseFoodCreateRequestDTO useFoodCreateRequestDTO = UseFoodCreateRequestDTO.builder()
                .restaurantId(useFoodEntityUpdated.getRestaurant().getId())
                .foodId(useFoodEntityUpdated.getFood().getId())
                .employeeId(useFoodUpdateStatusRequestDTO.getEmployeeId())
                .startAt(this.timeService.getCurrentDatetime())
                .status(useFoodUpdateStatusRequestDTO.getStatus())
                .build();
        UseFoodEntity useFoodEntityCreated = this.useFoodMapper.createEntityFromRequest(useFoodCreateRequestDTO);

        return this.useFoodMapper.entityToDetailResponse(this.useFoodRepository.save(useFoodEntityCreated));
    }
}
