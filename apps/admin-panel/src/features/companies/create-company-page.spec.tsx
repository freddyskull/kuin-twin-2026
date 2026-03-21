import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateCompanyPage } from './create-company-page';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as hooks from './companies.hooks';
import { useForm, FormProvider } from 'react-hook-form';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock ui-components
vi.mock('ui-components', () => {
  return {
    CustomForm: ({ children, onSubmit, defaultValues }: any) => {
      const methods = useForm({ defaultValues });
      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {typeof children === 'function' ? children(methods) : children}
          </form>
        </FormProvider>
      );
    },
    FormInput: ({ name, label, required, ...props }: any) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <input id={name} {...props} />
      </div>
    ),
    FormSelect: ({ name, label, options, ...props }: any) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <select id={name} {...props}>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    ),
    FormTextarea: ({ name, label, ...props }: any) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <textarea id={name} {...props} />
      </div>
    ),
    FormCheckbox: ({ name, label, ...props }: any) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <input type="checkbox" id={name} {...props} />
      </div>
    ),
    Button: ({ children, onClick, disabled, type, ...props }: any) => (
      <button onClick={onClick} disabled={disabled} type={type} {...props}>
        {children}
      </button>
    ),
    useToast: () => ({ toast: vi.fn() }),
    getAbsoluteUrl: (url: string) => url,
  };
});

// Mock hooks
vi.mock('./companies.hooks', () => ({
  useCreateCompany: vi.fn(),
  useVerifySat: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateCompanyPage', () => {
  const mockMutateAsync = vi.fn();
  const mockVerifySatAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (hooks.useCreateCompany as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
    (hooks.useVerifySat as any).mockReturnValue({
      mutateAsync: mockVerifySatAsync,
      isPending: false,
    });
  });

  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Nueva Empresa')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre Comercial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RFC/i)).toBeInTheDocument();
  });

  it('fills form and submits successfully', async () => {
    mockMutateAsync.mockResolvedValue({ id: '123' });

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre Comercial/i), { target: { value: 'Empresa Test' } });
    fireEvent.change(screen.getByLabelText(/RFC/i), { target: { value: 'ABCD123456XYZ' } });
    fireEvent.change(screen.getByLabelText(/Régimen Fiscal/i), { target: { value: '601' } });
    fireEvent.change(screen.getByLabelText(/Razón Social/i), { target: { value: 'Razón Social Test' } });
    fireEvent.change(screen.getByLabelText(/Dirección Completa/i), { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'Ciudad México' } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'CDMX' } });
    fireEvent.change(screen.getByLabelText(/Código Postal/i), { target: { value: '12345' } });

    const submitButton = screen.getByRole('button', { name: /Registrar Empresa/i });
    
    // In this mocked version, we might need to wait for validation if Zod was used in the real component
    // But since we mock the whole CustomForm and its validation logic is minimal in the mock, it should work.
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/empresas');
    });
  });

  it('calls SAT verification and auto-fills fields', async () => {
    mockVerifySatAsync.mockResolvedValue({
      isValid: true,
      message: 'RFC Válido',
      details: {
        legalName: 'RAZON SOCIAL AUTOFILL',
        taxRegime: '601 - General de Ley',
        zipCode: '54321'
      }
    });

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>
    );

    const rfcInput = screen.getByLabelText(/RFC/i);
    fireEvent.change(rfcInput, { target: { value: 'VALID123456' } });

    const verifyButton = screen.getByTitle(/Verificar ante el SAT/i);
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockVerifySatAsync).toHaveBeenCalledWith('VALID123456');
      // Note: Auto-filling depends on the internal setValue of the real CustomForm.
      // Our mock CustomForm provides real react-hook-form methods, so it should work.
      expect(screen.getByLabelText(/Razón Social/i)).toHaveValue('RAZON SOCIAL AUTOFILL');
      expect(screen.getByLabelText(/Código Postal/i)).toHaveValue('54321');
    });
  });
});
