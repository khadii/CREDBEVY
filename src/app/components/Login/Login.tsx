
"use client";

import { Form, Formik } from "formik";
import { Eye } from "lucide-react";
import * as Yup from "yup";
import { FormField, PasswordFormField } from "./Formcomponents/InputField";
import { useRouter } from "next/navigation";
// import logo from '../../../../public/Image/cred.svg';
export default function LoginPage() {
  const router =useRouter()
  const logo = "/Image/cred.svg";
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .required("password is Required"),
  });

  const onSubmit = (values: typeof initialValues) => {
    console.log(values);
    router.push('/dashboard')
  };
  return (
    <>
      {/* Logo */}

      <div className=" w-full   ">
        <div className="w-full flex justify-center pb-72">
          <div className="max-w-7xl w-full  md:p-0 p-6">
            <div className="mb-24 pt-16 md:pl-28 ">
              <img src={logo} alt="Credbevy Logo" className="h-8 w-auto" />
            </div>
            <div className="">
              {/* Login Form */}
              <div className="mx-auto max-w-[400px]">
                <h1 className="mb-14 text-center text-2xl font-semibold text-[#333333]">
                  Login
                </h1>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  <Form className="space-y-12">
                    <div className="space-y-6">
                      <div>
                      <FormField type="text" name="email" placeholder="Enter your email" />
                      </div>

                      <div className="relative">
                      <FormField type="password" name="password" placeholder="Enter your password" />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full">
                      <button
                        type="submit"
                        className="mt-6 w-full rounded-[4px] bg-[#0F5959] py-5 text-center text-base font-semibold text-white hover:bg-[#0F5959]/90"
                      >
                        Login
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
