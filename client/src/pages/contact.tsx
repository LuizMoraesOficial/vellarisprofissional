import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    content: "contato@vellaris.com.br",
    subtitle: "Respondemos em até 24h",
  },
  {
    icon: Phone,
    title: "Telefone",
    content: "+55 (11) 99999-9999",
    subtitle: "Seg a Sex, 9h às 18h",
  },
  {
    icon: MapPin,
    title: "Endereço",
    content: "São Paulo, SP",
    subtitle: "Brasil",
  },
  {
    icon: Clock,
    title: "Horário",
    content: "Seg - Sex: 9h às 18h",
    subtitle: "Sáb: 9h às 13h",
  },
];

export default function Contact() {
  return (
    <main className="pt-20 md:pt-24">
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Fale Conosco
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mt-4 mb-6">
              Entre em Contato
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Estamos aqui para ajudar. Envie sua mensagem e nossa equipe 
              entrará em contato o mais breve possível.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-2xl font-medium mb-8">
                Informações de Contato
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4"
                    data-testid={`contact-info-${index}`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{info.title}</p>
                      <p className="text-foreground">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-md p-6">
                <h3 className="font-medium mb-4">Para Profissionais</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Se você é proprietário de salão ou profissional da beleza, 
                  temos condições especiais para você. Entre em contato para 
                  conhecer nossa linha profissional e condições de parceria.
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Email exclusivo: </span>
                  <span className="text-primary">profissionais@vellaris.com.br</span>
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-medium mb-8">
                Envie sua Mensagem
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
