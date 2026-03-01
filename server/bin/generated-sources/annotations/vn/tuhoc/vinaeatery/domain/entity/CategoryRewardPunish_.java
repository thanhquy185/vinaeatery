package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryRewardPunishHandleEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CategoryRewardPunish.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CategoryRewardPunish_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish#name
	 **/
	public static volatile SingularAttribute<CategoryRewardPunish, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish#description
	 **/
	public static volatile SingularAttribute<CategoryRewardPunish, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish#updateAt
	 **/
	public static volatile SingularAttribute<CategoryRewardPunish, String> updateAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish#handle
	 **/
	public static volatile SingularAttribute<CategoryRewardPunish, CategoryRewardPunishHandleEnum> handle;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish#id
	 **/
	public static volatile SingularAttribute<CategoryRewardPunish, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish#restaurantId
	 **/
	public static volatile SingularAttribute<CategoryRewardPunish, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish
	 **/
	public static volatile EntityType<CategoryRewardPunish> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish#status
	 **/
	public static volatile SingularAttribute<CategoryRewardPunish, CommonStatusEnum> status;

	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String UPDATE_AT = "updateAt";
	public static final String HANDLE = "handle";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

