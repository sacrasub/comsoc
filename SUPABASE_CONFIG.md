# 🌐 Guia de Configuração: Ativação da Urna na Nuvem (Supabase)

Este guia prático orienta o administrador do ComSoc sobre como configurar o banco de dados Supabase para permitir que os oficiais realizem seus votos de forma remota a partir de seus próprios celulares ou computadores.

---

## 🔒 Contexto de Segurança
Para fins de segurança de dados e proteção da integridade da urna eletrônica, a chave pública do cliente front-end (`anonKey`) possui permissão apenas de **leitura** e **inserção restrita**. Ela **não pode criar ou alterar tabelas** no banco de dados.

Por este motivo, as tabelas devem ser geradas diretamente por você a partir do painel de administração da sua conta do Supabase.

---

## 📋 Passo a Passo para Ativar a Nuvem

### Passo 1: Acesse seu painel do Supabase
* Abra o seu navegador de internet de preferência.
* Acesse a URL: **[https://supabase.com/dashboard](https://supabase.com/dashboard)**.
* Faça login na sua conta e selecione o projeto correspondente à Capitania Fluvial de Tabatinga (**CFT**).

---

### Passo 2: Abra o Editor SQL (SQL Editor)
* No menu lateral esquerdo do painel do Supabase, localize a barra de navegação.
* Clique no ícone do **SQL Editor** (representado pelo símbolo de terminal/código: `>_`).

---

### Passo 3: Crie uma Nova Query SQL
* Na tela do SQL Editor, clique no botão **"+ New Query"** ou **"New Query"** no topo da tela para abrir uma aba de editor de texto vazia.

---

### Passo 4: Cole o Script de Banco de Dados
* Abra o arquivo local [supabase-sev-votacao.sql](file:///c:/Projetos/Marinha/ComSoc/supabase-sev-votacao.sql) que criamos na raiz do seu projeto.
* Copie todo o código contido no arquivo.
* Cole o código copiado dentro do editor de texto em branco no painel do Supabase.

---

### Passo 5: Execute o Script (Run)
* No canto inferior direito da tela do editor de texto, clique no botão verde **Run** (ou pressione `Ctrl + Enter` no teclado).
* Certifique-se de que a mensagem de retorno na parte inferior exiba `Success` ou `Query returned successfully`.

---

## 🎉 Pronto! Urna Conectada

Com a execução bem-sucedida do script:
1. O site público hospedado na Vercel (**[https://comsoc.vercel.app](https://comsoc.vercel.app)**) se conectará de forma transparente.
2. Cada voto depositado em celulares de oficiais será armazenado em tempo real no banco de dados compartilhado.
3. A tela do administrador atualizará automaticamente o progresso a cada 15 segundos sem necessidade de recarregar a página.

> [!IMPORTANT]
> A integração híbrida permite que os eleitores não sintam nenhuma lentidão. Caso a internet de algum militar caia durante o processo, o aplicativo tentará retransmitir o voto em background assim que a conexão for restabelecida.
