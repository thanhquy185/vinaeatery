package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Recipe;
import vn.tuhoc.vinaeatery.domain.RecipeId;
import vn.tuhoc.vinaeatery.repository.RecipeRepository;

@Service
@RequiredArgsConstructor
public class RecipeService {
    // Properties
    private final RecipeRepository recipeRepository;

    // Methods
    public Recipe getOneById(RecipeId id) {
        return this.recipeRepository.findOneById(id);
    }

    public List<Recipe> getAll() {
        return this.recipeRepository.findAll();
    }

    public List<Recipe> getAllByFoodId(Integer foodId) {
        return this.recipeRepository.findAllByFoodId(foodId);
    }

    public Recipe upsert(Recipe recipe) {
        return this.recipeRepository.save(recipe);
    }

    public void delete(RecipeId id) {
        this.recipeRepository.deleteById(id);
    }

    public void deleteAllByFoodId(Integer foodId) {
        this.recipeRepository.deleteAllByFoodId(foodId);
    }

    public void lock(Recipe recipe) {
        this.recipeRepository.save(recipe);
    }
}
