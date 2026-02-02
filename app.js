import express from "express";

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

// In-memory posts
let postsArray = [];

// HOME
app.get("/", (req, res) => {
  res.render("home", { posts: postsArray });
});

// VIEW POST
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = postsArray.find(p => p.id === id);

  if (post) {
    res.render("post", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

// COMPOSE PAGE
app.get("/compose", (req, res) => {
  res.render("compose");
});

// CREATE POST
app.post("/compose", (req, res) => {
  const { title, content, tags } = req.body;

  const tagArray = tags
    ? tags.split(",").map(tag => tag.trim())
    : [];

  const newPost = {
    id: Date.now(),
    title,
    content,
    tags: tagArray,
    createdAt: new Date()
  };

  postsArray.push(newPost);
  res.redirect("/");
});

// DELETE POST
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  postsArray = postsArray.filter(post => post.id !== id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
