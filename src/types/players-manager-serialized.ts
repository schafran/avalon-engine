import { PlayerSerialized } from './player-serialized';

export type PlayersManagerSerialized = {
  collection: PlayerSerialized[];
  proposedPlayerIds: string[];
  leaderId: string;
  isApproved: boolean;
  isSubmitted: boolean;
  victimId: string;
}
