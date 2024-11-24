import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import {
  MessageBrokerType,
  MessageHanlderType,
  PublishType,
  MessageType,
  TopicType,
  UserEvent,
} from "src/shared/types";
import { BadRequestError } from "src/shared/errors";
import config from "src/config";

const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers: config.KAFKA_BROKERS,
  logLevel: logLevel.INFO,
});

let producer: Producer;
let consumer: Consumer;

const createTopic = async (topic: string[]) => {
  const topics = topic.map((t) => ({
    topic: t,
    numPartitions: 2,
    replicationFactor: 1,
  }));

  const admin = kafka.admin();
  await admin.connect();
  const topicExists = await admin.listTopics();
  console.log("topics:", topicExists);

  for (const topic of topics) {
    if (!topicExists.includes(topic.topic)) {
      await admin.createTopics({ topics: [topic] });
    }
  }
  await admin.disconnect();
};

const connectProducer = async <T>(): Promise<T> => {
  await createTopic(["UserEvents"]);
  if (!producer) {
    producer = kafka.producer();
  }

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();
  return producer as unknown as T;
};

const disconnectProducer = async (): Promise<void> => {
  if (producer) {
    await producer?.disconnect();
  }
};

export const publish = async (data: PublishType): Promise<boolean> => {
  try {
    console.log("data:", data);

    const producer = await connectProducer<Producer>();
    const result = await producer.send({
      topic: data.topic,
      messages: [
        {
          headers: data.headers,
          key: data.event,
          value: JSON.stringify(data.message),
        },
      ],
    });

    return result.length > 0;
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
};

const connectConsumer = async <T>(): Promise<T> => {
  if (consumer) {
    return consumer as unknown as T;
  }

  consumer = kafka.consumer({
    groupId: config.KAFKA_GROUP_ID,
  });

  await consumer.connect();
  return consumer as unknown as T;
};

const disconnectConsumer = async (): Promise<void> => {
  if (consumer) {
    await consumer.disconnect();
  }
};

const subscribe = async (topic: TopicType, handler: MessageHanlderType) => {
  const consumer = await connectConsumer<Consumer>();
  await consumer.subscribe({
    topic: topic,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== "UserEvents") {
        return;
      }

      if (message.key && message.value) {
        const inputMessage: MessageType = {
          headers: message.headers,
          event: message.key.toString() as UserEvent,
          data: message.value ? JSON.parse(message.value.toString()) : null,
        };
        await handler(inputMessage);
        await consumer.commitOffsets([
          {
            topic: topic,
            partition: partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ]);
      }
    },
  });
};

export const MessageBroker: MessageBrokerType = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  disconnectConsumer,
  subscribe,
};
