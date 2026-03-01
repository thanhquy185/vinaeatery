package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Recipe.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Recipe_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Recipe#note
	 **/
	public static volatile SingularAttribute<Recipe, String> note;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Recipe#quantity
	 **/
	public static volatile SingularAttribute<Recipe, Long> quantity;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Recipe#id
	 **/
	public static volatile SingularAttribute<Recipe, RecipeId> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Recipe
	 **/
	public static volatile EntityType<Recipe> class_;

	public static final String NOTE = "note";
	public static final String QUANTITY = "quantity";
	public static final String ID = "id";

}

