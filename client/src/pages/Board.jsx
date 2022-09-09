import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, IconButton, Iconbutton, TextField } from "@mui/material";
import { setBoards } from "../redux/boardSlice";
import boardApi from "../api/boardApi";
import Kanban from "../components/Kanban";
import EmojiPicker from "../components/EmojiPicker";

let timer;
const timeout = 500;

const Board = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector((state) => state.board.value);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [icon, setIcon] = useState("");

  useEffect(() => {
    const getBoardContent = async () => {
      try {
        const res = await boardApi.getContent(boardId);
        setTitle(res.title);
        setDescription(res.description);
        setSections(res.sections);
        setIcon(res.icon);
      } catch (err) {
        alert(err);
      }
    };

    getBoardContent();
  }, [boardId]);

  const handleIconChange = async (newIcon) => {
    console.log("newIcon");
    try {
      let temp = [...boards];
      const index = temp.findIndex((e) => e.id === boardId);
      temp[index] = { ...temp[index], icon: newIcon };

      setIcon(newIcon);
      dispatch(setBoards(temp));

      await boardApi.update(boardId, { icon: newIcon });
    } catch (err) {
      alert(err);
    }
  };

  const deleteBoard = async () => {
    try {
      boardApi.delete(boardId);
      // update boards list
      const newBoards = boards.filter((board) => board.id !== boardId);
      dispatch(setBoards(newBoards));
      if (newBoards.length > 0) {
        navigate(`/boards/${newBoards[0].id}`);
      } else {
        navigate("/boards");
      }
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);

    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], title: newTitle };

    dispatch(setBoards(temp));

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const updateDescription = async (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <IconButton variant="outlined" color="error" onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>

      <Box sx={{ padding: "1rem, 10rem" }}>
        <EmojiPicker icon={icon} onChange={handleIconChange} />
        <TextField
          value={title}
          placeholder={"Untitled"}
          onChange={updateTitle}
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
            "& .MuiOutlinedInput-root": { fontSize: "2rem", fontWeight: "700" },
          }}
        />
        <TextField
          value={description}
          onChange={updateDescription}
          placeholder="Add a description"
          variant="outlined"
          multiline
          fullWidth
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
            "& .MuiOutlinedInput-root": {
              fontSize: "1rem",
              fontWeight: "400",
            },
          }}
        />
      </Box>
      <Box>
        <Kanban data={sections} boardId={boardId} />
      </Box>
    </>
  );
};

export default Board;
