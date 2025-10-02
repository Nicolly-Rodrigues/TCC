document.getElementById("cadastroForm").addEventListener("submit", function(event){
    event.preventDefault();

            const nome = document.getElementById("nome").value;
            const cpf = document.getElementById("cpf").value;
            const telefone = document.getElementById("telefone").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            if(nome && cpf && telefone && email && senha){
                alert("Cadastro realizado com sucesso!\n\n" +
                      "Nome: " + nome + "\n" +
                      "CPF: " + cpf + "\n" +
                      "Telefone: " + telefone + "\n" +
                      "E-mail: " + email);

                console.log("Novo cadastro:");
                console.log("Nome:", nome);
                console.log("CPF:", cpf);
                console.log("Telefone:", telefone);
                console.log("E-mail:", email);
                console.log("Senha:", senha);
            } else {
                alert("Por favor, preencha todos os campos.");
            }
        });
