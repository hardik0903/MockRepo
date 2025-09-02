import { NewKeywords } from '@/components/feed/new-keywords';
import { MostHated } from '@/components/feed/most-hated';
import { MostViral } from '@/components/feed/most-viral';

export default function FeedPage() {
  return (
    <div className="flex flex-col gap-8">
      <NewKeywords />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <MostViral />
        <MostHated />
      </div>
    </div>
  );
}
