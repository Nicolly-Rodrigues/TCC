from rest_framework import serializers
from .models import Categoria, Produto, ProdutoVariacao
from django.contrib.auth.password_validation import validate_password
from .models import Usuario, Endereco

from rest_framework import serializers


class UsuarioSerializer(serializers.ModelSerializer):
    # Campo virtual para nome completo
    nome = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        # Campos existentes no modelo + campo virtual 'nome'
        fields = ['username', 'password', 'cpf', 'telefone', 'first_name', 'last_name', 'nome']
        extra_kwargs = {
            'password': {'write_only': True},  # senha não é retornada
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    # Método que retorna o nome completo
    def get_nome(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    # Sobrescreve o create para salvar senha com hash
    def create(self, validated_data):
        password = validated_data.pop('password')
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario

# Categoria
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# Variação de produto (tamanhos e estoque)
class ProdutoVariacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoVariacao
        fields = ['id', 'produto' , 'tamanho', 'estoque']

# Produto com relação à categoria e variações
class ProdutoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        source='categoria',
        write_only=True
    )

    # Exibe as variações no GET
    variacoes = ProdutoVariacaoSerializer(many=True, read_only=True)

    class Meta:
        model = Produto
        fields = [
            'id',
            'nome',
            'descricao',
            'preco',
            'imagem',
            'categoria',
            'categoria_id',
            'variacoes',
        ]
from .models import Pedido, ItemPedido, ProdutoVariacao

# Item dentro do pedido
class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = ['variacao', 'quantidade', 'preco_unitario']


# Serializer usado ao FINALIZAR o pedido (requisição do frontend)
class FinalizarPedidoItemSerializer(serializers.Serializer):
    variacao_id = serializers.IntegerField()
    quantidade = serializers.IntegerField()


class FinalizarPedidoSerializer(serializers.Serializer):
    usuario_id = serializers.IntegerField(required=False)
    endereco_id = serializers.IntegerField(required=False)
    itens = FinalizarPedidoItemSerializer(many=True)
class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'endereco_entrega', 'total', 'data_criacao', 'itens']
