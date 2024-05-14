const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const multer = require("multer");
const {
  saveContent,
  renderSlideContent,
  SIDE_TOP_CONTENT,
  findArticle,
  searchArticle,
  loadArticle,
  checkAuthor,
  findCategory,
  mainContent,
  saveContactUsers,
  popularArticle,
} = require("./utils/article");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/article/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  const slides = renderSlideContent();
  const sideTopArticle = SIDE_TOP_CONTENT();
  const articles = mainContent();
  const popularArticles = popularArticle();
  res.render("index", {
    layout: "layouts/main-layout.ejs",
    css: `<link rel="stylesheet" href="css/index.css" />`,
    script: `<script src="js/index.js"></script>`,
    slides,
    sideTopArticle,
    articles,
    popularArticles,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout.ejs",
    css: `<link rel="stylesheet" href="css/index.css" />`,
    script: ``,
  });
});

app.get("/search", (req, res) => {
  res.render("search", {
    layout: "layouts/main-layout.ejs",
    css: `<link rel="stylesheet" href="css/index.css" />`,
    script: ``,
    searchResult: "",
  });
});

app.post("/search", (req, res) => {
  const searchValue = req.body;
  const searchResult = searchArticle(req.body);
  if (searchResult.length > 0) {
    res.render("search", {
      layout: "layouts/main-layout.ejs",
      css: `<link rel="stylesheet" href="css/index.css" />`,
      script: ``,
      searchResult,
      searchValue,
    });
  } else {
    res.redirect("/search");
  }
});

app.get("/write-login", (req, res) => {
  res.render("login-write", {
    layout: "layouts/author-form-layout.ejs",
    message: "",
  });
});

app.get("/write", (req, res) => {
  res.redirect("/write-login");
});

app.post("/write-login", (req, res) => {
  const author = checkAuthor(req.body);
  if (author) {
    res.render("write-article", {
      layout: "layouts/write-layout.ejs",
      script: `<script src="js/write.js"></script>`,
      css: `<link rel="stylesheet" href="css/index.css" />`,
      message: "",
    });
  } else {
    res.render("login-write", {
      layout: "layouts/author-form-layout.ejs",
      message: "Email atau Passwors tidak valid",
    });
  }
});

app.post("/write", upload.single("image"), (req, res) => {
  const file = loadArticle();
  const url_data = `/${req.body.url}`;
  let message = "";
  const duplikat_url = file.filter((f) => f.url === url_data);
  if (duplikat_url.length > 0) {
    message = "URL DUPLIKAT";
    res.render("write-article", {
      layout: "layouts/write-layout.ejs",
      css: `<link rel="stylesheet" href="css/index.css" />`,
      script: `<script src="js/write.js"></script>`,
      message,
    });
  } else {
    saveContent(req.body, req.file.filename);
    res.render("write-article", {
      layout: "layouts/write-layout.ejs",
      script: `<script src="js/write.js"></script>`,
      css: `<link rel="stylesheet" href="css/index.css" />`,
      message: "",
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login", {
    layout: "layouts/author-form-layout.ejs",
  });
});

app.post("/login", (req, res) => {
  saveContactUsers(req.body);
  res.redirect("/login");
});

app.get("/category/:category", (req, res) => {
  const content = req.params;
  let category = findCategory(req.params);
  if (category != undefined) {
    res.render("category", {
      layout: "layouts/main-layout.ejs",
      css: `<link rel="stylesheet" href="../css/index.css" />`,
      script: "",
      category,
      content,
    });
  } else {
    res.render("category", {
      layout: "layouts/main-layout.ejs",
      css: `<link rel="stylesheet" href="../css/index.css" />`,
      script: "",
      category: "",
      content,
    });
  }
});

app.get("/:article", (req, res) => {
  const article = findArticle(req.url);
  if (article) {
    return res.render("article", {
      layout: "layouts/main-layout.ejs",
      css: `<link rel="stylesheet" href="css/index.css" />`,
      script: "",
      article,
    });
  }
  res.status(404).redirect("/search");
});

app.use((req, res) => {
  res.redirect("/search");
});

app.listen(5000, () => {
  console.log("Server berjalan di http://localhost:5000");
});
