const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("home page");
});

const books = [];

// this is the code for the entering the data of the books.

app.post("/books", (req, res) => {
  let book_id;
  if (books.length === 0) {
    book_id = 1;
  } else {
    book_id = books[books.length - 1].id + 1;
  }
  
  const { title, price, author } = req.body;
  if (!title || !price || !author || price < 0) {
    return res.status(400).json({message: "All field are required and price must be positive number"});
  }
  const new_book = {
    id: book_id,
    title: title,
    author: author,
    price: price,
  };
  
  books.push(new_book);
  console.log(books);
  res.status(201).json({ message: "book added..." });
});

// this is the code for show casing the whole collection of the books.

app.get("/books", (req, res) => {
  for (let i = 0; i < books.length; i++) {
    console.log(books[i]);
  }
  res.status(200).json({ books });
});

// reading of the specific book

app.get("/books/:id", (req, res) => {
  let id = req.params.id;
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == id) {
      console.log(books[i]);
      res.status(200).json({ books: books[i] });
      return;
    }
  }
  res.status(404).json({ message: "Book not found" });
});

// updating the book information.

app.put("/books/:id", (req, res) => {
  let id = req.params.id;
  const { title, price, author } = req.body;
  if (!title || !price || !author || price < 0) {
    res.status(400).json({message: "All field are required and price must be positive number",});
  }
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == id) {
      (books[i].title = req.body.title),
        (books[i].price = req.body.price),
        (books[i].author = req.body.author);
      console.log(books);
      return res.status(200).json({ books: books[i] });
    }
  }
  res.status(404).json({ message: "Book not found" });
});

// deletion of the book from the book array.

app.delete("/books/:id", (req, res) => {
  let id = req.params.id;
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == id) {
      const removedBook = books.splice(i, 1);
      console.log(books);
      return res.status(204).json({ books: removedBook[0] });
    }
  }
  res.status(404).json({ error: "Book not found" });
});

app.listen(3000);