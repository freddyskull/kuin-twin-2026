import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from 'ui-components'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <Toaster />
    </React.Fragment>
  )
}
