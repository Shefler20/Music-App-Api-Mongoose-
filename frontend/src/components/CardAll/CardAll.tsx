import {Box, Button, Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import {BASE_URL, NO_IMAGE} from "../../globalConst.ts";
import {NavLink} from "react-router-dom";

interface Props{
    items: Artist,
    isOwner: boolean;
    isAdmin: boolean;
    onDelete: (id: string) => void;
    published: (id: string) => void;
}

const CardAll: React.FC<Props> = ({items, isOwner, isAdmin,  onDelete, published}) => {
    return (
        <Card
            component={NavLink}
            to={`/albums?artist=${items._id}`}
            sx={{
                position: "relative",
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
            {(isAdmin) && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        zIndex: 2
                    }}
                >
                    <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(items._id);
                        }}
                    >
                        Delete
                    </Button>

                    {isAdmin && (
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                published(items._id);
                            }}
                        >
                            {items.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                    )}
                </Box>
            )}
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
                        flexDirection: "column",
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

                    {isOwner && !items.isPublished && (
                        <Typography
                            variant="caption"
                            color="error"
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Not published
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>

    );
};

export default CardAll;