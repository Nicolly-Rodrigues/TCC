from django.urls import path
from .views import (
    CategoriaList, CategoriaDetail,
    ProdutoList, ProdutoDetail,
    ProdutoVariacaoList, ProdutoVariacaoDetail
)

urlpatterns = [
    # Categorias
    path('categorias/', CategoriaList.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', CategoriaDetail.as_view(), name='categoria-detail'),

    # Produtos
    path('produtos/', ProdutoList.as_view(), name='produto-list'),
    path('produtos/<int:pk>/', ProdutoDetail.as_view(), name='produto-detail'),

    # Variações (Tamanhos + Estoque)
    path('variacoes/', ProdutoVariacaoList.as_view(), name='variacao-list'),
    path('variacoes/<int:pk>/', ProdutoVariacaoDetail.as_view(), name='variacao-detail'),
]
