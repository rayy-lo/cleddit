import { Formik, Field } from "formik";
import { Box, Button, Checkbox, Flex, VStack } from "@chakra-ui/react";
import { InputField } from "../components/InputField";

interface RegisterProps {}

function Register() {
  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      <Box bg="white" p={6} rounded="md" w={64}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
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
}

export default Register;
