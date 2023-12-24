import { Box, Grid, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { emptyArray } from "services/chart";
import { getNowDate } from "services/date";

const Dashboard = () => {
  const Auth = useAuth();
  const { data, status, refetch } = useQuery({
    queryKey: ["common-base-types/class-name/province"],
    queryFn: Auth?.getRequest,
    select: (res) => res.result,
  });
  return <Box>dashboard</Box>;
};

export default Dashboard;
