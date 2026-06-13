# Dados de Demonstração — Granizo App

Use estes JSONs no Thunder Client, sempre na ordem abaixo (existem dependências entre as tabelas).

**IMPORTANTE:** Para produção, lembre de:
1. Acordar o backend: `GET https://granizo-app-backend.onrender.com/api/marcas`
2. Cadastrar o usuário admin (veja seção final)
3. Trocar a URL base conforme o ambiente:
   - Local: `http://localhost:3001/api`
   - Produção: `https://granizo-app-backend.onrender.com/api`

---

## 1. MARCAS
`POST {{baseUrl}}/marcas`

```json
{ "marca": "Volkswagen" }
```
```json
{ "marca": "Fiat" }
```
```json
{ "marca": "Chevrolet" }
```
```json
{ "marca": "Toyota" }
```
```json
{ "marca": "Hyundai" }
```

---

## 2. MODELOS
`POST {{baseUrl}}/modelos`

> Ajuste `id_marca` conforme os IDs retornados no passo anterior (geralmente 1=Volkswagen, 2=Fiat, 3=Chevrolet, 4=Toyota, 5=Hyundai)

```json
{ "modelo": "Gol", "id_marca": 1 }
```
```json
{ "modelo": "Polo", "id_marca": 1 }
```
```json
{ "modelo": "Argo", "id_marca": 2 }
```
```json
{ "modelo": "Strada", "id_marca": 2 }
```
```json
{ "modelo": "Onix", "id_marca": 3 }
```
```json
{ "modelo": "Tracker", "id_marca": 3 }
```
```json
{ "modelo": "Corolla", "id_marca": 4 }
```
```json
{ "modelo": "Hilux", "id_marca": 4 }
```
```json
{ "modelo": "HB20", "id_marca": 5 }
```
```json
{ "modelo": "Creta", "id_marca": 5 }
```

---

## 3. CLIENTES
`POST {{baseUrl}}/clientes`

```json
{
  "nome": "Mario Rossi",
  "endereco": "Via Roma, 45",
  "cidade": "Padova",
  "telefone": "+39 333 1234567",
  "contato": "mario.rossi@email.it",
  "tipo_contato": "email"
}
```
```json
{
  "nome": "Giulia Bianchi",
  "endereco": "Via Garibaldi, 12",
  "cidade": "Abano Terme",
  "telefone": "+39 347 7654321",
  "contato": "giulia.bianchi@email.it",
  "tipo_contato": "whatsapp"
}
```
```json
{
  "nome": "Luca Ferrari",
  "endereco": "Corso Milano, 88",
  "cidade": "Vicenza",
  "telefone": "+39 320 9988776",
  "contato": "luca.ferrari@email.it",
  "tipo_contato": "telefone"
}
```
```json
{
  "nome": "Sara Conti",
  "endereco": "Via Venezia, 23",
  "cidade": "Padova",
  "telefone": "+39 348 1122334",
  "contato": "sara.conti@email.it",
  "tipo_contato": "email"
}
```
```json
{
  "nome": "Marco Esposito",
  "endereco": "Via Torino, 67",
  "cidade": "Verona",
  "telefone": "+39 339 5566778",
  "contato": "marco.esposito@email.it",
  "tipo_contato": "whatsapp"
}
```

---

## 4. TÉCNICOS
`POST {{baseUrl}}/tecnicos`

```json
{
  "nome": "Andrea Colombo",
  "cidade": "Padova",
  "endereco": "Via dei Mestieri, 10",
  "telefone": "+39 345 1112233",
  "email": "andrea.colombo@email.it",
  "iban": "IT60X0542811101000000123456"
}
```
```json
{
  "nome": "Francesca Romano",
  "cidade": "Abano Terme",
  "endereco": "Via dell'Officina, 5",
  "telefone": "+39 346 4455667",
  "email": "francesca.romano@email.it",
  "iban": "IT28W0300203280000004567890"
}
```
```json
{
  "nome": "Davide Moretti",
  "cidade": "Vicenza",
  "endereco": "Via Industriale, 33",
  "telefone": "+39 347 7788990",
  "email": "davide.moretti@email.it",
  "iban": "IT90Y0301503200000003456789"
}
```

---

## 5. VEÍCULOS
`POST {{baseUrl}}/veiculos`

> Ajuste `id_cliente`, `id_marca`, `id_modelo` e `id_tecnico` conforme os IDs reais cadastrados.

```json
{
  "placa": "FX847GH",
  "id_cliente": 1,
  "id_marca": 1,
  "id_modelo": 1,
  "qtde_amassados": 8,
  "trabalho_a_frio": 1,
  "pintura": 0,
  "pecas_para_trocar": "",
  "id_tecnico": 1,
  "riscos_amassados": "Capô, teto e porta-malas",
  "faturar": 1,
  "data_entrada": "2026-06-01"
}
```
```json
{
  "placa": "GH123KL",
  "id_cliente": 2,
  "id_marca": 3,
  "id_modelo": 5,
  "qtde_amassados": 15,
  "trabalho_a_frio": 0,
  "pintura": 1,
  "pecas_para_trocar": "Para-choque traseiro, retrovisor direito",
  "id_tecnico": 2,
  "riscos_amassados": "Teto, capô e porta dianteira esquerda",
  "faturar": 1,
  "data_entrada": "2026-06-03"
}
```
```json
{
  "placa": "JK456MN",
  "id_cliente": 3,
  "id_marca": 4,
  "id_modelo": 7,
  "qtde_amassados": 4,
  "trabalho_a_frio": 1,
  "pintura": 0,
  "pecas_para_trocar": "",
  "id_tecnico": 1,
  "riscos_amassados": "Teto apenas",
  "faturar": 0,
  "data_entrada": "2026-06-05"
}
```
```json
{
  "placa": "LM789OP",
  "id_cliente": 4,
  "id_marca": 5,
  "id_modelo": 9,
  "qtde_amassados": 22,
  "trabalho_a_frio": 0,
  "pintura": 1,
  "pecas_para_trocar": "Capô completo",
  "id_tecnico": 3,
  "riscos_amassados": "Capô, teto, porta-malas e teto solar",
  "faturar": 1,
  "data_entrada": "2026-06-08"
}
```
```json
{
  "placa": "QR234ST",
  "id_cliente": 5,
  "id_marca": 2,
  "id_modelo": 3,
  "qtde_amassados": 6,
  "trabalho_a_frio": 1,
  "pintura": 0,
  "pecas_para_trocar": "",
  "id_tecnico": 2,
  "riscos_amassados": "Teto e capô",
  "faturar": 1,
  "data_entrada": "2026-06-10"
}
```
```json
{
  "placa": "UV567WX",
  "id_cliente": 1,
  "id_marca": 1,
  "id_modelo": 2,
  "qtde_amassados": 10,
  "trabalho_a_frio": 1,
  "pintura": 0,
  "pecas_para_trocar": "",
  "id_tecnico": null,
  "riscos_amassados": "Teto e laterais",
  "faturar": 0,
  "data_entrada": "2026-06-12"
}
```

---

## 6. ATUALIZAR STATUS (para variar os dados no dashboard)
`PATCH {{baseUrl}}/veiculos/{id}/status`

> Use ids 1 a 6, variando os status abaixo para o dashboard ficar com dados interessantes

```json
{ "status": "em_servico" }
```
```json
{ "status": "aguardando_peca" }
```
```json
{ "status": "concluido" }
```
```json
{ "status": "entregue" }
```
```json
{ "status": "em_analise" }
```

---

## USUÁRIO ADMIN (sempre necessário em produção nova)
`POST {{baseUrl}}/auth/registrar`

```json
{
  "nome": "Luiz Moreira",
  "email": "luizitus@gmail.com",
  "senha": "admin123",
  "perfil": "admin"
}
```

---

## ROTEIRO RÁPIDO PARA DEMONSTRAÇÃO

1. Acordar backend (GET em `/marcas`)
2. Registrar usuário admin
3. Cadastrar as 5 marcas (na ordem)
4. Cadastrar os 10 modelos (na ordem, ajustando id_marca se necessário)
5. Cadastrar os 5 clientes
6. Cadastrar os 3 técnicos
7. Cadastrar os 6 veículos
8. Variar 3-4 status para os gráficos ficarem interessantes
9. Fazer login no sistema e mostrar o dashboard!
