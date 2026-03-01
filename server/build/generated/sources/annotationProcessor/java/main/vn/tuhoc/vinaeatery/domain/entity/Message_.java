package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Message.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Message_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Message#isRead
	 **/
	public static volatile SingularAttribute<Message, Boolean> isRead;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Message#id
	 **/
	public static volatile SingularAttribute<Message, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Message#restaurantId
	 **/
	public static volatile SingularAttribute<Message, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Message#useTableId
	 **/
	public static volatile SingularAttribute<Message, Long> useTableId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Message
	 **/
	public static volatile EntityType<Message> class_;

	public static final String IS_READ = "isRead";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String USE_TABLE_ID = "useTableId";

}

