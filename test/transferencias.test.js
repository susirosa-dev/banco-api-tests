const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Transferências', () => {

    let token; 
    // Antes de executar os testes, faça login para obter o token
    before(async () => {

        const response = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')  // Request body é JSON
            .send({
                username: 'julio.lima',
                senha: '123456'
            });

        expect(response.status).to.equal(200);
        expect(response.body.token).to.be.a('string').and.not.be.empty;

        token = response.body.token;
    });


    describe('POST /transferências', () => {
        
        it('Deve retornar sucesso com 201 quando a transferência for igual ou acima de 10,00 reais', async () => {

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')  // Request body é JSON
                .set('Authorization', `Bearer ${token}`)  // Set é para Headers
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 10,
                    token: "" 
                });

            expect(resposta.status).to.equal(201);
            //console.log('Transferência criada:', resposta.body);
        });
        
        it('Deve retornar falha com 422 quando a transferência for menor que 10,00 reais', async () => {

            const response = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)  // Set é para Headers
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 9,
                    token: "" 
                });

            expect(response.status).to.equal(422);           
        });

        it('Deve retornar falha com 401 quando a transferência tiver token inválido.', async () => {

            const response = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${'token_invalido'}`)  // Set é para Headers
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 20,
                    token: "" 
                });

            expect(response.status).to.equal(401);  
        });

        it('Deve retornar falha com 405 quando a transferência usar método não permitido.', async () => {

            const response = await request(process.env.BASE_URL)
                .patch('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${'token'}`)  // Set é para Headers
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 20,
                    token: "" 
                });

            expect(response.status).to.equal(405);  
        });



    });
    
    describe('GET /transferências', () => {
        it('Lista as transferências realizadas', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/transferencias')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            //console.log('Transferências:', response.body);
        });

        it('Consulta uma transferência específica', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/transferencias/1')  // Exemplo de ID de transferência
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            //console.log('Transferências:', response.body);
        });

        it('Consulta uma transferência - não autorizada. Erro 401.', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/transferencias/1')  // Exemplo de ID de transferência
                .set('Authorization', `Bearer ${'token_invalido'}`); // Passando token inválido

            expect(response.status).to.equal(401);            
        });

        it('Consulta uma transferência - não encontrada. Erro 404.', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/transferencias/99999999999')  // Está passando no teste com cod. 200, o que está errado.
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);            
        });

        it('Consulta uma transferência com método não permitido. Erro 405.', async () => {

            const response = await request(process.env.BASE_URL)
                .post('/transferencias/99999')  // Está passando no teste com cod. 404, o que está errado.
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(405);            
        });

        it('Erro interno - 500.', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/transferencias/1')  // Derrubar o BD para simular erro interno
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(500);            
        });

    });

});