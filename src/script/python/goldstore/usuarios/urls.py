from django.urls import path
from .views import (
    CategoriaList, CategoriaDetail,
    ProdutoList, ProdutoDetail,
    ProdutoVariacaoList, ProdutoVariacaoDetail,
    CadastroUsuarioAPIView, LoginAPIView,
    finalizar_pedido   # <-- AQUI!
)

urlpatterns = [
    # Cadastro e login
    path('cadastro/', CadastroUsuarioAPIView.as_view(), name='cadastro-usuario'),
    path('login/', LoginAPIView.as_view(), name='login-usuario'),

    # Categorias
    path('categorias/', CategoriaList.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', CategoriaDetail.as_view(), name='categoria-detail'),

    # Produtos
    path('produtos/', ProdutoList.as_view(), name='produto-list'),
    path('produtos/<int:pk>/', ProdutoDetail.as_view(), name='produto-detail'),

    # Variações
    path('variacoes/', ProdutoVariacaoList.as_view(), name='variacao-list'),
    path('variacoes/<int:pk>/', ProdutoVariacaoDetail.as_view(), name='variacao-detail'),

    # Finalizar pedido
    path('finalizar-pedido/', finalizar_pedido, name='finalizar-pedido'),
]
