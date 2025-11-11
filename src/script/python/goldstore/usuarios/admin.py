from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Endereco, Categoria, Produto, ProdutoVariacao

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ('username', 'email', 'cpf', 'telefone', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Informações adicionais', {'fields': ('cpf', 'telefone')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informações adicionais', {'fields': ('cpf', 'telefone')}),
    )

@admin.register(Endereco)
class EnderecoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'rua', 'numero', 'cidade', 'estado', 'cep')

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nome',)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'preco', 'categoria')
    list_filter = ('categoria',)
    search_fields = ('nome', 'descricao')

@admin.register(ProdutoVariacao)
class ProdutoVariacaoAdmin(admin.ModelAdmin):
    list_display = ('produto', 'tamanho', 'estoque')
    list_filter = ('tamanho',)

