import { WallLengthForm } from './WallLengthForm';

interface WallLengthAdjustmentsProps {
  className?: string;
}

export function WallLengthAdjustments({ className = '' }: WallLengthAdjustmentsProps) {
  return (
    <div className={className}>
      <WallLengthForm />
    </div>
  );
}
