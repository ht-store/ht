import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, HttpStatusCode } from 'axios';
import { useForm } from 'react-hook-form';
import { setTokens } from '@/lib/utils/auth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { PASSWORD_REGEX } from '@/lib/constants/auth';
import { login } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { appConfigs } from '@/lib/app-config';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const signInSchema = z.object({
  email: z.string().email('Email is not valid'),
  password: z
    .string()
    .min(6, {
      message: 'At least 6 characters',
    })
    .max(32)
    .regex(PASSWORD_REGEX, {
      message: 'At least 6 characters, including uppercase, lowercase and number',
    }),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const [searchParams] = useSearchParams();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: (data: SignInFormData) => login(data),
    onSuccess: async ({ data, status }) => {
      if (status === HttpStatusCode.Ok && data) {
        setTokens(data.data.access_token, data.data.refresh_token);

        const flow = searchParams.get('flow');
        const clientId = searchParams.get('client_id');
        const redirectUrl = searchParams.get('redirect');

        if (flow === 'OAuth' && clientId && redirectUrl) {
          const url = new URL(redirectUrl);
          url.searchParams.set('token', data.data.access_token);
          url.searchParams.set('refreshToken', data.data.refresh_token);

          window.location.href = url.toString();
          setTimeout(() => {
            window.location.href = appConfigs.appURL;
          }, 1000);
        } else {
          window.location.href = '/';
        }
      }
    },
    onError: (error: AxiosError) => {
      let errorMessage = "Can't login, please try again later";
      if (error.response?.status === HttpStatusCode.UnprocessableEntity) {
        errorMessage = 'Email or password is incorrect';
      }

      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    signIn(data);
  };

  return (
    <div className="flex items-center justify-center py-12 h-full">
      <div className="mx-auto grid w-[440px] gap-6 px-4">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
        </div>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="abc@example.com" {...field} />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link to="/auth/forgot-password" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="Your password" {...field} />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/auth/register" className="underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}


export default SignInPage;