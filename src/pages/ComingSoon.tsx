import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-screen pb-24 md:pb-8 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <Construction className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          {description || "This feature is coming soon. Stay tuned for updates!"}
        </p>
      </div>
    </div>
  );
}
