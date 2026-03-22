import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { CreateCompanyPage } from './create-company-page';
import { vi, describe, it, expect } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock ui-components con una versión funcional para el test
vi.mock('ui-components', () => {
  return {
    CustomForm: ({ children, onSubmit, defaultValues }: any) => {
      const methods = useForm({ defaultValues });
      const handleSubmit = async (data: any) => {
        await onSubmit(data);
      };
      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            {typeof children === 'function' ? children(methods) : children}
          </form>
        </FormProvider>
      );
    },
    FormInput: ({ name, label, register, ...props }: any) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <input id={name} {...props} {...(register ? register(name) : {})} />
      </div>
    ),
    FormSelect: ({ name, label, options, register, ...props }: any) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <select id={name} {...props} {...(register ? register(name) : {})}>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    ),
    FormTextarea: ({ name, label, register, ...props }: any) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <textarea id={name} {...props} {...(register ? register(name) : {})} />
      </div>
    ),
    FormCheckbox: ({ name, label, register, ...props }: any) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <input type="checkbox" id={name} {...props} {...(register ? register(name) : {})} />
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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateCompanyPage', () => {
  it('renders correctly', () => {
    render(<CreateCompanyPage />);
    expect(screen.getByText('Nueva Empresa')).toBeInTheDocument();
  });

  it('fills form and submits successfully', async () => {
    render(<CreateCompanyPage />);

    fireEvent.change(screen.getByLabelText(/Nombre Comercial/i), { target: { value: 'Empresa Test' } });
    fireEvent.change(screen.getByLabelText(/RFC/i), { target: { value: 'ABCD123456XYZ' } });
    
    const submitButton = screen.getByRole('button', { name: /Registrar Empresa/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/empresas');
    });
  });

  it('calls SAT verification and auto-fills fields', async () => {
    render(<CreateCompanyPage />);

    const rfcInput = screen.getByLabelText(/RFC/i);
    fireEvent.change(rfcInput, { target: { value: 'VALID123456' } });

    const verifyButton = screen.getByTitle(/Verificar ante el SAT/i);
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Razón Social/i)).toHaveValue('RAZON SOCIAL AUTOFILL');
      expect(screen.getByLabelText(/Código Postal/i)).toHaveValue('54321');
    });
  });
});
