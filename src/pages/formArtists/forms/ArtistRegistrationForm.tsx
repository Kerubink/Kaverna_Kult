import { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InputMask from "react-input-mask";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const ArtistRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contato: "",
    password: "",
    portfolioLink: "",
    description: "",
    username: "",
    profileImage: "",
    banner: "",
    popularity: 1,
    totalProducts: 0,
    totalSales: 0,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateStep = (step) => {
    let validationErrors = {};
    
    if (step === 0) {
      if (!formData.fullName) validationErrors.fullName = "Nome completo é obrigatório";
      if (!formData.contato) validationErrors.contato = "Contato é obrigatório";
    }

    if (step === 1) {
      if (!formData.portfolioLink) validationErrors.portfolioLink = "Link do portfólio é obrigatório";
      if (!formData.description) validationErrors.description = "A descrição é obrigatória";
    }

    if (step === 2) {
      if (!formData.email) validationErrors.email = "Email é obrigatório";
      if (!formData.username) validationErrors.username = "Nome de usuário é obrigatório";
      if (!formData.password) validationErrors.password = "Senha é obrigatória";
      else if (formData.password.length < 6) validationErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    setError(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
  
    setLoading(true);
    setError({});
    setStatusMessage("");
  
    const { email, password, fullName, username, contato, portfolioLink, description } = formData;
  
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Enviar e-mail de verificação
      await sendEmailVerification(user);
  
      const db = getFirestore();
  
      // Criar usuário na coleção "users"
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email,
        fullName,
        username,
        contato,
        role: "artist", // O usuário ainda não foi aprovado
        status: "pending",
        createdAt: new Date(),
      });
  
      // Criar artista na coleção "artists_pending"
      const artistDocRef = doc(db, "artists_pending", user.uid);
      await setDoc(artistDocRef, {
        fullName,
        portfolioLink,
        email,
        contato,
        description,
        profileImage: "",
        banner: "",
        username,
        popularity: 1,
        totalProducts: 0,
        totalSales: 0,
        status: "pending",
        uid: user.uid,
        createdAt: new Date(),
      });
  
      setFormData({
        fullName: "",
        email: "",
        contato: "",
        password: "",
        username: "",
        portfolioLink: "",
        description: "",
        banner: "",
        popularity: 1,
        totalProducts: 0,
        totalSales: 0,
        profileImage: "",
      });
  
      setStatusMessage("Cadastro realizado! Verifique seu e-mail para confirmar sua conta.");
  
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setError({ general: "Erro ao registrar. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };
  
  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };



  return (
        <Card className="border-0 shadow-none">
          <CardHeader className="p-3">
            <CardTitle>Cadastro de Artista</CardTitle>
            <CardDescription>
              Cadastre-se para enviar seu portfólio e começar a vender suas estampas.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmitRegistration} className="w-full">
            <CardContent className="p-3">
              {currentStep === 0 && (
                <>
                  <div>
                    <label htmlFor="fullName" className="block text-gray-600 mb-2">
                      Nome Completo
                    </label>
                    <input
                      id="fullName"
                      placeholder="Nome Completo"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.fullName ? 'border-red-500' : ''}`}
                    />
                    {error.fullName && <p className="text-red-500 text-sm">{error.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="contato" className="block text-gray-600 mb-2">
                      Contato
                    </label>
                    <InputMask
                      id="contato"
                      mask="(99) 99999-9999"
                      placeholder="Número para contato"
                      name="contato"
                      type="contato"
                      value={formData.contato}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.contato? 'border-red-500' : ''}`}
                    />
                    {error.contato && <p className="text-red-500 text-sm">{error.contato}</p>}
                  </div>

                 
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div>
                    <label htmlFor="portfolioLink" className="block text-gray-600 mb-2">
                      Link do Portfólio
                    </label>
                    <input
                      id="portfolioLink"
                      placeholder="Portfolio, site, instagram, etc."
                      name="portfolioLink"
                      type="url"
                      value={formData.portfolioLink}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.portfolioLink ? 'border-red-500' : ''}`}
                    />
                    {error.portfolioLink && <p className="text-red-500 text-sm">{error.portfolioLink}</p>}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-gray-600 mb-2">
                      Descrição Pessoal
                    </label>
                    <textarea
                      id="description"
                      placeholder="Descreva o seu estilo de arte."
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.description ? 'border-red-500' : ''}`}
                    />
                    {error.description && <p className="text-red-500 text-sm">{error.description}</p>}
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                 <div>
                    <label htmlFor="username" className="block text-gray-600 mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      placeholder="artista123"
                      type="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.username ? 'border-red-500' : ''}`}
                    />
                    {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-600 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      placeholder="emailExemplo@gmail.com"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.email ? 'border-red-500' : ''}`}
                    />
                    {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-gray-600 mb-2">
                      Senha
                    </label>
                    <input
                      id="password"
                      name="password"
                      placeholder="senhaExemplo123"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.password ? 'border-red-500' : ''}`}
                    />
                    {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                  </div>
                </>
              )}

              {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}
              {statusMessage && <p className="text-green-400 text-center mb-4">{statusMessage}</p>}
            </CardContent>

            <CardFooter className="p-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="mr-2 bg-gray-300 text-black"
                >
                  Voltar
                </Button>
              )}
              {currentStep < 2 ? (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleNextStep}
                  className="bg-gradient-to-bl from-violet-500 to-fuchsia-500 p-3 text-white rounded-lg"
                >
                  Próxima Etapa
                </Button>
              ) : (
                <Button
                  variant="outline"
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-bl from-violet-500 to-fuchsia-500 p-3 text-white rounded-lg"
                >
                  {loading ? "Carregando..." : "Cadastrar"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>

  );
};

export default ArtistRegistrationForm;
