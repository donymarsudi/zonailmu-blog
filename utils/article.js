const fs = require("fs");

const saveContent = (dataBody, image) => {
  const url_data = `/${{ ...dataBody }.url}`;
  const data = { ...dataBody, url: `${url_data}`, image };
  const file = loadArticle();
  file.unshift(data);
  fs.writeFileSync("data/article.json", JSON.stringify(file, null, 2), "utf-8");
};

const renderSlideContent = () => {
  return JSON.parse(fs.readFileSync("data/article.json", "utf-8")).slice(0, 3);
};

const SIDE_TOP_CONTENT = () => {
  return JSON.parse(fs.readFileSync("data/article.json", "utf-8")).slice(3, 5);
};

const mainContent = () => {
  return JSON.parse(fs.readFileSync("data/article.json", "utf-8")).slice(5, 11);
};

const popularArticle = () => {
  const articles = loadArticle();
  return articles.slice(11, 16);
};

const findArticle = (ARTICLE_URL) => {
  const articles = loadArticle();
  const find = articles.find((article) => article.url === ARTICLE_URL);
  return find;
};

const loadArticle = () => {
  return JSON.parse(fs.readFileSync("data/article.json", "utf-8"));
};

const searchArticle = (data) => {
  const articles = loadArticle();
  return articles.filter((article) => {
    return article.judul.toLowerCase().includes(data.search.toLowerCase());
  });
};

const checkAuthor = (AUTHOR_DATA_LOGIN) => {
  const author = JSON.parse(fs.readFileSync("data/author.json", "utf-8"));
  return author.find((a) => {
    return (
      a.email === AUTHOR_DATA_LOGIN.email &&
      a.password === AUTHOR_DATA_LOGIN.password
    );
  });
};

const findCategory = (data) => {
  const articles = loadArticle();
  return articles.filter((article) => {
    return article.kategori.toLowerCase() === data.category.toLowerCase();
  });
};

const saveContactUsers = (contactsUsers) => {
  const users = JSON.parse(fs.readFileSync("data/users.json", "utf-8"));
  users.push(contactsUsers);
  fs.writeFileSync("data/users.json", JSON.stringify(users, null, 2), "utf-8");
};

module.exports = {
  saveContent,
  renderSlideContent,
  SIDE_TOP_CONTENT,
  findArticle,
  searchArticle,
  loadArticle,
  popularArticle,
  checkAuthor,
  findCategory,
  mainContent,
  saveContactUsers,
};
