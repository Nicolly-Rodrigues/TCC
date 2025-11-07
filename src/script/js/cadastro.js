
// Aguarda o HTML carregar antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Coleta os valores dos campos
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Verifica se todos foram preenchidos
    if (!nome || !cpf || !telefone || !email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Monta o corpo da requisição conforme o serializer (usando 'nome')
    const dados = {
        username: email,        // ou outro campo que represente o usuário
        password: senha,
        first_name: nome,       // se quiser separar nome e sobrenome, precisará criar campos separados
        last_name: "",           // pode deixar vazio se não tiver sobrenome
        cpf: cpf,
        telefone: telefone
};

    try {
      const resposta = await fetch("http://localhost:8000/api/cadastro/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (resposta.ok) {
                  // Redireciona para a página inicial
        window.location.assign("/inicio.html");
        alert("Usuário cadastrado com sucesso!");
        form.reset();

      } else {
        const erro = await resposta.json();
        alert("Erro ao cadastrar: " + JSON.stringify(erro));
      }
    } catch (erro) {
      alert("Erro de conexão com o servidor.");
      console.error(erro);
    }
  });
});

