# **Biscoiteras** - https://redesocial-18fde.firebaseapp.com/

## Criando uma rede social

### Preâmbulo

Instagram, Snapchat, Twitter, Facebook, Twitch, Linkedin, etc. As redes sociais invadiram nossas vidas. Nós as amamos ou odiamos, e muitas pessoas não conseguem viver sem elas.
Há redes sociais de todo tipo para todos os tipos de interesse. Por exemplo, em uma rodada de financiamento com investidores, foi apresentada uma rede social para químicos onde os usuários podem publicar artigos a respeito de suas pesquisas, comentar os artigos de seus colegas e filtrar artigos de acordo com determinadas tags ou popularidade, mais recente ou mais comentado.

## Definição de Produto

### Introdução

Uma empreendedora nos encarregou de criar uma rede social. Não nos deu muitos detalhes sobre que tipo de rede social ela quer, apenas nos solicita que a façamos o melhor que pudermos para que seja lançada logo no mercado. 
Optamos por criar uma rede social chamada **Biscoiteras**, uma rede segura para mulheres de todas as idades em que a usuária pode contribuir para elevar a autoestima de outras mulheres e também ter suporte para si.

### Necessidades dos Usuários
Realizamos uma pesquisa em que perguntávamos às usuárias como elas se sentiam com relação às suas aparências e 63% das entrevistadas responderam que se sentem de neutras a ruins e 68% se sentem desconfortáveis após usar alguma rede social. Quando perguntamos se elas gostariam de ter uma rede social somente para mulheres e voltada para a autoestima, 95% responderam que sim. Foi questionado também o que elas gostariam de ver nessa rede social e responderam: textos sobre autoestima, referências de conteúdo com diversidade de mulheres, fotos reais sem filtros, muito apoio mútuo, empatia, correntes de elogio e mulheres reais.

Com base na pesquisa e após a criação de três personas (segue arquivo em anexo, personas.doc), nossa proposta é aumentar a autoestima, proporcionando um ambiente seguro para mulheres. Na pesquisa, também perguntamos qual nome para rede social as entrevistadas gostavam mais e **Biscoiteras** ganhou, devido ao meme "dar biscoito", que significa elogiar alguém. Apesar de ser uma expressão com conotação negativa, como um deboche, aqui ela ganha um contexto mais leve, com a proposta de enaltecer a usuária.

## Design da interface de usuário
Foram criados dois protótipos no Marvel:
  * Desktop (https://marvelapp.com/5da20hd/screen/54788995)
  ![Timeline](/public/img/prototype/Desktop-biscoiteras2.png)
  
  * Mobile (https://marvelapp.com/b6g3b27/screen/54750673)
  
  ![Página de login](/public/img/prototype/biscoiteras-mobile.png)
  ![Timeline](/public/img/prototype/biscoiteras-mobile2.png)
  
Pedimos às usuárias que completassem as seguintes tarefas:
  * fazer login;
  * criar um post;
  * comentar um post;
  * dar um biscoito.
  
As reações foram positivas, sem críticas com relação a cores ou design.

## Conclusão dos testes de usuário feitos no HTML
Após a realização dos testes iniciais do produto no HTML, foram identificadas algumas falhas com relação às imagens dos perfis nos comentários e na página Amigas. As correções foram feitas antes da entrega do trabalho final.

## Funcionalidades implementadas
 * Login com Firebase;
 * Validações: usuário repetido, e-mail válido;
 * Autenticação com o Google e e-mail;
 * Texto secreto no input de senha;
 * Mensagens de erro na validação;
 * Publicar um post de texto;
 * Mostrar timeline de posts;
 * Dar likes em posts;
 * Exibir contador de likes;
 * Apagar e editar posts in place;
 * Filtrar posts públicos e privados;
 * Postar fotos;
 * Comentar e exibir comentários em posts;
 * Adicionar amigos à lista exibida na timeline;
 * Sugestões de amizade;
 * Busca poe e-mail de usuários;
 * Página de perfil
 * Editar foto do perfil;
 
 ## Ferramentas
 Bootstrap4, HTML, FirebaseHosting, Firebase Storage, Firebase Realtime Database, Firebase Authentication, Javascript ES6, JQuery, CSS.

