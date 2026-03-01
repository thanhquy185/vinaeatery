package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(OrderDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OrderDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderDetailId#orderId
	 **/
	public static volatile SingularAttribute<OrderDetailId, Integer> orderId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderDetailId#foodId
	 **/
	public static volatile SingularAttribute<OrderDetailId, Integer> foodId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderDetailId
	 **/
	public static volatile EmbeddableType<OrderDetailId> class_;

	public static final String ORDER_ID = "orderId";
	public static final String FOOD_ID = "foodId";

}

