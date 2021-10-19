const express = require('express');
const router = express.Router();
const upload = require('../middleware/file');
const { Book } = require('../models')

const store = {
    books: [],
}

router.get('/', (req, res) => {
    res.render("library/index", {
        title: "Библиотека",
        books: store.books,
    });
});

router.get('/create', (req, res) => {
    res.render("library/create", {
        title: "Создать новую книгу",
        book: {},
        books: store.books,
    });
});

router.post('/create', upload.fields([
    { name: 'fileCover', maxCount: 1 },
    { name: 'fileBook', maxCount: 1 }
  ]), (req, res) => {
    const { books } = store;
    const { title, description, authors, favorite, fileName } = req.body;
    const fileCover = req.files.fileCover ? req.files.fileCover[0].path: undefined;
    const fileBook = req.files.fileBook ? req.files.fileBook[0].path: undefined;
    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook);
    books.push(newBook);
    res.redirect('/')
});

router.get('/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.render("library/view", {
            title: "Просмотр",
            book: books[idx],
            notSet: 'Неизвестно'
        });
    } else {
        res.status(404).redirect('/404');
    }
})

router.post('/delete/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books.splice(idx, 1);
        res.redirect('/');
    } else {
        res.status(404).redirect('/404');
    }
})

router.get('/update/:id', (req, res) => {
    const { books } = store;const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.render("library/create", {
            title: "Создать новую книгу",
            book: books[idx],
        });
    } else {
        res.status(404).redirect('/404');
    }
})


router.post('/update/:id',  upload.fields([
    { name: 'fileCover', maxCount: 1 },
    { name: 'fileBook', maxCount: 1 }
  ]), (req, res) => {
    const { books } = store;
    const { title, description, authors, favorite, fileName } = req.body;
    const fileCover = req.files.fileCover ? req.files.fileCover[0].path: undefined;
    const fileBook = req.files.fileBook ? req.files.fileBook[0].path: undefined;
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

        res.redirect(`/${id}`);
    } else {
        res.status(404).redirect('/404');
    }
})

module.exports = router;