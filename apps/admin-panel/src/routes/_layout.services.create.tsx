import { createFileRoute } from '@tanstack/react-router'
import { CreateServicePage } from '../features/products/CreateServicePage'

export const Route = createFileRoute('/_layout/services/create')({
  component: CreateServicePage,
})
