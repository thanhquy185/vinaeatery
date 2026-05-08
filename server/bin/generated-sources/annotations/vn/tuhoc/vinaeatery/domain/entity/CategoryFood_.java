package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CategoryFood.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CategoryFood_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryFood#image
	 **/
	public static volatile SingularAttribute<CategoryFood, String> image;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryFood#name
	 **/
	public static volatile SingularAttribute<CategoryFood, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryFood#description
	 **/
	public static volatile SingularAttribute<CategoryFood, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryFood#id
	 **/
	public static volatile SingularAttribute<CategoryFood, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryFood#restaurantId
	 **/
	public static volatile SingularAttribute<CategoryFood, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryFood
	 **/
	public static volatile EntityType<CategoryFood> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryFood#status
	 **/
	public static volatile SingularAttribute<CategoryFood, CommonStatusEnum> status;

	public static final String IMAGE = "image";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

