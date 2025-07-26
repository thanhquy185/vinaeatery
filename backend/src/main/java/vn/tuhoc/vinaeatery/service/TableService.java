package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.TableE_;
import vn.tuhoc.vinaeatery.domain.Ingredient;
import vn.tuhoc.vinaeatery.domain.TableE;
import vn.tuhoc.vinaeatery.domain.criteria.TableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.IngredientDTO;
import vn.tuhoc.vinaeatery.domain.dto.TableDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryTableRepository;
import vn.tuhoc.vinaeatery.repository.FloorRepository;
import vn.tuhoc.vinaeatery.repository.TableRepository;
import vn.tuhoc.vinaeatery.service.specification.TableSpecification;

@Service
@AllArgsConstructor
public class TableService {
    // Properties
    private final FloorRepository floorRepository;
    private final CategoryTableRepository categoryTableRepository;
    private final TableRepository tableRepository;

    // Methods
    public TableE getOneById(Integer id) {
        return this.tableRepository.findOneById(id);
    }

    public TableDTO getOneFormatById(Integer id) {
        TableDTO tableDTO = new TableDTO();
        TableE table = getOneById(id);
        if (table != null) {
            tableDTO.setId(table.getId());
            tableDTO.setName(table.getName());
            if (table.getCategoryTableId() != null) {
                tableDTO.setCategoryTable(categoryTableRepository.findOneById(table.getCategoryTableId()));
            }
            if (table.getFloorId() != null) {
                tableDTO.setFloor(floorRepository.findOneById(table.getFloorId()));
            }
            tableDTO.setSeats(table.getSeats());
            tableDTO.setDescription(table.getDescription());
            tableDTO.setStatus(table.getStatus());
            tableDTO.setTimeUpdate(table.getTimeUpdate());
        }

        return tableDTO;
    }

    public List<TableE> getAll() {
        return this.tableRepository.findAll();
    }

    public List<TableE> getAll(TableCriteria tableCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (tableCriteria.getSort() != null && tableCriteria.getSort().isPresent()) {
            String sortStr = tableCriteria.getSort().get();
            switch (sortStr) {
                case "Mã bàn tăng dần" -> sort = Sort.by(TableE_.ID).ascending();
                case "Mã bàn giảm dần" -> sort = Sort.by(TableE_.ID).descending();
                case "Tên bàn tăng dần" -> sort = Sort.by(TableE_.NAME).ascending();
                case "Tên bàn giảm dần" -> sort = Sort.by(TableE_.NAME).descending();
            }
        }

        //
        if (tableCriteria.getId() == null && tableCriteria.getName() == null
                && tableCriteria.getCategoryTableId() == null
                && tableCriteria.getStatus() == null
                && tableCriteria.getSort() == null) {
            return this.tableRepository.findAll(sort);
        }
        //
        Specification<TableE> combinedSpec = Specification.where(null);
        if (tableCriteria.getId() != null && tableCriteria.getId().isPresent()) {
            if (tableCriteria.getId().get().matches("\\d+")) {
                Specification<TableE> currentSpec = TableSpecification
                        .idEqual(tableCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (tableCriteria.getName() != null && tableCriteria.getName().isPresent()) {
            Specification<TableE> currentSpec = TableSpecification
                    .nameLike(tableCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (tableCriteria.getCategoryTableId() != null
                && tableCriteria.getCategoryTableId().isPresent()) {
            String[] listCategoryTableId = tableCriteria.getCategoryTableId().get().split(",");
            for (String categoryTableId : listCategoryTableId) {
                if (categoryTableId.matches("\\d+")) {
                    Specification<TableE> currentSpec = TableSpecification
                            .categoryTableIdEqual(categoryTableId);
                    combinedSpec = combinedSpec.or(currentSpec);
                }
            }
        }
        if (tableCriteria.getFloorId() != null
                && tableCriteria.getFloorId().isPresent()) {
            String[] listFloorId = tableCriteria.getFloorId().get().split(",");
            for (String floorId : listFloorId) {
                if (floorId.matches("\\d+")) {
                    Specification<TableE> currentSpec = TableSpecification.floorIdEqual(floorId);
                    combinedSpec = combinedSpec.or(currentSpec);
                }
            }
        }
        if (tableCriteria.getStatus() != null && tableCriteria.getStatus().isPresent()) {
            String statusString = tableCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<TableE> currentSpec = TableSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.tableRepository.findAll(combinedSpec, sort);
    }

    public List<TableDTO> getAllFormat(TableCriteria tableCriteria) {
        List<TableDTO> listFormat = new ArrayList<>();
        for (TableE table : getAll(tableCriteria)) {
            TableDTO tableDTO = new TableDTO();
            tableDTO.setId(table.getId());
            tableDTO.setName(table.getName());
            if (table.getCategoryTableId() != null) {
                tableDTO.setCategoryTable(categoryTableRepository.findOneById(table.getCategoryTableId()));
            }
            if (table.getFloorId() != null) {
                tableDTO.setFloor(floorRepository.findOneById(table.getFloorId()));
            }
            tableDTO.setSeats(table.getSeats());
            tableDTO.setDescription(table.getDescription());
            tableDTO.setStatus(table.getStatus());
            tableDTO.setTimeUpdate(table.getTimeUpdate());

            listFormat.add(tableDTO);
        }

        return listFormat;
    }

    public List<TableE> getAllByCategoryTableId(Integer categoryTableId) {
        return this.tableRepository.findAllByCategoryTableId(categoryTableId);
    }

    public TableE upsert(TableE Table) {
        return this.tableRepository.save(Table);
    }

    public void delete(Integer id) {
        this.tableRepository.deleteById(id);
    }

    public void lock(TableE Table) {
        this.tableRepository.save(Table);
    }
}