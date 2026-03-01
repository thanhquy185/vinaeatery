package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CategoryIngredient.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CategoryIngredient_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient#name
	 **/
	public static volatile SingularAttribute<CategoryIngredient, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient#description
	 **/
	public static volatile SingularAttribute<CategoryIngredient, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient#updateAt
	 **/
	public static volatile SingularAttribute<CategoryIngredient, LocalDateTime> updateAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient#id
	 **/
	public static volatile SingularAttribute<CategoryIngredient, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient#restaurantId
	 **/
	public static volatile SingularAttribute<CategoryIngredient, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient
	 **/
	public static volatile EntityType<CategoryIngredient> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient#status
	 **/
	public static volatile SingularAttribute<CategoryIngredient, CommonStatusEnum> status;

	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String UPDATE_AT = "updateAt";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

