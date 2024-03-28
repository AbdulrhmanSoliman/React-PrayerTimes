import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

// eslint-disable-next-line react/prop-types
export default function Prayer({ name, time, img, active }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        border: "1px solid #444",
        minWidth: "14rem",
      }}
      style={
        active
          ? { backgroundColor: "#eee", color: "#505050" }
          : { backgroundColor: "transparent", color: "white" }
      }
    >
      <CardMedia sx={{ height: 140 }} image={img} />
      <CardContent>
        <h3>{name}</h3>
        <Typography
          variant="body2"
          style={{ fontSize: "3rem", fontWeight: "300" }}
        >
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
