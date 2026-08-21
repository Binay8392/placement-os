import { GameSession } from '../../components/GameSession';
import type { ChallengeProps } from '../challengeTypes';

export default function PatternChallenge(props: ChallengeProps) {
  return <GameSession {...props} />;
}
