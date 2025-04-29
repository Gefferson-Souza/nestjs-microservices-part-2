import { Player } from '../players/player.interface';
import { Document } from 'mongoose';

export interface Category extends Document {
  __v?: number;
  readonly category: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
