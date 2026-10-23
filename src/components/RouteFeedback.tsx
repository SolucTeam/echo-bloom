import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ErrorScene, NotFoundScene } from '@/components/StatusPages';

export function RouteNotFound() {
  return <div className="container-x py-16 lg:py-24">
    <NotFoundScene />
  </div>;
}

export function RouteError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return <div className="container-x py-16 lg:py-24">
    <ErrorScene onRetry={async () => { await router.invalidate(); reset(); }} />
  </div>;
}
