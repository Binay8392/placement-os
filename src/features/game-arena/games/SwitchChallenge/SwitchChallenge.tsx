import { GameSession } from '../../components/GameSession';
import type { ChallengeProps } from '../challengeTypes';

export default function SwitchChallenge(props: ChallengeProps) {
  return <GameSession {...props} />;
}
