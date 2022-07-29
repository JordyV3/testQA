const express = require('express');
const request = require('supertest');
const bookRoute = require('../routes/books.route');
const app = express();

app.use(express.json());

app.use('/api/books', bookRoute);

jest.mock('../data/books.json', () => [
	{ name: 'La Biblia', author: 'Anonimo', id: 1 },
	{ name: 'Divina comedia', author: 'Dante Alighieri', id: 2 },
	{ name: 'Orgullo y prejuicio', author: 'Jane Austen', id: 3 }
]);

describe('Pruebas de integracion de data en APIs', () => {
	it('GET /api/books - exitoso -  mostrar todos los libros ', async () => {
		const { body, statusCode } = await request(app).get('/api/books');

		expect(body).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(Number),
					name: expect.any(String),
					author: expect.any(String)
				})
			])
		);

		expect(statusCode).toBe(200);
	});

	it('POST  /api/books - Faild, No se pudo guardar el libro', async () => {
		const { body, statusCode } = await request(app).post('/api/books').send({
			name: '',
			author: 'Dante Alighieri'
		});

		expect(statusCode).toBe(400);
		expect(body).toEqual({
			errors: [
				{
					location: 'body',
					msg: 'El nombre del libro es obligatorio',
					param: 'name',
					value: ''
				}
			]
		});
	});

	it('POST /api/books - exitoso', async () => {
		const { body, statusCode } = await request(app).post('/api/books').send({
			name: 'Divina comedia',
			author: 'Dante Alighieri'
		});

		expect(statusCode).toBe(200);

		expect(body).toEqual({
			message: 'Exitoso'
		});
	});

	it('PUT /api/books/:bookid - Faild No se encontro el libro', async () => {
		const { body, statusCode } = await request(app).put('/api/books/5000').send({
			name: 'Divina comedia',
			author: 'Dante Alighieri'
		});

		expect(statusCode).toBe(404);

		expect(body).toEqual({
			error: true,
			message: 'Libro no encontrado'
		});
	});

	it('PUT /api/books/:bookid - Exitoso - Libro actualizado con', async () => {
		const { body, statusCode } = await request(app).put('/api/books/2').send({
			name: 'El extranjero',
			author: 'Albert Camus'
		});

		expect(statusCode).toBe(201);

		expect(body).toEqual({
			name: 'El extranjero',
			author: 'Albert Camus',
			id: 2
		});
	});

	it('DELETE /api/books/:bookid - Faild, no se encontro el libro', async () => {
		const { body, statusCode } = await request(app).delete('/api/books/5000');
		expect(statusCode).toBe(404);

		expect(body).toEqual({
			error: true,
			message: 'Libro no encontrado'
		});
	});

	it('DELETE /api/books/:bookid - Faild, no se encontro el libro', async () => {
		const { body, statusCode } = await request(app).delete('/api/books/3');
		expect(statusCode).toBe(201);
		expect(body).toEqual({
			message: 'Exitoso'
		});
	});
});
