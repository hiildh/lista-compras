# Lista de Compras

Este é o projeto de uma aplicação de lista de compras desenvolvida para dispositivos móveis.

## Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente:

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://expo.dev/)

### Passos para Rodar

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/hiildh/lista-compras.git
    cd lista-compras
    ```

2. **Instale as dependências**:
    ```bash
    npm install
    # ou
    yarn install
    ```

3. **Inicie o servidor de desenvolvimento**:
    ```bash
    npx expo start -c 
    # ou
    yarn start
    ```

4. **Execute no dispositivo ou emulador**:
    - Escaneie o QR Code com o aplicativo Expo Go.
    - Ou configure um emulador Android/iOS para rodar o projeto.

### Estrutura do Projeto

- `/src`: Contém os arquivos principais do projeto.
- `/assets`: Contém os recursos estáticos, como imagens e fontes.

### Tecnologias Utilizadas

- React Native
- Expo 
- Firebase Realtime Database
- Axios
- AsyncStorage
- React Navigation
- React Native Gesture Handler

### Funcionalidades

- Cadastro e login de usuários
- Criação, edição e exclusão de listas de compras
- Adição e remoção de itens nas listas
- Marcar/desmarcar itens como comprados
- Sincronização offline/online automática
- Gerenciamento de famílias (criar, entrar, visualizar membros)
- Convite de membros por código ou e-mail
- Histórico de compras

### Configuração do Firebase

> **Importante:** Para rodar o app, é necessário configurar o Firebase Realtime Database e as regras de segurança.  
> Veja o arquivo `firebaseConfig.js` e adicione suas credenciais do Firebase.

**Exemplo de regra para indexação:**
```json
"families": {
  ".indexOn": ["code"]
}
```

<!-- ### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto para configurar a URL da API, se necessário:
```
API_URL=http://SEU_IP:8000
``` -->

### Contribuição

Sinta-se à vontade para contribuir com melhorias. Faça um fork do repositório, crie uma branch e envie um pull request.

---

**Dúvidas ou sugestões?**  
Abra uma issue ou entre em contato!
