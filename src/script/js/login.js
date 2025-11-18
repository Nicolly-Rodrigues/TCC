 document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form");

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
      alert("Preencha email e senha.");
      return;
    }

    const dados = { email, senha };

    try {
      const resposta = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        alert(`Login bem-sucedido! Bem-vindo(a), ${resultado.nome}`);
        // Aqui você pode salvar o token no localStorage se quiser persistir a sessão
        localStorage.setItem("token", resultado.token);
        // Redirecionar para página privada
        window.location.href = "/src/index.html";
      } else {
        alert(resultado.erro);
      }
    } catch (erro) {
      console.error(erro);
      alert("Erro de conexão com o servidor.");
    }
  });
});
