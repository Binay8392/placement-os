import { GameSession } from '../../components/GameSession';
import type { ChallengeProps } from '../challengeTypes';

export default function DigitChallenge(props: ChallengeProps) {
  return <GameSession {...props} />;
}
