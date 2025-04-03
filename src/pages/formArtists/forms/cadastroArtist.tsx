import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

const ArtistRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    portfolioLink: "",
    description: "",
    socialLinks: "",
    profileImage: "",
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
      if (!formData.email) validationErrors.email = "Email é obrigatório";
      if (!formData.password) validationErrors.password = "Senha é obrigatória";
      else if (formData.password.length < 6) validationErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    if (step === 1) {
      if (!formData.portfolioLink) validationErrors.portfolioLink = "Link do portfólio é obrigatório";
      if (!formData.description) validationErrors.description = "A descrição é obrigatória";
    }

    if (step === 2) {
      if (!formData.socialLinks) validationErrors.socialLinks = "Links sociais são obrigatórios";
      if (!formData.profileImage) validationErrors.profileImage = "Imagem de perfil é obrigatória";
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

    const {
      email,
      password,
      fullName,
      portfolioLink,
      description,
      socialLinks,
      profileImage,
    } = formData;

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const db = getFirestore();
      const artistDocRef = doc(db, "artists_pending", user.uid);
      await setDoc(artistDocRef, {
        fullName,
        portfolioLink,
        description,
        socialLinks,
        profileImage,
        status: "pending",
        uid: user.uid,
      });

      setFormData({
        fullName: "",
        email: "",
        password: "",
        portfolioLink: "",
        description: "",
        socialLinks: "",
        profileImage: "",
      });

      setStatusMessage("Cadastro realizado com sucesso! Seu portfólio será analisado.");

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
                    <label htmlFor="email" className="block text-gray-600 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
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

              {currentStep === 1 && (
                <>
                  <div>
                    <label htmlFor="portfolioLink" className="block text-gray-600 mb-2">
                      Link do Portfólio
                    </label>
                    <input
                      id="portfolioLink"
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
                    <label htmlFor="socialLinks" className="block text-gray-600 mb-2">
                      Links Sociais
                    </label>
                    <input
                      id="socialLinks"
                      name="socialLinks"
                      type="url"
                      value={formData.socialLinks}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.socialLinks ? 'border-red-500' : ''}`}
                    />
                    {error.socialLinks && <p className="text-red-500 text-sm">{error.socialLinks}</p>}
                  </div>

                  <div>
                    <label htmlFor="profileImage" className="block text-gray-600 mb-2">
                      Imagem de Perfil
                    </label>
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      required
                      className={`w-full p-3 bg-white border border-gray-300 text-black rounded-lg ${error.profileImage ? 'border-red-500' : ''}`}
                    />
                    {error.profileImage && <p className="text-red-500 text-sm">{error.profileImage}</p>}
                  </div>
                </>
              )}

              {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}
              {statusMessage && <p className="text-yellow-400 text-center mb-4">{statusMessage}</p>}
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
