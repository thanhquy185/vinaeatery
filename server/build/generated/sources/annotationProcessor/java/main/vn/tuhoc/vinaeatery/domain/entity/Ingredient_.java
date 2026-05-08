package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Ingredient.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Ingredient_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#note
	 **/
	public static volatile SingularAttribute<Ingredient, String> note;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#restaurantId
	 **/
	public static volatile SingularAttribute<Ingredient, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#dateCreate
	 **/
	public static volatile SingularAttribute<Ingredient, String> dateCreate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#inventory
	 **/
	public static volatile SingularAttribute<Ingredient, Long> inventory;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#inputPrice
	 **/
	public static volatile SingularAttribute<Ingredient, Long> inputPrice;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#capacity
	 **/
	public static volatile SingularAttribute<Ingredient, Long> capacity;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#unit
	 **/
	public static volatile SingularAttribute<Ingredient, String> unit;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#name
	 **/
	public static volatile SingularAttribute<Ingredient, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#dateRemove
	 **/
	public static volatile SingularAttribute<Ingredient, String> dateRemove;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#id
	 **/
	public static volatile SingularAttribute<Ingredient, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#categoryIngredientId
	 **/
	public static volatile SingularAttribute<Ingredient, Integer> categoryIngredientId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient
	 **/
	public static volatile EntityType<Ingredient> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Ingredient#status
	 **/
	public static volatile SingularAttribute<Ingredient, CommonStatusEnum> status;

	public static final String NOTE = "note";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String DATE_CREATE = "dateCreate";
	public static final String INVENTORY = "inventory";
	public static final String INPUT_PRICE = "inputPrice";
	public static final String CAPACITY = "capacity";
	public static final String UNIT = "unit";
	public static final String NAME = "name";
	public static final String DATE_REMOVE = "dateRemove";
	public static final String ID = "id";
	public static final String CATEGORY_INGREDIENT_ID = "categoryIngredientId";
	public static final String STATUS = "status";

}

