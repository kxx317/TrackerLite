import {
  Box,
  SwipeableDrawer,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import asset from "../assets/index";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect, StrictMode } from "react";
import { useDispatch } from "react-redux";
import boardApi from "../api/boardApi";
import { setBoards } from "../redux/boardSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Sidebar = () => {
  const user = useSelector((state) => state.user.value);
  const boards = useSelector((state) => state.board.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll();
        dispatch(setBoards(res));
      } catch (err) {
        alert(err);
      }
    };
    getBoards();
  }, [dispatch]);

  useEffect(() => {
    const activeItem = boards.findIndex((e) => e.id === boardId);
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`);
    }
    setActiveIndex(activeItem);
  }, [boards, boardId, navigate]);

  useEffect(() => {
    console.log(boards);
  }, [boards]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);

    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((e) => e.id === boardId);
    setActiveIndex(activeItem);
    dispatch(setBoards(newList));

    try {
      await boardApi.updatePosition({ boards: newList });
    } catch (err) {
      alert(err);
    }
  };

  const addBoard = async () => {
    try {
      // get list of boards
      const newList = [...boards];
      // create new board at the last position
      // find how many repeated default board title
      const count = newList.filter(
        (e) => e.title.search("New Board") !== -1
      ).length;

      const newBoard = {
        title: `New Board (${count})`,
        position: newList.length,
      };
      const res = await boardApi.create(newBoard);
      newList.push(res);
      dispatch(setBoards(newList));
      navigate(`/boards/${res.id}`);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Drawer
      container={window.document.body}
      variant="permanent"
      open={true}
      sx={{
        height: "100vh",
        width: "15rem",
        "& > div": { borderRight: "none" },
      }}
    >
      <List
        sx={{
          height: "100vh",
          width: "15rem",
          backgroundColor: asset.colors.secondary,
        }}
      >
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "1rem",
            }}
          >
            <Typography variant="body2" fontWeight="700">
              {user.username}
            </Typography>

            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
        <ListItem>
          <TextField
            id="outlined-search"
            type="search"
            size={"small"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </ListItem>
        <Divider
          sx={{
            width: "80%",
            alignSelf: "center",
            justifySelf: "center",
            margin: "auto",
            padding: "0.25rem",
          }}
        />

        <ListItemButton onClick={addBoard}>
          <Box
            sx={{
              bottom: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem",
              paddingLeft: "1rem",
            }}
          >
            <Typography variant="body2" fontWeight="700">
              Add List
            </Typography>

            <IconButton>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItemButton>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            key={"list-board-droppable-key"}
            droppableId={"list-board-droppable"}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {boards.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <ListItemButton
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        selected={index === activeIndex}
                        component={Link}
                        to={`/boards/${item.id}`}
                        sx={{
                          pl: "20px",
                          cursor: snapshot.isDragging
                            ? "grab"
                            : "pointer!important",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="700"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.icon} {item.title}
                        </Typography>
                      </ListItemButton>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </List>
    </Drawer>
  );
};

export default Sidebar;
