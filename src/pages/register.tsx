import { Formik, Field } from "formik";
import { Box, Button, Checkbox, Flex, VStack } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { gql, useMutation } from "@apollo/client";

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
  const [register, { loading, error }] = useMutation(REGISTER_MUT);

  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      <Box bg="white" p={6} rounded="md" w={64}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          onSubmit={(values, actions) => {
            register({
              variables: {
                options: {
                  password: values.password,
                  username: values.email,
                },
              },
            })
              .then((res) => console.log(res))
              .catch((err) => {
                console.error("Error submitting form", err);
              })
              .finally(() => actions.setSubmitting(false));
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
