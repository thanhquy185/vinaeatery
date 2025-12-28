package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.FoodStatusEnum;

@StaticMetamodel(Food.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Food_ {

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#categoryFoodId
	 **/
	public static volatile SingularAttribute<Food, Integer> categoryFoodId;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#image
	 **/
	public static volatile SingularAttribute<Food, String> image;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#unit
	 **/
	public static volatile SingularAttribute<Food, String> unit;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#updateAt
	 **/
	public static volatile SingularAttribute<Food, LocalDateTime> updateAt;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#price
	 **/
	public static volatile SingularAttribute<Food, Long> price;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#name
	 **/
	public static volatile SingularAttribute<Food, String> name;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#description
	 **/
	public static volatile SingularAttribute<Food, String> description;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#id
	 **/
	public static volatile SingularAttribute<Food, Integer> id;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food
	 **/
	public static volatile EntityType<Food> class_;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Food#status
	 **/
	public static volatile SingularAttribute<Food, FoodStatusEnum> status;

	public static final String CATEGORY_FOOD_ID = "categoryFoodId";
	public static final String IMAGE = "image";
	public static final String UNIT = "unit";
	public static final String TIME_UPDATE = "updateAt";
	public static final String PRICE = "price";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String STATUS = "status";

}
