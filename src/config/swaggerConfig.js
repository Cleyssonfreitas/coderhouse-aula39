import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Especifique a versão do OpenAPI que deseja utilizar
    info: {
      title: 'Documentação da API', // Título da sua API
      version: '1.0.0', // Versão da sua API
      description: 'Documentação da API para o projeto de programação',
    },
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos que contêm as rotas a serem documentadas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;