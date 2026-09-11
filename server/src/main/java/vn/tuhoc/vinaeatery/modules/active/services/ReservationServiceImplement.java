package vn.tuhoc.vinaeatery.modules.active.services;

import java.util.List;
import java.util.stream.Collectors;

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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.ReservationMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationCustomerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.ReservationNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.ReservationRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.ReservationCriteria;
import vn.tuhoc.vinaeatery.modules.active.repositories.specifications.ReservationSpecification;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.ReservationService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationServiceImplement implements ReservationService {
    final ReservationRepository reservationRepository;
    final ReservationMapper reservationMapper;

    private ReservationEntity getOneById(Integer id) {
        return this.reservationRepository.findOneById(id)
                .orElseThrow(() -> new ReservationNotFoundByIdException(id));
    }

    private Page<ReservationEntity> getAll(ReservationCriteria reservationCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(reservationCriteria.getSort())) {
            String sortString = reservationCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "create_at__asc" -> sort = Sort.by("createAt").ascending();
                case "create_at__desc" -> sort = Sort.by("createAt").descending();
                case "arrive_at__asc" -> sort = Sort.by("arriveAt").ascending();
                case "arrive_at__desc" -> sort = Sort.by("arriveAt").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(reservationCriteria.getPage())
                && ValidationUtil.nonNull(reservationCriteria.getSize())) {
            pageable = PageRequest.of(
                    reservationCriteria.getPage(),
                    reservationCriteria.getSize(),
                    sort);
        }

        Specification<ReservationEntity> specification = ReservationSpecification
                .filterReservations(reservationCriteria);

        return this.reservationRepository.findAll(specification, pageable);
    }

    private List<ReservationEntity> getAllCrud() {
        return this.reservationRepository.findAllCrud();
    }

    private List<ReservationEntity> getAllCrud(Integer restaurantId) {
        return this.reservationRepository.findAllCrud(restaurantId);
    }

    @Cacheable(value = "reservation__detail", key = "#id", unless = "#result == null")
    @Override
    public ReservationDetailResponseDTO handleGetDetailById(Integer id) {
        return this.reservationMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Cacheable(value = "reservation__summary", key = "#reservationCriteria.getCacheKey()", unless = "#result == null")
    @Override
    public PageResponseDTO<ReservationSummaryResponseDTO> handleGetSummary(ReservationCriteria reservationCriteria) {
        Page<ReservationSummaryResponseDTO> page = this.getAll(reservationCriteria)
                .map(this.reservationMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "reservation__customer", key = "#reservationCriteria.getCacheKey()", unless = "#result == null")
    @Override
    public PageResponseDTO<ReservationCustomerResponseDTO> handleGetAllByCustomerId(
            ReservationCriteria reservationCriteria) {
        Page<ReservationCustomerResponseDTO> page = this.getAll(reservationCriteria)
                .map(this.reservationMapper::entityToCustomerResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "reservation__crud_all", unless = "#result == null")
    @Override
    public List<ReservationCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.reservationMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "reservation__crud", key = "#restaurantId", unless = "#result == null")
    @Override
    public List<ReservationCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.reservationMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Caching(evict = {
            @CacheEvict(value = "reservation__detail", key = "#result.id"),
            @CacheEvict(value = "reservation__summary", allEntries = true),
            @CacheEvict(value = "reservation__crud_all", allEntries = true),
            @CacheEvict(value = "reservation__crud", allEntries = true)
    })
    @Override
    public ReservationDetailResponseDTO handleCreate(ReservationCreateRequestDTO reservationCreateRequestDTO) {
        ReservationEntity reservationEntity = this.reservationMapper
                .createEntityFromRequest(reservationCreateRequestDTO);

        return this.reservationMapper.entityToDetailResponse(this.reservationRepository.save(reservationEntity));
    }

    @Caching(evict = {
            @CacheEvict(value = "reservation__detail", key = "#result.id"),
            @CacheEvict(value = "reservation__summary", allEntries = true),
            @CacheEvict(value = "reservation__customer", allEntries = true),
            @CacheEvict(value = "reservation__crud_all", allEntries = true),
            @CacheEvict(value = "reservation__crud", allEntries = true)
    })
    @Override
    public ReservationDetailResponseDTO handleCustomerCreate(
            ReservationCustomerCreateRequestDTO reservationCustomerCreateRequestDTO) {
        ReservationEntity reservationEntity = this.reservationMapper
                .createEntityFromCustomerRequest(reservationCustomerCreateRequestDTO);

        return this.reservationMapper.entityToDetailResponse(this.reservationRepository.save(reservationEntity));
    }

    @Caching(put = {
            @CachePut(value = "reservation__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "reservation__summary", allEntries = true),
            @CacheEvict(value = "reservation__customer", allEntries = true),
            @CacheEvict(value = "reservation__crud_all", allEntries = true),
            @CacheEvict(value = "reservation__crud", allEntries = true)
    })
    @Override
    public ReservationDetailResponseDTO handleUpdateStatus(
            Integer id,
            ReservationUpdateStatusRequestDTO reservationUpdateStatusRequestDTO) {
        ReservationEntity reservationEntity = this.getOneById(id);
        this.reservationMapper.updateStatusEntityFromRequest(
                reservationUpdateStatusRequestDTO,
                reservationEntity);

        return this.reservationMapper.entityToDetailResponse(reservationEntity);
    }
}