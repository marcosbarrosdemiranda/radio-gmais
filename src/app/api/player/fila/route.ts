import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    // 0. Verificar horário de funcionamento da loja do usuário
    const user = await getCurrentUser();
    if (user && user.lojaId) {
        const loja = db.prepare('SELECT configuracoes FROM lojas WHERE id = ?').get(user.lojaId) as any;
        if (loja && loja.configuracoes) {
            const config = JSON.parse(loja.configuracoes);
            if (config.horarios) {
                const agora = new Date();
                const diaSemana = agora.toLocaleString('pt-BR', { weekday: 'long' }).toLowerCase();
                const horario = config.horarios[diaSemana]; // Ex: { abertura: '06:30', fechamento: '20:00' }

                if (horario && horario.abertura && horario.fechamento) {
                    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
                    const [aberturaH, aberturaM] = horario.abertura.split(':').map(Number);
                    const [fechamentoH, fechamentoM] = horario.fechamento.split(':').map(Number);

                    const minAbertura = aberturaH * 60 + aberturaM;
                    const minFechamento = fechamentoH * 60 + fechamentoM;

                    if (horaAtual < minAbertura || horaAtual >= minFechamento) {
                       return NextResponse.json({
                         noProgram: true,
                         message: 'Fora do horário de funcionamento.'
                       }, { status: 200 });
                    }
                }
            }
        }
    }

    // 1. Identificar a programação ativa
    const gradeAtiva = db.prepare('SELECT * FROM programacao WHERE ativa = 1 LIMIT 1').get();

    // Se não há grade, retornamos um indicador específico
    if (!gradeAtiva) {
      return NextResponse.json({
        noProgram: true,
        message: 'Nenhuma grade de programação ativa encontrada.'
      }, { status: 200 });
    }

    let proximaMusicaList: any[] = [];
    const limit = 5;

    // 2. Busca todos os slots da grade
    const slots = db.prepare('SELECT * FROM programacao_slots WHERE programacao_id = ? ORDER BY ordem ASC').all(gradeAtiva.id);

    // 3. Verificar agendas de chamadas (intervalo)
    const chamadasSlot = slots.find((s: any) => s.type === 'chamadas');
    if (chamadasSlot && chamadasSlot.interval > 0) {
      const lastChamada = db.prepare("SELECT tocado_em FROM historico WHERE tipo = 'chamada' ORDER BY tocado_em DESC LIMIT 1").get() as any;

      let shouldPlayChamada = false;
      if (!lastChamada) {
          shouldPlayChamada = true;
      } else {
          // SQL para calcular diferença em minutos
          const diffResult = db.prepare('SELECT (julianday("now") - julianday(?)) * 1440 as diff').get(lastChamada.tocado_em) as any;
          if (diffResult && diffResult.diff >= chamadasSlot.interval) {
              shouldPlayChamada = true;
          }
      }

      if (shouldPlayChamada) {
           const chamada = db.prepare('SELECT id, titulo, audio_url as arquivo_url FROM chamadas WHERE ativa = 1 ORDER BY RANDOM() LIMIT 1').get() as any;
           if (chamada) {
               proximaMusicaList.push({
                   ...chamada,
                   artista: 'Spot',
                   duracao: 0,
                   tipo: 'chamada'
               });
           }
      }
    }

    // 4. Tenta encontrar músicas a partir do primeiro slot disponível que contenha músicas
    for (const slot of slots) {
      if (slot.type === 'musicas') {
        const musicas = db.prepare('SELECT id, titulo, artista, arquivo_url, duracao FROM musicas WHERE genero = ? ORDER BY RANDOM() LIMIT ?').all(slot.category, limit);
        proximaMusicaList = [...proximaMusicaList, ...musicas];
        if (proximaMusicaList.length > 0) break;
      } else if (slot.type === 'playlist') {
        const musicas = db.prepare(`
            SELECT m.id, m.titulo, m.artista, m.arquivo_url, m.duracao
            FROM musicas m
            JOIN playlist_musicas pm ON m.id = pm.musica_id
            WHERE pm.playlist_id = ?
            ORDER BY RANDOM() LIMIT ?
        `).all(slot.category, limit);
        proximaMusicaList = [...proximaMusicaList, ...musicas];
        if (proximaMusicaList.length > 0) break;
      }
    }

    return NextResponse.json(proximaMusicaList);
  } catch (error) {
    console.error('Erro ao buscar fila de músicas:', error);
    return NextResponse.json({ error: 'Erro ao buscar fila de músicas' }, { status: 500 });
  }
}
