import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_pip')({
  component: PipLayout,
})

function PipLayout() {
  return (
    <>
      <Outlet />
      {/* TODO: 레거시 GlobalPip 마이그레이션 후 이 위치에서 렌더링 */}
    </>
  )
}
