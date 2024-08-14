const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

const port = 3000;

// middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello Postgres!")
});

// Create a todo
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("Insert into todo (description) values($1) Returning *", [description]);

        res.json(newTodo.rows[0]);

    } catch (error) {
        console.log(error);
    }
});

// Get a todo
app.get("/get-todo", async(req, res) => {
    try {
        const allTodos = await pool.query("Select * from todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.log(error);
    }
});

// Get a todo with specific id
app.get("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("Select * from todo where todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.log(error);
    }
});

// Update the current description
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updateTodo = await pool.query("Update todo set description = $1 where todo_id = $2", [description, id]);

        res.json("Todo is updated now!");
    } catch (error) {
        console.log(error);
    }
});

// Delete the todos from specific id
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("Delete from todo where todo_id = $1", [id]);

        res.json("Todo is deleted!");
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => console.log(`app listening on port ${port}`));