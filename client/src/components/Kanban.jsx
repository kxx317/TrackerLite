import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  IconButton,
  Card,
  Drawer,
  Collapse,
  Fade,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import sectionApi from "../api/sectionApi";
import taskApi from "../api/taskApi";
import TaskModal from "./TaskModal";

const Kanban = (props) => {
  const boardId = props.boardId;
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const onDragStart = async ({ source, destination }) => {};

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;

    const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
    const destinationColIndex = data.findIndex(
      (e) => e.id === destination.droppableId
    );
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });
      setData(data);
    } catch (err) {
      alert(err);
    }
  };

  const createSection = async (param) => {
    try {
      const res = await sectionApi.create(boardId);
      setData([...data, res]);
    } catch (err) {
      alert(err);
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId);
      setData([...data].filter((e) => e.id !== sectionId));
    } catch (err) {
      alert(err);
    }
  };

  const updateSectionTitle = async (e, sectionId) => {
    const newTitle = e.target.value;
    const temp = [...data];
    const index = temp.findIndex((e) => e.id === sectionId);
    temp[index].title = newTitle;
    setData(temp);

    try {
      await sectionApi.update(boardId, sectionId, { title: newTitle });
    } catch (err) {
      alert(err);
    }
  };

  const createTask = async (sectionId) => {
    console.log(sectionId);
    try {
      const task = await taskApi.create(boardId, { sectionId });
      setData(
        data.map((e) =>
          e.id === sectionId ? { ...e, tasks: [...e.tasks, task] } : e
        )
      );
    } catch (err) {
      alert(err);
    }
  };

  const updateTask = async (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    newData[sectionIndex].tasks[taskIndex] = task;
    setData(newData);
  };

  const deleteTask = async (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
        }}
      >
        <Button onClick={createSection}>Add section</Button>
        {/* <Typography fontSize="1rem">{data.length} sections</Typography> */}
      </Grid>

      <Divider sx={{ margin: "1rem 0" }} />

      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "calc(100vw-400px)",
            overflowX: "auto",
          }}
        >
          {data.map((section) => (
            <div key={section.id} style={{ width: "300px" }}>
              <Droppable droppableId={section.id} key={section.id}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: "300px",
                      padding: "1rem",
                      marginRight: "1rem",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                      }}
                    >
                      <TextField
                        value={section.title}
                        placeholder="Untitled"
                        variant="outlined"
                        onChange={(e) => updateSectionTitle(e, section.id)}
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-input": { padding: 0 },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "unset ",
                          },
                          "& .MuiOutlinedInput-root": {
                            fontSize: "1rem",
                            fontWeight: "700",
                          },
                        }}
                      />
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "grey",
                          "&:hover": { color: "#66bb6a" },
                        }}
                        onClick={() => createTask(section.id)}
                      >
                        <AddOutlinedIcon />
                      </IconButton>

                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "grey",
                          "&:hover": { color: "#f44336" },
                        }}
                        onClick={() => deleteSection(section.id)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Box>
                    {/* tasks */}
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: "1rem",
                              marginBottom: "1rem",
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                            }}
                            onClick={() => setSelectedTask(task)}
                          >
                            <Typography>
                              {task.title === "" ? "Untitled" : task.title}
                            </Typography>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </div>
          ))}
        </Box>
      </DragDropContext>
      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </>
  );
};

export default Kanban;
