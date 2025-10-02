from rest_framework import serializers
from .models import Categoria, Produto, ProdutoVariacao

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
