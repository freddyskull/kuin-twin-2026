import { createFileRoute } from '@tanstack/react-router'
import { EditCompanyPage } from '../features/companies/EditCompanyPage'

export const Route = createFileRoute('/_layout/companies/$id/edit')({
  component: EditCompanyPage,
})
