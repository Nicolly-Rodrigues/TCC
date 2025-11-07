from django.db import models
from django.contrib.auth.models import AbstractUser

# Usuário personalizado
class Usuario(AbstractUser):
    cpf = models.CharField(max_length=11, unique=True)
    telefone = models.CharField(max_length=15)

    def __str__(self):
        return self.username 

# Endereço do usuário
class Endereco(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    rua = models.CharField(max_length=100)
    numero = models.CharField(max_length=10)
    cidade = models.CharField(max_length=50)
    estado = models.CharField(max_length=2)
    cep = models.CharField(max_length=10)

# Categoria de produto
class Categoria(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

# Produto principal (sem tamanho)
class Produto(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, related_name='produtos', on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)

    def __str__(self):
        return self.nome

# Variações do produto (tamanhos + estoque)
class ProdutoVariacao(models.Model):
    TAMANHOS = [
        ('PP', 'PP'),
        ('P', 'P'),
        ('M', 'M'),
        ('G', 'G'),
        ('GG', 'GG'),
        ('U', 'Único'),
    ]

    produto = models.ForeignKey(Produto, related_name='variacoes', on_delete=models.CASCADE)
    tamanho = models.CharField(max_length=2, choices=TAMANHOS)
    estoque = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.produto.nome} - Tamanho {self.tamanho} (Estoque: {self.estoque})"
