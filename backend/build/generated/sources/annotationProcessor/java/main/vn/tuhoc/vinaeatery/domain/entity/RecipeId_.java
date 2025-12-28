package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(RecipeId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class RecipeId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RecipeId#ingredientId
	 **/
	public static volatile SingularAttribute<RecipeId, Integer> ingredientId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RecipeId#foodId
	 **/
	public static volatile SingularAttribute<RecipeId, Integer> foodId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RecipeId
	 **/
	public static volatile EmbeddableType<RecipeId> class_;

	public static final String INGREDIENT_ID = "ingredientId";
	public static final String FOOD_ID = "foodId";

}

