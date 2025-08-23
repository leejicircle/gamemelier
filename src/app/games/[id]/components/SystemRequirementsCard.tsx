import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { GameDetail } from '@/types';

export function SystemRequirementsCard({ data }: { data: GameDetail }) {
  return (
    <Card className="bg-gray-900">
      <CardTitle className="text-gray-500">최소 사양</CardTitle>
      <CardContent className="text-white text-xs">
        {data.requirements_min_html}
      </CardContent>
    </Card>
  );
}
