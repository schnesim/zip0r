import { EventType } from "../domain/eventType";

export interface IEventListener {
  // It has to be possible to register for more than one event.
  readonly eventTypes: EventType[];
  notify(event: EventType);
}