import { createFileRoute } from '@tanstack/react-router'
import { EditServicePage } from '../features/products/EditServicePage'

export const Route = createFileRoute('/_layout/services/$id/edit')({
  component: EditServicePage,
})
