import { Formik, Field } from "formik";
import { Box, Button, Checkbox, Flex, VStack } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { gql, useMutation } from "@apollo/client";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface RegisterProps {}

const REGISTER_MUT = gql`
  mutation Register($options: UsernamePasswordInput!) {
    register(options: $options) {
      errors {
        field
        message
      }
      user {
        id
      }
    }
  }
`;

const Register: React.FC<RegisterProps> = ({}) => {
  const [register] = useMutation(REGISTER_MUT);
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
            const response = await register({
              variables: {
                options: {
                  password: values.password,
                  email: values.email,
                },
              },
            });

            if (response.data?.register.errors) {
              actions.setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data.register.user) {
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
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="purple"
                  isFullWidth
                >
                  Register
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};

export default Register;
