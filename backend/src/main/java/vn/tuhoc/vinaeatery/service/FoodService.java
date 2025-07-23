package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Food_;
import vn.tuhoc.vinaeatery.domain.Recipe;
import vn.tuhoc.vinaeatery.domain.Food;
import vn.tuhoc.vinaeatery.domain.Ingredient;
import vn.tuhoc.vinaeatery.domain.criteria.FoodCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FoodDTO;
import vn.tuhoc.vinaeatery.domain.dto.IngredientDTO;
import vn.tuhoc.vinaeatery.domain.dto.RecipeDTO;
import vn.tuhoc.vinaeatery.domain.enumm.FoodStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryFoodRepository;
import vn.tuhoc.vinaeatery.repository.FoodRepository;
import vn.tuhoc.vinaeatery.repository.IngredientRepository;
import vn.tuhoc.vinaeatery.repository.RecipeRepository;
import vn.tuhoc.vinaeatery.service.specification.FoodSpecification;

@Service
@AllArgsConstructor
public class FoodService {
    // Properties
    private final IngredientRepository ingredientRepository;
    private final CategoryFoodRepository categoryFoodRepository;
    private final FoodRepository foodRepository;
    private final RecipeRepository recipeRepository;

    // Methods
    public Food getOneById(Integer id) {
        return this.foodRepository.findOneById(id);
    }

    public FoodDTO getOneFormatById(Integer id) {
        Food food = getOneById(id);
        FoodDTO foodDTO = new FoodDTO();

        if (food != null) {
            List<RecipeDTO> recipeDTO = new ArrayList<>();
            for (Recipe recipe : recipeRepository.findAllByFoodId(food.getId())) {
                Ingredient ingredient = ingredientRepository.findOneById(recipe.getId().getIngredientId());
                recipeDTO.add(new RecipeDTO(ingredient.getId(), ingredient.getName(), ingredient.getInventory(),
                        recipe.getQuantity(), ingredient.getNote()));
            }

            foodDTO.setId(food.getId());
            foodDTO.setImage(food.getImage());
            foodDTO.setName(food.getName());
            foodDTO.setCategoryFood(categoryFoodRepository.findOneById(food.getCategoryFoodId()));
            foodDTO.setPrice(food.getPrice());
            foodDTO.setUnit(food.getUnit());
            foodDTO.setDescription(food.getDescription());
            foodDTO.setStatus(food.getStatus());
            foodDTO.setTimeUpdate(food.getTimeUpdate());
            foodDTO.setRecipe(recipeDTO);
        }

        return foodDTO;
    }

    public Food getLastOne() {
        return this.foodRepository.findLastOne();
    }

    public List<Food> getAll() {
        return this.foodRepository.findAll();
    }

    public List<Food> getAll(FoodCriteria foodCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (foodCriteria.getSort() != null && foodCriteria.getSort().isPresent()) {
            String sortStr = foodCriteria.getSort().get();
            switch (sortStr) {
                case "Mã món ăn tăng dần" -> sort = Sort.by(Food_.ID).ascending();
                case "Mã món ăn giảm dần" -> sort = Sort.by(Food_.ID).descending();
                case "Tên món ăn tăng dần" -> sort = Sort.by(Food_.NAME).ascending();
                case "Tên món ăn giảm dần" -> sort = Sort.by(Food_.NAME).descending();
            }
        }

        //
        if (foodCriteria.getId() == null && foodCriteria.getName() == null
                && foodCriteria.getCategoryFoodId() == null
                && foodCriteria.getStatus() == null
                && foodCriteria.getSort() == null) {
            return this.foodRepository.findAll(sort);
        }
        //
        Specification<Food> combinedSpec = Specification.where(null);
        if (foodCriteria.getId() != null && foodCriteria.getId().isPresent()) {
            if (foodCriteria.getId().get().matches("\\d+")) {
                Specification<Food> currentSpec = FoodSpecification
                        .idEqual(foodCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (foodCriteria.getName() != null && foodCriteria.getName().isPresent()) {
            Specification<Food> currentSpec = FoodSpecification
                    .nameLike(foodCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (foodCriteria.getCategoryFoodId() != null
                && foodCriteria.getCategoryFoodId().isPresent()) {
            String[] listCategoryFoodId = foodCriteria.getCategoryFoodId().get().split(",");
            for (String categoryFoodId : listCategoryFoodId) {
                if (categoryFoodId.matches("\\d+")) {
                    Specification<Food> currentSpec = FoodSpecification
                            .categoryFoodIdEqual(categoryFoodId);
                    combinedSpec = combinedSpec.or(currentSpec);
                }
            }
        }
        if (foodCriteria.getStatus() != null && foodCriteria.getStatus().isPresent()) {
            String statusString = foodCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (FoodStatusEnum foodStatus : FoodStatusEnum.values()) {
                if (foodStatus.getDescription().equals(statusString)) {
                    statusBoolean = foodStatus.getValue();
                    break;
                }
            }
            Specification<Food> currentSpec = FoodSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.foodRepository.findAll(combinedSpec, sort);
    }

    public List<FoodDTO> getAllFormat(FoodCriteria foodCriteria) {
        List<FoodDTO> listFoodFormat = new ArrayList<>();
        for (Food food : getAll(foodCriteria)) {
            List<RecipeDTO> recipeDTO = new ArrayList<>();
            for (Recipe recipe : recipeRepository.findAllByFoodId(food.getId())) {
                Ingredient ingredient = ingredientRepository.findOneById(recipe.getId().getIngredientId());
                recipeDTO.add(new RecipeDTO(ingredient.getId(), ingredient.getName(), ingredient.getInventory(),
                        recipe.getQuantity(), ingredient.getNote()));
            }

            FoodDTO newFood = new FoodDTO();
            newFood.setId(food.getId());
            newFood.setImage(food.getImage());
            newFood.setName(food.getName());
            newFood.setCategoryFood(categoryFoodRepository.findOneById(food.getCategoryFoodId()));
            newFood.setPrice(food.getPrice());
            newFood.setUnit(food.getUnit());
            newFood.setDescription(food.getDescription());
            newFood.setStatus(food.getStatus());
            newFood.setTimeUpdate(food.getTimeUpdate());
            newFood.setRecipe(recipeDTO);

            listFoodFormat.add(newFood);
        }

        return listFoodFormat;
    }

    public List<Food> getAllByCategoryFoodId(Integer categoryFoodId) {
        return this.foodRepository.findAllByCategoryFoodId(categoryFoodId);
    }

    public Food upsert(Food Food) {
        return this.foodRepository.save(Food);
    }

    public void delete(Integer id) {
        this.foodRepository.deleteById(id);
    }

    public void lock(Food Food) {
        this.foodRepository.save(Food);
    }
}