package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(RestaurantImageId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class RestaurantImageId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RestaurantImageId#image
	 **/
	public static volatile SingularAttribute<RestaurantImageId, String> image;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RestaurantImageId#restaurantId
	 **/
	public static volatile SingularAttribute<RestaurantImageId, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RestaurantImageId
	 **/
	public static volatile EmbeddableType<RestaurantImageId> class_;

	public static final String IMAGE = "image";
	public static final String RESTAURANT_ID = "restaurantId";

}

