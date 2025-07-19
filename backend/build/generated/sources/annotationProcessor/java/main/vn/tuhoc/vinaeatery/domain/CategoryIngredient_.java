package vn.tuhoc.vinaeatery.domain;

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
	 * @see vn.tuhoc.vinaeatery.domain.CategoryIngredient#timeUpdate
	 **/
	public static volatile SingularAttribute<CategoryIngredient, LocalDateTime> timeUpdate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryIngredient#name
	 **/
	public static volatile SingularAttribute<CategoryIngredient, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryIngredient#description
	 **/
	public static volatile SingularAttribute<CategoryIngredient, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryIngredient#id
	 **/
	public static volatile SingularAttribute<CategoryIngredient, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryIngredient
	 **/
	public static volatile EntityType<CategoryIngredient> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryIngredient#status
	 **/
	public static volatile SingularAttribute<CategoryIngredient, CommonStatusEnum> status;

	public static final String TIME_UPDATE = "timeUpdate";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String STATUS = "status";

}

