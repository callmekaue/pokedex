<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=DC0A2D&height=240&section=header&text=POK%C3%89DEX&fontSize=54&fontColor=FFFFFF&animation=fadeIn&fontAlignY=36&desc=Busque%20Pok%C3%A9mon%20pelo%20nome%20ou%20n%C3%BAmero&descAlignY=62&descSize=18" alt="Pokédex — busque Pokémon pelo nome ou número">
</div>

<p align="center">
  <a href="https://www.pokemon.com/">
    <img src="https://img.shields.io/badge/Tema-Pokémon-DC0A2D?style=for-the-badge&labelColor=1C1C1C" alt="Tema Pokémon">
  </a>
  <a href="https://pokeapi.co/">
    <img src="https://img.shields.io/badge/Dados-PokéAPI-3B4CCA?style=for-the-badge&labelColor=DC0A2D" alt="PokéAPI">
  </a>
  <a href="https://github.com/callmekaue/pokedex">
    <img src="https://img.shields.io/badge/Repositório-pokedex-FFCB05?style=for-the-badge&labelColor=1C1C1C&logo=github&logoColor=FFFFFF" alt="Repositório pokedex">
  </a>
  <a href="https://github.com/callmekaue">
    <img src="https://img.shields.io/badge/Autor-Kauê-FFFFFF?style=for-the-badge&labelColor=DC0A2D" alt="Autor Kauê">
  </a>
</p>

<img src="https://capsule-render.vercel.app/api?type=rect&color=1C1C1C&height=6" alt="">
<img src="https://capsule-render.vercel.app/api?type=rect&color=FFFFFF&height=4" alt="">
<img src="https://capsule-render.vercel.app/api?type=rect&color=DC0A2D&height=10" alt="">
<img src="https://capsule-render.vercel.app/api?type=rect&color=FFCB05&height=4" alt="">

<p align="center">
  <a href="#apresentacao">Apresentação</a> ·
  <a href="#demonstracao">Demonstração</a> ·
  <a href="#preview">Preview</a> ·
  <a href="#tecnologias">Tecnologias</a> ·
  <a href="#estrutura">Estrutura</a> ·
  <a href="#como-executar">Como executar</a> ·
  <a href="#objetivo">Objetivo</a> ·
  <a href="#aprendizados">Aprendizados</a> ·
  <a href="#contribuicoes">Contribuições</a> ·
  <a href="#aviso">Aviso</a>
</p>

<h2 id="apresentacao">Apresentação</h2>

Esta **Pokédex** é um estudo de Front-End em HTML, CSS e JavaScript. A proposta é pesquisar Pokémon e ler as informações na tela com o ritmo de um aparelho clássico: vermelho na carcaça, tela escura no centro, busca direta pelo nome ou pelo número.

A interface busca a leitura rápida de uma Pokédex de bolso, não o cliente oficial dos jogos. Os dados da espécie vêm de uma API pública quando a aplicação está configurada para isso; Pokémon, Pokédex e nomes das espécies continuam sendo marcas de seus respectivos donos.

<h2 id="demonstracao">Demonstração</h2>

A aplicação permite:

- buscar Pokémon pelo nome ou pelo número
- exibir a imagem do Pokémon encontrado
- visualizar informações básicas da entrada
- usar um layout inspirado em uma Pokédex clássica
- navegar de forma simples e responsiva

O fluxo previsto é o de um dispositivo: informar o identificador, consultar o registro e ver o resultado na “tela”.

```mermaid
flowchart LR
    A[Nome ou numero] --> B[Busca]
    B --> C[Dados JSON]
    C --> D[Imagem e ficha]

    classDef vermelho fill:#DC0A2D,stroke:#1C1C1C,color:#FFFFFF
    classDef tela fill:#1C1C1C,stroke:#DC0A2D,color:#FFFFFF
    classDef amarelo fill:#FFCB05,stroke:#1C1C1C,color:#1C1C1C
    class A vermelho
    class B,C tela
    class D amarelo
```

<h2 id="preview">Preview</h2>

Quando o arquivo `pokedex.png` estiver na raiz do repositório, o GitHub exibe a captura abaixo.

![Preview da Pokédex](pokedex.png)

Se a imagem não carregar, abra `index.html` no navegador para ver a interface completa.

<h2 id="tecnologias">Tecnologias</h2>

<p align="center">
  <img src="https://skillicons.dev/icons?i=html,css,js" alt="HTML, CSS e JavaScript">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-DC0A2D?style=flat-square&logo=html5&logoColor=FFFFFF" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-3B4CCA?style=flat-square&logo=css3&logoColor=FFFFFF" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-FFCB05?style=flat-square&logo=javascript&logoColor=1C1C1C" alt="JavaScript">
  <img src="https://img.shields.io/badge/PokéAPI-1C1C1C?style=flat-square&labelColor=DC0A2D" alt="PokéAPI">
</p>

| Tecnologia | Papel |
| --- | --- |
| HTML5 | Estrutura da Pokédex e da área de busca |
| CSS3 | Carcaça vermelha, tela, tipografia e responsividade |
| JavaScript | Eventos, DOM e leitura dos dados |
| PokéAPI | Fonte pública típica para nome, número, sprite e ficha |

A PokéAPI é citada como origem prevista dos registros. A aplicação precisa de conexão com a internet para buscar dados remotos.

<h2 id="estrutura">Estrutura do projeto</h2>

```text
pokedex/
├── index.html
├── style.css
├── script.js
├── pokedex.png
├── favicon-16x16.png
├── Pokebola-pokeball-png-0.png
└── README.md
```

Não há etapa de build. HTML, CSS e JavaScript na raiz são suficientes para abrir o projeto no navegador.

<h2 id="como-executar">Como executar</h2>

```bash
git clone https://github.com/callmekaue/pokedex.git
cd pokedex
```

Abra `index.html` no navegador ou sirva a pasta com a extensão Live Server no Visual Studio Code / Cursor.

<h2 id="objetivo">Objetivo</h2>

Praticar, em uma interface reconhecível:

- manipulação do DOM com JavaScript
- consumo de APIs
- desenvolvimento Front-End
- estruturação de interfaces web
- estilização com CSS

<h2 id="aprendizados">Aprendizados</h2>

- requisições assíncronas
- tratamento de dados JSON
- eventos em JavaScript
- responsividade
- organização de código Front-End

<h2 id="contribuicoes">Contribuições</h2>

Sugestões de busca, acessibilidade e fidelidade visual são bem-vindas.

```bash
git checkout -b minha-feature
git commit -m "Minha nova feature"
git push origin minha-feature
```

Abra um Pull Request em [github.com/callmekaue/pokedex](https://github.com/callmekaue/pokedex).

<h2 id="autor">Autor</h2>

Desenvolvido por **Kauê**.

GitHub: [github.com/callmekaue](https://github.com/callmekaue)

<h2 id="aviso">Aviso</h2>

Pokémon e Pokédex são marcas de Nintendo, Game Freak e Creatures. Este repositório é um projeto educacional de Front-End, **sem vínculo oficial** com a The Pokémon Company ou com os jogos.

A PokéAPI é um serviço da comunidade e também não é um produto oficial.

<img src="https://capsule-render.vercel.app/api?type=rect&color=DC0A2D&height=8" alt="">

<p align="center">
  <strong>Pokédex</strong><br>
  vermelho · tela · registro<br>
  HTML · CSS · JavaScript
</p>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=1C1C1C&height=150&section=footer&fontColor=FFCB05&text=gotta%20search%20%27em%20all&fontSize=18&fontAlignY=70&animation=fadeIn" alt="gotta search 'em all">
</div>
