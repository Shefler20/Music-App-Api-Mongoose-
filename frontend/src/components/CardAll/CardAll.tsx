import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import {BASE_URL, NO_IMAGE} from "../../globalConst.ts";

interface Props{
    items: Artist
}

const CardAll: React.FC<Props> = ({items}) => {
    return (
        <Card
            sx={{
                width: 200,
                height: 280,
                borderRadius: 3,
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                },
            }}
        >
            <CardActionArea
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:active": {
                        boxShadow: 12,
                    },
                }}
            >
                <CardMedia
                    component="img"
                    image={items.image !== null ? BASE_URL + items.image : NO_IMAGE}
                    alt={items.name}
                    sx={{
                        height: 200,
                        width: "100%",
                        objectFit: "cover",
                    }}
                />
                <CardContent
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflowX: "auto",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        {items.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CardAll;