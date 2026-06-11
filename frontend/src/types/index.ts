// src/types/index.ts

export interface Cliente {
    id_cliente: number
    nome: string
    endereco?: string
    cidade?: string
    telefone: string
    contato?: string
    tipo_contato?: string
  }

  export interface Marca {
    id_marca: number
    marca: string
  }

  export interface Modelo {
    id_modelo: number
    modelo: string
    id_marca: number
    nome_marca?: string
  }

  export interface Tecnico {
    id_tecnico: number
    nome: string
    cidade?: string
    endereco?: string
    telefone?: string
    email?: string
    iban?: string
  }

  export type StatusVeiculo =
    | 'em_analise'
    | 'em_servico'
    | 'aguardando_peca'
    | 'concluido'
    | 'entregue'

  export interface Veiculo {
    id_veiculo: number
    placa: string
    id_cliente: number
    id_marca: number
    id_modelo: number
    qtde_amassados: number
    trabalho_a_frio: number
    pintura: number
    pecas_para_trocar?: string
    id_tecnico?: number
    riscos_amassados?: string
    faturar: number
    data_chegada_peca?: string
    data_troca_peca?: string
    data_pericia?: string
    data_entrada: string
    data_trabalho?: string
    data_entrega?: string
    status: StatusVeiculo
    cliente_nome?: string
    cliente_telefone?: string
    marca_nome?: string
    modelo_nome?: string
    tecnico_nome?: string
  }

  export interface Foto {
    id_foto: number
    id_veiculo: number
    caminho: string
    tipo: 'entrada' | 'saida'
  }

  export interface Usuario {
    id_usuario: number
    nome: string
    email: string
    perfil: 'admin' | 'operador'
  }

  export interface Resumo {
    total: number
    em_analise: number
    em_servico: number
    aguardando_peca: number
    concluido: number
    entregue: number
  }

  export interface DadosGraficos {
    porStatus: { status: StatusVeiculo; total: number }[]
    porMes: { mes: string; total: number }[]
    porMarca: { marca: string; total: number }[]
    tempoMedio: number
  }