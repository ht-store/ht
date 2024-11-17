import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, HttpStatusCode } from "axios";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { PASSWORD_REGEX } from "@/lib/constants/auth";
import { register } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const signUpSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z
    .string()
    .min(6, {
      message: "At least 6 characters",
    })
    .max(32)
    .regex(PASSWORD_REGEX, {
      message:
        "At least 6 characters, including uppercase, lowercase and number",
    }),
  name: z.string().min(6, {
    message: "At least 6 characters",
  }),
  phoneNumber: z
    .string()
    .regex(
      /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
      "Phone number is invalid"
    ),
  roleId: z.number(),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      roleId: 2,
    },
  });

  // const handleNextSignUp = async () => {
  //   const isValid = await form.trigger(["name", "email", "password"]);
  //   if (isValid) {
  //     setStep(2);
  //   }
  // };

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (data: any) => register(data),
    onSuccess: async ({ data, status }) => {
      if (status === HttpStatusCode.Created && data) {
        navigate("/auth/login");
        toast.success("Register successfully");
      }
    },
    onError: (error: AxiosError) => {
      let errorMessage = "Can't register, please try again later";
      if (error.response?.status === HttpStatusCode.UnprocessableEntity) {
        errorMessage = "Email or password is incorrect";
      }

      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      roleId: data.roleId,
    };
    signUp(body);
  };

  return (
    <div className="flex items-center justify-center py-12 h-full">
      <div className="mx-auto grid w-[440px] gap-6 px-4">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-balance text-muted-foreground">
            Enter your details below to create a new account
          </p>
        </div>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
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
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button disabled={isPending} type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/auth/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
