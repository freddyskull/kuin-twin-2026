import { createFileRoute } from '@tanstack/react-router'
import { CreateCompanyPage } from '../features/companies/CreateCompanyPage'

export const Route = createFileRoute('/_layout/companies/create')({
  component: CreateCompanyPage,
})
