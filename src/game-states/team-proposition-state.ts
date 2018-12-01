import * as fromErrors from '../errors';
import { BaseState } from './base-state';
import { Game } from '../game';
import { GameEvent } from '../enums/game-event';
import { GameState } from '../enums/game-state';

export class TeamPropositionState extends BaseState {
  protected resultsConcealed = true;
  protected rolesConcealed   = true;

  toggleTeammateProposition(game: Game, leaderUsername: string, username: string) {
    if (!game.getPlayersManager().playerPropositionAllowedFor(leaderUsername)) {
      throw new fromErrors.DeniedTeammatePropositionError();
    }

    game.getPlayersManager().togglePlayerProposition(username);

    game.emit(GameEvent.StateChange);
  }

  submitTeam(game: Game, leaderUsername: string) {
    if (!game.getPlayersManager().playerPropositionAllowedFor(leaderUsername)) {
      throw new fromErrors.DeniedTeamSubmissionError();
    }

    if (this.playerAmountIsIncorrect(game)) {
      throw new fromErrors.RequiredCorrectTeammatesAmountError();
    }

    game.getQuestsManager().isLastRoundOfTeamVoting()
      ? game.getFsm().transitionTo(GameState.TeamVotingPreApproved)
      : game.getFsm().transitionTo(GameState.TeamVoting);
  }

  private playerAmountIsIncorrect(game: Game) {
    const proposedPlayersCount = game.getPlayersManager().getProposedPlayersCount();
    const votesNeededCount     = game.getQuestsManager().getVotesNeededCount();

    return proposedPlayersCount !== votesNeededCount;
  }
}
