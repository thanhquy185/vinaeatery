package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(OrderSheetDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OrderSheetDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheetDetailId#foodId
	 **/
	public static volatile SingularAttribute<OrderSheetDetailId, Integer> foodId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheetDetailId#orderSheetId
	 **/
	public static volatile SingularAttribute<OrderSheetDetailId, Integer> orderSheetId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.OrderSheetDetailId
	 **/
	public static volatile EmbeddableType<OrderSheetDetailId> class_;

	public static final String FOOD_ID = "foodId";
	public static final String ORDER_SHEET_ID = "orderSheetId";

}

