import { GameSession } from '../../components/GameSession';
import type { ChallengeProps } from '../challengeTypes';

export default function InductiveChallenge(props: ChallengeProps) {
  return <GameSession {...props} />;
}
