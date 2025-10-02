from rest_framework import generics
from .models import Categoria, Produto, ProdutoVariacao
from .serializers import CategoriaSerializer, ProdutoSerializer, ProdutoVariacaoSerializer

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
