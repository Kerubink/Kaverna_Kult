import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ArtistDocumentationPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Cabeçalho */}
      <header className="bg-gray-800 shadow">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center">
          <h1 className="text-2xl font-bold text-blue-400">
            Kaverna Kult - Para artistas
          </h1>
          <p className="mt-2 text-base text-gray-400">
            Guia completo para transformar sua arte em renda na plataforma.
          </p>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar fixa para navegação */}
        <aside className="md:col-span-1 md:sticky top-20 h-fit">
          <nav className="space-y-3 text-sm">
            {[
              { id: "overview", label: "Visão Geral" },
              { id: "registration", label: "Cadastro" },
              { id: "portfolio-analysis", label: "Análise do Portfólio" },
              { id: "submission", label: "Envio de Estampas" },
              { id: "pricing", label: "Precificação" },
              { id: "commission", label: "Comissões e Pagamentos" },
              { id: "approval", label: "Política de Aprovação" },
              { id: "faq", label: "FAQ" },
            ].map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-blue-400 hover:text-blue-300 transition"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <article className="md:col-span-3 space-y-12">
          {[
            {
              id: "overview",
              title: "Visão Geral",
              content:
                "A Kaverna Kult é uma loja online que apoia e remunera artistas ao permitir que enviem suas estampas para venda. A plataforma oferece uma forma justa e transparente de transformar a arte em uma fonte de renda, garantindo aos artistas um mercado dedicado para suas criações.",
            },
            {
              id: "registration",
              title: "Cadastro",
              content:
                "O processo de cadastro é simples. Basta preencher o formulário na plataforma com suas informações pessoais, e-mail e portfólio. Após o envio, seu portfólio será analisado para verificar a qualidade e adequação das estampas ao nosso mercado. Caso aprovado, você será convidado a enviar suas criações para a venda.",
            },
            {
              id: "portfolio-analysis",
              title: "Análise do Portfólio",
              content:
                "A análise do portfólio é feita com base em critérios técnicos e criativos, como qualidade visual, originalidade, e a compatibilidade das estampas com os padrões e valores da Kaverna Kult. Cada portfólio é avaliado individualmente, e o feedback será fornecido para aprimorar ainda mais o seu trabalho.",
            },
            {
              id: "submission",
              title: "Envio de Estampas",
              content:
                "Após a aprovação do portfólio, você poderá enviar suas estampas para a plataforma. Certifique-se de seguir as diretrizes de qualidade da Kaverna Kult, que incluem especificações sobre formato de arquivo, resolução e estilo das estampas. Cada estampa enviada será revisada para garantir que atenda aos requisitos da loja.",
            },
            {
              id: "pricing",
              title: "Precificação",
              content:
                "A precificação das estampas é feita levando em consideração os custos de produção, a comissão do artista e a margem de lucro da plataforma. A Kaverna Kult oferece orientações para ajudar a definir um valor justo e competitivo para suas criações. Você terá controle sobre os preços e pode ajustá-los conforme necessário.",
            },
            {
              id: "commission",
              title: "Comissões e Pagamentos",
              content:
                "As comissões são pagas mensalmente, com fechamento no dia 5 e pagamento no dia 10 do mês seguinte. O pagamento é feito diretamente na conta bancária indicada durante o cadastro. A Kaverna Kult se compromete a manter um sistema transparente e justo, garantindo que você receba a sua remuneração por cada venda realizada.",
            },
            {
              id: "approval",
              title: "Política de Aprovação",
              content:
                "Na Kaverna Kult, apenas obras originais e de alta qualidade são aprovadas para venda. Obras plagiadas, com conteúdo ofensivo ou que infrinjam direitos autorais serão rejeitadas. Nosso objetivo é garantir que cada estampa represente um padrão elevado de arte e contribua para a experiência do nosso público.",
            },
          ].map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">
                {section.title}
              </h2>
              <p className="text-base text-justify text-gray-300 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}

          {/* Seção: FAQ */}
          <section id="faq">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">
              Perguntas Frequentes (FAQ)
            </h2>
            <Accordion type="single" collapsible>
              {[
                {
                  question: "Como faço o cadastro?",
                  answer:
                    "Basta preencher o formulário na plataforma com suas informações e portfólio. Após o envio, seu portfólio será analisado para aprovação.",
                },
                {
                  question: "Quanto tempo leva a análise do portfólio?",
                  answer:
                    "Normalmente, concluímos a análise em até 2 dias úteis. O feedback será enviado para aprimorar o portfólio, caso necessário.",
                },
                {
                  question: "Como funcionam as comissões?",
                  answer:
                    "As comissões são calculadas sobre o valor final da venda e pagas mensalmente, com fechamento no dia 5 e pagamento no dia 10.",
                },
                {
                  question: "Posso enviar mais de uma estampa por vez?",
                  answer:
                    "Sim, você pode enviar várias estampas. Cada uma será analisada individualmente antes da aprovação.",
                },
                {
                  question:
                    "Quais formatos de arquivo são aceitos para o envio das estampas?",
                  answer:
                    "Aceitamos arquivos nos formatos PNG, JPG e SVG, com no mínimo 150 DPI para garantir boa qualidade de impressão.",
                },
                {
                  question: "Posso remover minhas estampas da plataforma?",
                  answer:
                    "Sim, você pode retirar suas estampas a qualquer momento. Porém, as estampas já vendidas ainda serão enviadas aos clientes.",
                },
                {
                  question:
                    "Posso vender estampas que já publiquei em outras plataformas?",
                  answer:
                    "Sim, você pode vender estampas que já publicou em outras plataformas, desde que sejam de sua autoria e não infrijam direitos autorais.",
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </article>
      </div>
    </div>
  );
};

export default ArtistDocumentationPage;
