from rest_framework import generics
from .models import Categoria, Produto, ProdutoVariacao
from .serializers import CategoriaSerializer, ProdutoSerializer, ProdutoVariacaoSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsuarioSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import  Pedido, ItemPedido, Usuario, Endereco
from .serializers import FinalizarPedidoSerializer, PedidoSerializer

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # 🔒 Exige login
def finalizar_pedido(request):
    serializer = FinalizarPedidoSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    dados = serializer.validated_data

    usuario = request.user  # ← agora pega o usuário logado direto daqui

    endereco_id = dados.get('endereco_id')
    itens = dados['itens']

    # Validar endereço (do usuário logado)
    endereco = None
    if endereco_id:
        try:
            endereco = Endereco.objects.get(id=endereco_id, usuario=usuario)
        except Endereco.DoesNotExist:
            return Response({"erro": "Endereço não encontrado"}, status=404)

    # Criar o pedido
    pedido = Pedido.objects.create(
        usuario=usuario,
        endereco_entrega=endereco,
        total=0
    )

    total_pedido = 0

    for item in itens:
        variacao_id = item['variacao_id']
        quantidade = item['quantidade']

        try:
            variacao = ProdutoVariacao.objects.get(id=variacao_id)
        except ProdutoVariacao.DoesNotExist:
            return Response({"erro": f"Variação {variacao_id} não existe"}, status=404)

        if variacao.estoque < quantidade:
            return Response(
                {"erro": f"Estoque insuficiente para {variacao.produto.nome} tamanho {variacao.tamanho}"},
                status=400
            )

        variacao.estoque -= quantidade
        variacao.save()

        preco_unitario = variacao.produto.preco
        subtotal = preco_unitario * quantidade
        total_pedido += subtotal

        ItemPedido.objects.create(
            pedido=pedido,
            variacao=variacao,
            quantidade=quantidade,
            preco_unitario=preco_unitario
        )

    pedido.total = total_pedido
    pedido.save()

    return Response({
        "mensagem": "Pedido finalizado com sucesso!",
        "pedido_id": pedido.id,
        "total": float(total_pedido)
    }, status=201)