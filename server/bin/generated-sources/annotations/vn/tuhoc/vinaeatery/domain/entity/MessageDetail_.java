package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(MessageDetail.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class MessageDetail_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.MessageDetail#id
	 **/
	public static volatile SingularAttribute<MessageDetail, MessageDetailId> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.MessageDetail
	 **/
	public static volatile EntityType<MessageDetail> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.MessageDetail#content
	 **/
	public static volatile SingularAttribute<MessageDetail, String> content;

	public static final String ID = "id";
	public static final String CONTENT = "content";

}

