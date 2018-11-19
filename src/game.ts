import * as crypto from 'crypto';
import { LevelPreset } from './level-preset';
import { PlayersManager } from './players-manager';
import { QuestsManager } from './quests-manager';
import { PreparationState } from './game-states/preparation-state';
import { RoleId } from './configs/roles.config';
import { BaseState } from './game-states/base-state';
import { Player } from './player';

// TODO: make fields private
// TODO: extract "history" fields to another class
export class Game {
  private id: string                = crypto.randomBytes(20).toString('hex');
  public createdAt: Date            = new Date();
  public startedAt: Date;
  public finishedAt: Date;
  //
  private rolesLastRevealedAt: Date;
  private rolesAreRevealed: boolean = false;
  private revealRolesPromise: Promise<void>;
  //
  public levelPreset: LevelPreset   = LevelPreset.null();
  public playersManager: PlayersManager;
  public questsManager: QuestsManager;
  public state: BaseState;

  constructor(
    playersManager   = new PlayersManager(),
    questsManager    = new QuestsManager(),
    state: BaseState = new PreparationState(),
  ) {
    this.id             = crypto.randomBytes(20).toString('hex');
    this.playersManager = playersManager;
    this.questsManager  = questsManager;
    this.state          = state;
  }

  // TODO: make private / remove
  getId() {
    return this.id;
  }

  addPlayer(player: Player) {
    this.state.addPlayer(this, player);
  }

  // TODO: make private / remove
  getCreatedAt() {
    return this.createdAt;
  }

  // TODO: make private / remove
  getStartedAt() {
    return this.startedAt;
  }

  // TODO: make private / remove
  getFinishedAt() {
    return this.finishedAt;
  }

  start(roleIds: RoleId[] = []) {
    this.state.start(this, roleIds);
  }

  finish() {
    this.finishedAt = new Date();
  }

  // TODO: make private / remove
  getLevelPreset() {
    return this.levelPreset;
  }

  // TODO: make private / remove
  getRolesAreRevealed() {
    return this.rolesAreRevealed;
  }

  // TODO: remove
  revealRoles(seconds: number) {
    if (this.revealRolesPromise) return this.revealRolesPromise;

    this.rolesAreRevealed = true;

    this.revealRolesPromise = new Promise((resolve) => {
      const rolesAreRevealed = setTimeout(() => {
        this.rolesAreRevealed    = false;
        this.revealRolesPromise  = null;
        this.rolesLastRevealedAt = new Date();
        clearTimeout(rolesAreRevealed);

        resolve();
      }, seconds * 1000);
    });

    return this.revealRolesPromise;
  }

  // TODO: convert to "handle"
  submitTeam(leaderUsername: string) {
    this.state.submitTeam(this, leaderUsername);
  }

  // TODO: convert to "handle"
  voteForQuest(username: string, voteValue: boolean) {
    this.state.voteForQuest(this, username, voteValue);
  }

  // TODO: convert to "handle"
  voteForTeam(username: string, voteValue: boolean) {
    this.state.voteForTeam(this, username, voteValue);
  }

  // TODO: convert to "handle"
  toggleTeammateProposition(leaderUsername: string, username: string) {
    this.state.toggleTeammateProposition(this, leaderUsername, username);
  }

  // TODO: convert to "handle"
  toggleVictimProposition(assassinsUsername: string, victimsUsername: string) {
    this.state.toggleVictimProposition(this, assassinsUsername, victimsUsername);
  }

  // TODO: convert to "handle"
  assassinate(assassinsUsername: string) {
    this.state.assassinate(this, assassinsUsername);
  }

  // serialize(forUsername) {
  //   return {
  //     meta: {
  //       startedAt: this.startedAt,
  //       finishedAt: this.finishedAt,
  //       ...this.levelPreset.serialize(),
  //     },
  //     ...this.questsManager.serialize(),
  //     // TODO: implement
  //     ...this.playersManager.serializeFor(forUsername, true),
  //   };
  // }
}
