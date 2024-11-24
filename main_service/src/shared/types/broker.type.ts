export enum UserEvent {
  REGISTER_USER = "register_user",
  UPDATE_USER_INFO = "update_user_info",
}

export type TopicType = "UserEvents" | "MailEvents" | "CourseEvents";
export type MessageType = {
  headers?: Record<string, any>;
  event: UserEvent;
  data: Record<string, any>;
};

export type PublishType = {
  headers?: Record<string, any>;
  topic: TopicType;
  event: UserEvent;
  message: Record<string, any>;
};

export type MessageHanlderType = (message: MessageType) => void;

export type MessageBrokerType = {
  connectProducer: <T>() => Promise<T>;
  disconnectProducer: () => Promise<void>;
  publish: (data: PublishType) => Promise<boolean>;

  connectConsumer: <T>() => Promise<T>;
  disconnectConsumer: () => Promise<void>;
  subscribe: <T>(
    topic: TopicType,
    handler: MessageHanlderType
  ) => Promise<void>;
};
