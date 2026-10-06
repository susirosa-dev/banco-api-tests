const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao'); // Importar a função de autenticação
const postTransferencias = require('../fixture/postTransferencias.json'); // Importar o arquivo JSON com os dados da transferência  


describe('Transferências', () => {
    
    let token;    
    // Método before() é um Hook, executado antes de todos os testes dentro do describe
    before(async () => {
        token = await obterToken(process.env.BANCO_USUARIO, process.env.BANCO_SENHA); // Obter o token usando a função de autenticação
    });

    // Posso utilizar o BeforeEach() para executar algo antes de cada teste (it), se necessário.
    // Método after() é um Hook, executado depois de todos os testes dentro do describe
    // Método afterEach() é um Hook, executado depois de cada teste (it) dentro do describe
  
    describe('POST /transferências', () => {
        
        it('Deve retornar sucesso com 201 quando a transferência for igual ou acima de 10,00 reais', async () => {
            const bodyTransferencias = {...postTransferencias, valor: 10            
            };
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')  // Request body é JSON
                .set('Authorization', `Bearer ${token}`)  // Set é para Headers
                .send(bodyTransferencias);

            expect(resposta.status).to.equal(201);
            //console.log('Transferência criada:', resposta.body);
        });
        
        it('Deve retornar falha com 422 quando a transferência for menor que 10,00 reais', async () => {
            const bodyTransferencias = {...postTransferencias, valor: 9            
            };
            const response = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)  // Set é para Headers
                    .send(bodyTransferencias);

            expect(response.status).to.equal(422);           
        });

        it('Deve retornar falha com 401 quando a transferência tiver token inválido.', async () => {
            const bodyTransferencias = {...postTransferencias, valor: 20            
            };
            const response = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${'token_invalido'}`)  // Set é para Headers
                .send(bodyTransferencias);

            expect(response.status).to.equal(401);  
        });

        it('Deve retornar falha com 405 quando a transferência usar método não permitido.', async () => {
            // Valor de transferencia igual ou maior que 5.000,00 reais precisa de token 
            const bodyTransferencias = {...postTransferencias, valor: 5000, token: '123456'          
            };
            const response = await request(process.env.BASE_URL)
                .patch('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${'token'}`)  // Set é para Headers
                .send(bodyTransferencias);      

            expect(response.status).to.equal(405);  
        });



    });
    
    describe('GET /transferências', () => {

        it('Lista as transferências realizadas', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limit=10')  // Exemplo de paginação
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);           
            expect(response.body.limit).to.equal(10);
            expect(response.body.transferencias).to.have.lengthOf(10);

            console.log('Transferências:', response.body);           
          
        });
    });

    describe('GET /transferências/id', () => {

        it('Consulta uma transferência específica - deve retornar 200.', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/transferencias/7')  // Exemplo de ID de transferência
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);

            // Verificações adicionais para garantir que os dados retornados correspondam ao esperado
            expect(response.body.id).to.equal(7); // Verifica se o ID da transferência retornada é igual ao ID consultado   
            expect(response.body.id).to.be.a('number'); // Verifica se o ID da transferência retornada é um número
            expect(response.body.conta_origem_id).to.equal(2); // Verifica se a conta de origem é igual a 2
            expect(response.body.conta_destino_id).to.equal(1); // Verifica se a conta de destino é igual a 1
            expect(response.body.valor).to.equal(50); // Verifica se o valor da transferência é igual a 50
            expect(response.body.conta_origem_id).to.be.a('number'); // Verifica se a conta de origem é um número
            expect(response.body.conta_destino_id).to.be.a('number'); // Verifica se a conta de destino é um número
            expect(response.body.valor).to.be.a('number'); // Verifica se o valor é um número   
           
            console.log('Status: ', response.status);
            console.log('Transferências:', response.body); // Exibir a transferência específica no console
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