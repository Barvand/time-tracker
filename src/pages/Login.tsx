import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import loginSchema from "../validations/LoginValidation";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        try {
          await login(values.email, values.password);
          navigate("/employee/dashboard");
        } catch (err: any) {
          setStatus(err?.response?.data?.message || "Login failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched, status }) => (
        <Form className="max-w-sm mx-auto bg-white shadow-lg p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-bold text-center">Login</h2>

          {status && (
            <p className="bg-red-100 text-red-700 text-center p-2 rounded">
              {status}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium">Email</label>
            <Field
              name="email"
              type="email"
              placeholder="Enter a valid email"
              className={`w-full border p-2 rounded ${
                touched.email && errors.email ? "border-red-500" : ""
              }`}
            />
            {touched.email && errors.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <Field
              name="password"
              type="password"
              className={`w-full border p-2 rounded ${
                touched.password && errors.password ? "border-red-500" : ""
              }`}
            />
            {touched.password && errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded hover:bg-main transition cursor-pointer"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
