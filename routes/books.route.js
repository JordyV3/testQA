const express = require('express');

const router = express.Router();
const bookData = require('../data/books.json');
const { check, validationResult } = require('express-validator');
const { save } = require('../services/save.services');
router.get('/', (req, res) => {
	res.json(bookData);
});

router.post(
	'/',
	[
		check('name', 'El nombre del libro es obligatorio').not().isEmpty(),
		check('author', 'El nombre del autor es obligatorio').not().isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { name, author } = req.body;

		bookData.push({
			name,
			author,
			id: Math.random()
		});

		const isSaved = save(bookData);

		if (!isSaved) {
			return res.status(500).json({
				error: true,
				message: 'Libro no guardado'
			});
		}

		res.json({
			message: 'Exitoso'
		});
	}
);

router.put('/:bookid', (req, res) => {
	const { bookid } = req.params;
	const { name, author } = req.body;
	const foundBook = bookData.find((book) => book.id == bookid);

	if (!foundBook) {
		return res.status(404).send({
			error: true,
			message: 'Libro no encontrado'
		});
	}

	let updatedBook = null;

	const updatedBooks = bookData.map((book) => {
		if (book.id == bookid) {
			updatedBook = {
				...book,
				name,
				author
			};

			return updatedBook;
		}

		return book;
	});

	const isSaved = save(updatedBooks);

	if (!isSaved) {
		return res.status(500).json({
			error: true,
			message: 'no se pudo guardar el libro'
		});
	}

	res.status(201).json(updatedBook);
});

router.delete('/:bookid', (req, res) => {
	const { bookid } = req.params;
	const foundBook = bookData.find((book) => book.id == bookid);

	if (!foundBook) {
		return res.status(404).send({
			error: true,
			message: 'Libro no encontrado'
		});
	}

	const updatedBooks = bookData.filter((book) => book.id != bookid);

	const isSaved = save(updatedBooks);

	if (!isSaved) {
		return res.status(500).json({
			error: true,
			message: 'Libro no guardado'
		});
	}

	res.status(201).json({
		message: 'Exitoso'
	});
});
module.exports = router;
