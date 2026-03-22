import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3001/api'

export const handlers = [
  http.get(`${API_URL}/services`, () => {
    return HttpResponse.json({
      items: [],
      total: 0,
    })
  }),

  // Empresas
  http.post(`${API_URL}/companies`, () => {
    return HttpResponse.json({ id: '123', businessName: 'Empresa Test' }, { status: 201 })
  }),

  http.post(`${API_URL}/companies/verify-sat`, () => {
    return HttpResponse.json({
      isValid: true,
      message: 'RFC Válido',
      details: {
        legalName: 'RAZON SOCIAL AUTOFILL',
        taxRegime: '601 - General de Ley',
        zipCode: '54321'
      }
    })
  }),

  // Mensajes
  http.get(`${API_URL}/chat/admin/all-messages`, () => {
    return HttpResponse.json([
      {
        id: '1',
        content: 'Hola Admin',
        senderId: 'user-1',
        receiverId: 'admin-1',
        createdAt: new Date().toISOString(),
        sender: { id: 'user-1', email: 'user@test.com', profile: { displayName: 'Juan Perez', avatarUrl: null } },
        receiver: { id: 'admin-1', email: 'admin@test.com' },
      }
    ])
  }),
]
