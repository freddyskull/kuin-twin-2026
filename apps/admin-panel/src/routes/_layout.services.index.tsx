import { createFileRoute } from '@tanstack/react-router'
import { ServicesPage } from '../features/products/ServicesPage'

export const Route = createFileRoute('/_layout/services/')({
  component: ServicesPage,
})
