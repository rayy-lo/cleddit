import { gql, useQuery } from "@apollo/client";
import { Box, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { CORE_USER_FIELDS } from "../fragments";

interface NavbarProps {}

const ME_QUERY = gql`
  ${CORE_USER_FIELDS}
  query Me {
    me {
      ...CoreUserFields
    }
  }
`;

const Navbar = ({}: NavbarProps) => {
  const { loading, error, data } = useQuery(ME_QUERY);

  return (
    <Box display="flex" justifyContent="flex-end" bg="tan" p={4} color="white">
      {data?.me && !loading ? (
        <Flex>
          <Link p={1}>{data.me.username}</Link>
          <Link p={1} href="/logout">
            Logout
          </Link>
        </Flex>
      ) : (
        <>
          <NextLink href="/login">
            <Link p={2}>Login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link p={2}>Register</Link>
          </NextLink>
        </>
      )}
    </Box>
  );
};

export default Navbar;
