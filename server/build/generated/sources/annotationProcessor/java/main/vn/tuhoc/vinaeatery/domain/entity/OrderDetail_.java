package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(OrderDetail.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OrderDetail_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderDetail#quantity
	 **/
	public static volatile SingularAttribute<OrderDetail, Long> quantity;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderDetail#price
	 **/
	public static volatile SingularAttribute<OrderDetail, Long> price;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderDetail#id
	 **/
	public static volatile SingularAttribute<OrderDetail, OrderDetailId> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderDetail
	 **/
	public static volatile EntityType<OrderDetail> class_;

	public static final String QUANTITY = "quantity";
	public static final String PRICE = "price";
	public static final String ID = "id";

}

