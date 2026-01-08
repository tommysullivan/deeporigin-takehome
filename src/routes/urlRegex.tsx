import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/urlRegex')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/urlRegex"!</div>
}
