import { GameSession } from '../../components/GameSession';
import type { ChallengeProps } from '../challengeTypes';

export default function GeoSudoChallenge(props: ChallengeProps) {
  return <GameSession {...props} />;
}
