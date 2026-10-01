const request = require('supertest');
const { expect } = require('chai');

describe('Testes de Transferência com login autorizado', () => {

    let token;

    before(async () => {

        const response = await request('http://localhost:3000')
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({
                username: 'julio.lima',
                senha: '123456'
            });

        expect(response.status).to.equal(200);
        expect(response.body.token).to.be.a('string').and.not.be.empty;

        token = response.body.token;
    });


    it('Deve criar uma transferência', async () => {

        const response = await request('http://localhost:3000')
            .post('/transferencias')
            .set('Authorization', `Bearer ${token}`)
            .send({
                contaOrigem: 1,
                contaDestino: 2,
                valor: 100
            });

        expect(response.status).to.equal(201);
        //console.log('Transferência criada:', response.body);

    });

    it('Deve listar as transferências', async () => {

        const response = await request('http://localhost:3000')
            .get('/transferencias')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        console.log('Transferências:', response.body);
    });
});