import { GameSession } from '../../components/GameSession';
import type { ChallengeProps } from '../challengeTypes';

export default function OddoChallenge(props: ChallengeProps) {
  return <GameSession {...props} />;
}
