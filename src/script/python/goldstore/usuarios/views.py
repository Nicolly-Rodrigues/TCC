from rest_framework import generics
from .models import Categoria, Produto, ProdutoVariacao
from .serializers import CategoriaSerializer, ProdutoSerializer, ProdutoVariacaoSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsuarioSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

class CadastroUsuarioAPIView(APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mensagem": "Usuário criado com sucesso"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login
class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        senha = request.data.get("senha")
        user = authenticate(username=email, password=senha)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "nome": user.first_name})
        return Response({"erro": "Email ou senha inválidos"}, status=status.HTTP_400_BAD_REQUEST)
# ---------- Categorias ----------
class CategoriaList(generics.ListCreateAPIView):
    queryset = Categoria.objects.all() 
    serializer_class = CategoriaSerializer

class CategoriaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

# ---------- Produtos ----------
class ProdutoList(generics.ListCreateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class ProdutoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

# ---------- Variações de Produto (Tamanhos + Estoque) ----------
class ProdutoVariacaoList(generics.ListCreateAPIView):
    queryset = ProdutoVariacao.objects.all()
    serializer_class = ProdutoVariacaoSerializer

class ProdutoVariacaoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProdutoVariacao.objects.all()
    serializer_class = ProdutoVariacaoSerializer
