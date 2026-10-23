import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ErrorScene, NotFoundScene } from '@/components/StatusPages';

export function RouteNotFound() {
  return <div className="container-x py-6 lg:py-10">
    <NotFoundScene />
  </div>;
}

export function RouteError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return <div className="container-x py-6 lg:py-10">
    <ErrorScene onRetry={async () => { await router.invalidate(); reset(); }} />
  </div>;
}
