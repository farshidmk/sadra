import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import { useAuth } from "hooks/useAuth";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Dashboard = () => {
  const Auth = useAuth();
  const { data, status, refetch } = useQuery({
    queryKey: ["Report/ReportDashboard"],
    queryFn: Auth?.getRequest,
    select: (res) => {
      if (res.Data) {
        let result: TPieData[] = [];
        Object.entries(res.Data).forEach(([key, value]) => {
          let newKey = key as TPieData["name"];
          if (key.includes("Count")) {
            let temp: TPieData = { name: newKey, value: value as number, label: CELL_INFO[newKey].label };
            result.push(temp);
          }
        });
        return result;
      }
    },
  });

  //@ts-ignore
  const CustomTooltip = ({ active, payload, label }) => {
    console.log({ active, payload, label });
    if (active && payload && payload.length) {
      let value = payload[0].value;
      let label = payload[0].payload?.label;
      return (
        <Box
          sx={{
            boxShadow: "1px 1px 1px 1px",
            p: 2,
            borderRadius: 3,
            background: (theme) => theme.palette.background.paper,
          }}
        >
          <p className="desc">
            {" "}
            {label} {value}{" "}
          </p>
        </Box>
      );
    }

    return null;
  };

  return (
    <>
      <Typography variant="h3" textAlign="center">
        پنل مدیریت تکس
      </Typography>
      {status === "loading" ? (
        <CircularProgress />
      ) : status === "error" ? (
        <ErrorHandler onRefetch={refetch} />
      ) : (
        <>
          <ResponsiveContainer>
            <PieChart width={400} height={200}>
              <Tooltip
                //@ts-ignore
                content={<CustomTooltip />}
              />
              <Pie
                data={data}
                startAngle={0}
                endAngle={360}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={true}
              >
                {data?.map((entry: TPieData, index: number) => (
                  <Cell key={`cell-${entry.name}`} fill={CELL_INFO[entry.name].color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
};

export default Dashboard;

const CELL_INFO = {
  CommittedCount: { color: "#0088FE", label: "تعداد تایید شده" },
  FailedCount: { color: "#FF8042", label: "تعداد ناموفق" },
  PendingCount: { color: "#FFBB28", label: "تعداد در حال اجرا" },
  SubmittedCount: { color: "#11A282", label: "تعداد کامل شده" },
  SuccessCount: { color: "#11F810", label: "تعداد موفق" },
};

type TPieData = {
  name: keyof typeof CELL_INFO;
  value: number;
  label?: string;
  color?: string;
};
