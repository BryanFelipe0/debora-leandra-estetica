/* =========================================================
   Débora Leandra Estética — script.js
   Etapa 3: menu responsivo, voltar ao topo e animações ao rolar
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   0. APOIO
   --------------------------------------------------------- */

// Garante a classe "js" no <html>, caso o trecho do <head> não esteja lá.
document.documentElement.classList.add('js');

// Devolve true se a pessoa pediu "reduzir movimento" no aparelho.
function movimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


/* ---------------------------------------------------------
   1. ALTURA DO CABEÇALHO
   Mede o cabeçalho e guarda o valor no CSS (--altura-cabecalho),
   para os títulos não ficarem escondidos atrás dele ao rolar.
   --------------------------------------------------------- */
function ajustarAlturaDoCabecalho() {
  const cabecalho = document.querySelector('.cabecalho');
  if (!cabecalho) return;

  const atualizar = () => {
    document.documentElement.style.setProperty(
      '--altura-cabecalho',
      cabecalho.offsetHeight + 'px'
    );
  };

  atualizar();

  if ('ResizeObserver' in window) {
    new ResizeObserver(atualizar).observe(cabecalho);
  } else {
    window.addEventListener('resize', atualizar);
  }
}


/* ---------------------------------------------------------
   2. MENU RESPONSIVO
   O botão alterna o atributo aria-expanded ("true" ou "false").
   O CSS mostra ou esconde o menu de acordo com esse atributo.
   --------------------------------------------------------- */
function iniciarMenu() {
  const cabecalho = document.querySelector('.cabecalho');
  const botao = document.querySelector('.cabecalho__menu-botao');
  const menu = document.getElementById('menu-principal');
  if (!cabecalho || !botao || !menu) return;

  // Mesma largura em que o CSS troca para o menu de computador
  const telaGrande = window.matchMedia('(min-width: 70em)');

  const estaAberto = () => botao.getAttribute('aria-expanded') === 'true';

  const abrir = () => botao.setAttribute('aria-expanded', 'true');

  const fechar = (devolverFoco = false) => {
    botao.setAttribute('aria-expanded', 'false');
    if (devolverFoco) botao.focus();
  };

  // Clique no botão: abre ou fecha
  botao.addEventListener('click', () => {
    if (estaAberto()) {
      fechar();
    } else {
      abrir();
    }
  });

  // Clique em um link do menu: fecha o menu
  menu.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) fechar();
  });

  // Clique fora do cabeçalho: fecha o menu
  document.addEventListener('click', (evento) => {
    if (estaAberto() && !cabecalho.contains(evento.target)) fechar();
  });

  // Tecla Esc: fecha o menu e, se o foco estava nele, volta para o botão
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && estaAberto()) {
      fechar(cabecalho.contains(document.activeElement));
    }
  });

  // Se o foco do teclado sair do cabeçalho, o menu fecha
  document.addEventListener('focusin', (evento) => {
    if (estaAberto() && !cabecalho.contains(evento.target)) fechar();
  });

  // Ao passar para a tela grande, o menu volta ao estado "fechado"
  telaGrande.addEventListener('change', () => fechar());
}


/* ---------------------------------------------------------
   3. BOTÃO DE VOLTAR AO TOPO
   Aparece quando a seção inicial sai da tela.
   --------------------------------------------------------- */
function iniciarVoltarAoTopo() {
  const botao = document.querySelector('.voltar-topo');
  const inicio = document.getElementById('inicio');
  if (!botao || !inicio) return;

  const classeVisivel = 'voltar-topo--visivel';

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(([entrada]) => {
      botao.classList.toggle(classeVisivel, !entrada.isIntersecting);
    });
    observador.observe(inicio);
  } else {
    // Navegador antigo: deixa o botão sempre visível
    botao.classList.add(classeVisivel);
  }

  botao.addEventListener('click', (evento) => {
    evento.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: movimentoReduzido() ? 'auto' : 'smooth'
    });

    // Leva o foco do teclado e do leitor de tela para o título do topo
    const titulo = document.getElementById('titulo-inicio');
    if (titulo) {
      titulo.setAttribute('tabindex', '-1');
      titulo.focus({ preventScroll: true });
    }
  });
}


/* ---------------------------------------------------------
   4. ANIMAÇÕES AO ROLAR
   Os elementos abaixo da tela ganham a classe "revelar"
   (escondidos) e a classe "revelar--visivel" quando aparecem.
   --------------------------------------------------------- */
function iniciarRevelacaoAoRolar() {
  // Sem animação para quem pediu menos movimento ou em navegador antigo
  if (movimentoReduzido() || !('IntersectionObserver' in window)) return;

  // O que será animado (para animar mais itens no futuro, inclua aqui)
  const seletores = [
    'main > section:not(.inicio) > h2',
    '.sobre p',
    '.categoria',
    '.agendar li',
    '.agendar p',
    '.localizacao address',
    '.localizacao p'
  ];

  // Só anima o que está abaixo da parte visível da tela agora
  const alturaDaJanela = window.innerHeight;
  const elementos = Array.from(document.querySelectorAll(seletores.join(',')))
    .filter((elemento) => elemento.getBoundingClientRect().top > alturaDaJanela);

  elementos.forEach((elemento) => elemento.classList.add('revelar'));

  // Atraso escalonado entre irmãos: o 1º aparece já, o 2º um pouco depois, etc.
  elementos.forEach((elemento) => {
    const irmaos = Array.from(elemento.parentElement.children)
      .filter((filho) => filho.classList.contains('revelar'));
    const posicao = Math.min(irmaos.indexOf(elemento), 4);
    elemento.style.setProperty('--atraso', posicao * 90 + 'ms');
  });

  const observador = new IntersectionObserver((entradas, observadorAtual) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('revelar--visivel');
      observadorAtual.unobserve(entrada.target); // anima só uma vez
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  elementos.forEach((elemento) => observador.observe(elemento));
}


/* ---------------------------------------------------------
   5. INICIAR TUDO
   --------------------------------------------------------- */
ajustarAlturaDoCabecalho();
iniciarMenu();
iniciarVoltarAoTopo();
iniciarRevelacaoAoRolar();


/* AMPLIAR CERTIFICADOS */

const modalCertificado = document.getElementById("certificado-modal");

if (modalCertificado) {
  const imagemAmpliada = modalCertificado.querySelector(
    ".certificado-modal__imagem"
  );

  const botaoFechar = modalCertificado.querySelector(
    ".certificado-modal__fechar"
  );


document.querySelectorAll(
  ".certificado__imagem, .certificado-card img, .resultados__galeria img, .estudio__galeria img"
).forEach(imagem => {
  imagem.addEventListener("click", () => {
    imagemAmpliada.src = imagem.src;
    imagemAmpliada.alt = imagem.alt;
    modalCertificado.classList.add("ativo");
  });
});

  function fecharCertificado() {
    modalCertificado.classList.remove("ativo");
    imagemAmpliada.removeAttribute("src");
  }

  botaoFechar.addEventListener("click", fecharCertificado);

  modalCertificado.addEventListener("click", evento => {
    if (evento.target === modalCertificado) {
      fecharCertificado();
    }
  });

  document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
      fecharCertificado();
    }
  });
}


/* ===== BORBOLETA MÁGICA COM RASTRO DOURADO ===== */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#borboleta-magica");
  if (!container) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const borboleta = container.querySelector(".borboleta-desenho");
  const linha = container.querySelector(".rastro-linha");
  const luz = container.querySelector(".rastro-luz");
  const caminho = linha;

  if (!borboleta || !linha || !luz) return;

  const duracao = 7000;
  const comprimento = caminho.getTotalLength();
  const inicio = performance.now();

  // Tamanho da cauda luminosa em relação ao caminho
  const tamanhoRastro = comprimento * 0.22;

  // Mantém o caminho escondido inicialmente
  [linha, luz].forEach(elemento => {
    elemento.style.strokeDasharray = `0 ${comprimento + 10}`;
    elemento.style.opacity = "0";
  });

  function animar(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const distancia = progresso * comprimento;

    // Posição da borboleta sobre a curva
    const ponto = caminho.getPointAtLength(distancia);

    // Converte coordenadas do SVG para a tela
    const svg = caminho.ownerSVGElement;
    const matriz = svg.getScreenCTM();

    if (!matriz) return;

    const posicao = new DOMPoint(ponto.x, ponto.y).matrixTransform(matriz);
    const area = container.getBoundingClientRect();

    borboleta.style.left = `${posicao.x - area.left}px`;
    borboleta.style.top = `${posicao.y - area.top}px`;

    // Rastro cresce atrás da borboleta e
    // o início desaparece progressivamente
    const inicioRastro = Math.max(0, distancia - tamanhoRastro);
    const trechoVisivel = distancia - inicioRastro;

    [linha, luz].forEach((elemento, indice) => {
      elemento.style.strokeDasharray =
        `0 ${inicioRastro} ${trechoVisivel} ${comprimento + 10}`;

      elemento.style.opacity =
        progresso > 0.92
          ? String((1 - progresso) / 0.08 * (indice === 0 ? 0.55 : 0.3))
          : String(indice === 0 ? 0.55 : 0.3);
    });

    // Entrada e saída suave da borboleta
    borboleta.style.opacity =
      String(Math.min(1, progresso * 12, (1 - progresso) * 12));

    if (progresso < 1) {
      requestAnimationFrame(animar);
    } else {
      borboleta.style.opacity = "0";
      linha.style.opacity = "0";
      luz.style.opacity = "0";
    }
  }

  requestAnimationFrame(animar);
});
