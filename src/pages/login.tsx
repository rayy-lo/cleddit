import { Formik, Field } from "formik";
import { Box, Button, Checkbox, Flex, VStack } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { gql, useMutation } from "@apollo/client";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { CORE_USER_FIELDS } from "../fragments";

interface LoginProps {}

const LOGIN_QUERY = gql`
  ${CORE_USER_FIELDS}
  mutation Login($options: UsernamePasswordInput!) {
    login(options: $options) {
      errors {
        field
        message
      }
      user {
        ...CoreUserFields
      }
    }
  }
`;

const Login: React.FC<LoginProps> = ({}) => {
  const [login] = useMutation(LOGIN_QUERY);
  const router = useRouter();

  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      <Box bg="white" p={6} rounded="md" w={64}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          onSubmit={async (values, actions) => {
            const response = await login({
              variables: {
                options: {
                  password: values.password,
                  email: values.email,
                },
              },
            });

            if (response.data?.login.errors) {
              actions.setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data.login.user) {
              router.push("/");
            }

            actions.setSubmitting(false);
          }}
        >
          {({ handleSubmit, errors, touched, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <InputField
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                  errors={errors}
                />
                <InputField
                  id="password"
                  name="password"
                  type="password"
                  variant="filled"
                  label="Password"
                  errors={errors}
                />
                <Field
                  as={Checkbox}
                  id="rememberMe"
                  name="rememberMe"
                  colorScheme="purple"
                >
                  Remember me?
                </Field>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="purple"
                  isFullWidth
                >
                  Login
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};

export default Login;
