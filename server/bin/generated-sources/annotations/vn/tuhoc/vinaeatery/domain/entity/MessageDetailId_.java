package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(MessageDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class MessageDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.MessageDetailId#isAdminSend
	 **/
	public static volatile SingularAttribute<MessageDetailId, Boolean> isAdminSend;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.MessageDetailId#messageId
	 **/
	public static volatile SingularAttribute<MessageDetailId, Integer> messageId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.MessageDetailId#sendAt
	 **/
	public static volatile SingularAttribute<MessageDetailId, String> sendAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.MessageDetailId
	 **/
	public static volatile EmbeddableType<MessageDetailId> class_;

	public static final String IS_ADMIN_SEND = "isAdminSend";
	public static final String MESSAGE_ID = "messageId";
	public static final String SEND_AT = "sendAt";

}

