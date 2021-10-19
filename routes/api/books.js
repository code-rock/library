const express = require('express');
const router = express.Router();
const upload = require('../../middleware/file');
const { Book } = require('../../models')

const store = {
    books: [],
}

router.get('/', (req, res) => {
    res.json(store.books);
})

router.get('/:id/download', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);
    if (books[idx]) {
         const { title, fileBook } = books[idx];

        res.download(__dirname + '/../public/books/' + fileBook, fileBook, err => {
            if (err) {
                res.status(404).json();
            }
        });
    } else {
        res.status(404).json('Книги с таким ID не существует');
    }
   
})

router.get('/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.json(books[idx])
    } else {
        res.status(404)
        res.json('Книга не найдена')
    }
})

router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        const { path } = req.file;
        console.log(path);
            
        res.json(path);
    } else {
        res.json(null);
    }
});

router.post('/', upload.none(), (req, res) => {
    const { books } = store;
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(newBook)

    res.status(201)
    res.json(newBook)
})

router.put('/:id', (req, res) => {
    const { books } = store;
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title: title || books[idx].title, 
            description: description || books[idx].description, 
            authors: authors || books[idx].authors, 
            favorite: favorite || books[idx].favorite, 
            fileCover: fileCover || books[idx].fileCover, 
            fileName: fileName || books[idx].fileName,
            fileBook: fileBook || books[idx].fileBook,
        };

        res.json(books[idx]);
    } else {
        res.status(404);
        res.json("Книга не найдена");
    }
})

router.delete('/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books.splice(idx, 1);
        res.json('ok');
    } else {
        res.status(404);
        res.json("Книги и не было, все ок");
    }
})

module.exports = router;