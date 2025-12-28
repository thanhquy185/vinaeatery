package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(OrderSheetDetail.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OrderSheetDetail_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderSheetDetail#quantity
	 **/
	public static volatile SingularAttribute<OrderSheetDetail, Long> quantity;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderSheetDetail#price
	 **/
	public static volatile SingularAttribute<OrderSheetDetail, Long> price;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderSheetDetail#id
	 **/
	public static volatile SingularAttribute<OrderSheetDetail, OrderSheetDetailId> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.OrderSheetDetail
	 **/
	public static volatile EntityType<OrderSheetDetail> class_;

	public static final String QUANTITY = "quantity";
	public static final String PRICE = "price";
	public static final String ID = "id";

}

