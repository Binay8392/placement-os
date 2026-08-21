import { GameSession } from '../../components/GameSession';
import type { ChallengeProps } from '../challengeTypes';

export default function GridChallenge(props: ChallengeProps) {
  return <GameSession {...props} />;
}
