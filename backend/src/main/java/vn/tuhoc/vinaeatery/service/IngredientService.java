package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Ingredient_;
import vn.tuhoc.vinaeatery.domain.Ingredient;
import vn.tuhoc.vinaeatery.domain.criteria.IngredientCriteria;
import vn.tuhoc.vinaeatery.domain.dto.IngredientDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryIngredientRepository;
import vn.tuhoc.vinaeatery.repository.IngredientRepository;
import vn.tuhoc.vinaeatery.service.specification.IngredientSpecification;

@Service
@AllArgsConstructor
public class IngredientService {
    // Properties
    private final CategoryIngredientRepository categoryIngredientRepository;
    private final IngredientRepository ingredientRepository;

    // Methods
    public Ingredient getOneById(Integer id) {
        return this.ingredientRepository.findOneById(id);
    }

    public IngredientDTO getOneFormatById(Integer id) {
        IngredientDTO ingredientDTO = new IngredientDTO();
        Ingredient ingredient = getOneById(id);
        if (ingredient != null) {
            ingredientDTO.setId(ingredient.getId());
            ingredientDTO.setName(ingredient.getName());
            if (ingredient.getCategoryIngredientId() != null) {
                ingredientDTO.setCategoryIngredient(
                        categoryIngredientRepository.findOneById(ingredient.getCategoryIngredientId()));
            }
            ingredientDTO.setUnit(ingredient.getUnit());
            ingredientDTO.setCapacity(ingredient.getCapacity());
            ingredientDTO.setDateCreate(ingredient.getDateCreate());
            ingredientDTO.setDateRemove(ingredient.getDateRemove());
            ingredientDTO.setInputPrice(ingredient.getInputPrice());
            ingredientDTO.setInventory(ingredient.getInventory());
            ingredientDTO.setNote(ingredient.getNote());
            ingredientDTO.setStatus(ingredient.getStatus());
            ingredientDTO.setTimeUpdate(ingredient.getTimeUpdate());
        }

        return ingredientDTO;
    }

    public List<Ingredient> getAll() {
        return this.ingredientRepository.findAll();
    }

    public List<Ingredient> getAll(IngredientCriteria ingredientCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (ingredientCriteria.getSort() != null && ingredientCriteria.getSort().isPresent()) {
            String sortStr = ingredientCriteria.getSort().get();
            switch (sortStr) {
                case "Mã nguyên liệu tăng dần" -> sort = Sort.by(Ingredient_.ID).ascending();
                case "Mã nguyên liệu giảm dần" -> sort = Sort.by(Ingredient_.ID).descending();
                case "Tên nguyên liệu tăng dần" -> sort = Sort.by(Ingredient_.NAME).ascending();
                case "Tên nguyên liệu giảm dần" -> sort = Sort.by(Ingredient_.NAME).descending();
            }
        }

        //
        if (ingredientCriteria.getId() == null && ingredientCriteria.getName() == null
                && ingredientCriteria.getCategoryIngredientId() == null
                && ingredientCriteria.getStatus() == null
                && ingredientCriteria.getSort() == null) {
            return this.ingredientRepository.findAll(sort);
        }
        //
        Specification<Ingredient> combinedSpec = Specification.where(null);
        if (ingredientCriteria.getId() != null && ingredientCriteria.getId().isPresent()) {
            if (ingredientCriteria.getId().get().matches("\\d+")) {
                Specification<Ingredient> currentSpec = IngredientSpecification
                        .idEqual(ingredientCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (ingredientCriteria.getName() != null && ingredientCriteria.getName().isPresent()) {
            Specification<Ingredient> currentSpec = IngredientSpecification
                    .nameLike(ingredientCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (ingredientCriteria.getCategoryIngredientId() != null
                && ingredientCriteria.getCategoryIngredientId().isPresent()) {
            String[] listCategoryIngredientId = ingredientCriteria.getCategoryIngredientId().get().split(",");
            for (String categoryIngredientId : listCategoryIngredientId) {
                if (categoryIngredientId.matches("\\d+")) {
                    Specification<Ingredient> currentSpec = IngredientSpecification
                            .categoryIngredientIdEqual(categoryIngredientId);
                    combinedSpec = combinedSpec.or(currentSpec);
                }
            }
        }
        if (ingredientCriteria.getStatus() != null && ingredientCriteria.getStatus().isPresent()) {
            String statusString = ingredientCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Ingredient> currentSpec = IngredientSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.ingredientRepository.findAll(combinedSpec, sort);
    }

    public List<IngredientDTO> getAllFormat(IngredientCriteria ingredientCriteria) {
        List<IngredientDTO> listFormat = new ArrayList<>();
        for (Ingredient ingredient : getAll(ingredientCriteria)) {
            IngredientDTO ingredientDTO = new IngredientDTO();
            ingredientDTO.setId(ingredient.getId());
            ingredientDTO.setName(ingredient.getName());
            if (ingredient.getCategoryIngredientId() != null) {
                ingredientDTO.setCategoryIngredient(
                        categoryIngredientRepository.findOneById(ingredient.getCategoryIngredientId()));
            }
            ingredientDTO.setUnit(ingredient.getUnit());
            ingredientDTO.setCapacity(ingredient.getCapacity());
            ingredientDTO.setDateCreate(ingredient.getDateCreate());
            ingredientDTO.setDateRemove(ingredient.getDateRemove());
            ingredientDTO.setInputPrice(ingredient.getInputPrice());
            ingredientDTO.setInventory(ingredient.getInventory());
            ingredientDTO.setNote(ingredient.getNote());
            ingredientDTO.setStatus(ingredient.getStatus());
            ingredientDTO.setTimeUpdate(ingredient.getTimeUpdate());

            listFormat.add(ingredientDTO);
        }

        return listFormat;
    }

    public List<Ingredient> getAllByCategoryIngredientId(Integer categoryIngredientId) {
        return this.ingredientRepository.findAllByCategoryIngredientId(categoryIngredientId);
    }

    public Ingredient upsert(Ingredient ingredient) {
        return this.ingredientRepository.save(ingredient);
    }

    public void delete(Integer id) {
        this.ingredientRepository.deleteById(id);
    }

    public void lock(Ingredient ingredient) {
        this.ingredientRepository.save(ingredient);
    }
}