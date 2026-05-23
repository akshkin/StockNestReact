import { useDispatch } from "react-redux";
import { useGetMeQuery } from "../../api/authApi";
import { setAuthStatus } from "../../features/authSlice";
import { useEffect } from "react";

function AuthInitializer() {
  // initialize user in this component
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    // refetch on mount to restore session
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    dispatch(setAuthStatus("loading"));
    //  eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (data) {
      dispatch(setAuthStatus("authenticated"));
    } else {
      dispatch(setAuthStatus("guest"));
    }
    // eslint-disable-next-line
  }, [data, isLoading, isError]);

  return null;
}

export default AuthInitializer;
